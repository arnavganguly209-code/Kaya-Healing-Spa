import { sendBookingConfirmationEmail } from "@/lib/booking-email";
import { findBookingById, updateBookingEmailDelivery } from "@/lib/booking-store";
import type { SpaBooking } from "@/lib/booking-types";
import { bookingEmailProvider } from "@/lib/spa-config";

function messageId(booking: SpaBooking): string | undefined {
  return booking.emailDelivery?.providerMessageId || booking.emailDelivery?.resendMessageId;
}

export async function deliverBookingConfirmation(
  booking: SpaBooking,
  options?: { forceResend?: boolean },
): Promise<{
  emailSent: boolean;
  emailSkipped: boolean;
  emailError?: string;
  providerMessageId?: string;
}> {
  const fresh = findBookingById(booking.id) ?? booking;
  const priorId = messageId(fresh);
  if (!options?.forceResend && fresh.emailDelivery?.status === "sent" && priorId) {
    return { emailSent: true, emailSkipped: false, providerMessageId: priorId };
  }

  const attempt = (fresh.emailDelivery?.attempts ?? 0) + 1;
  updateBookingEmailDelivery(fresh.id, {
    status: "pending",
    attempts: attempt,
    lastAttemptAt: new Date().toISOString(),
    recipient: fresh.email,
  });

  let result;
  try {
    result = await sendBookingConfirmationEmail(fresh);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Email/PDF delivery failed";
    console.error("[booking-email] delivery error", { bookingId: fresh.id, attempt, error: msg });
    updateBookingEmailDelivery(fresh.id, {
      status: "failed",
      attempts: attempt,
      lastAttemptAt: new Date().toISOString(),
      lastError: msg,
      recipient: fresh.email,
    });
    return { emailSent: false, emailSkipped: false, emailError: msg };
  }

  if (result.ok) {
    const patch: Parameters<typeof updateBookingEmailDelivery>[1] = {
      status: "sent",
      providerMessageId: result.messageId,
      attempts: attempt,
      lastAttemptAt: new Date().toISOString(),
      lastError: undefined,
      recipient: fresh.email,
    };
    if (bookingEmailProvider() === "resend") {
      patch.resendMessageId = result.messageId;
    }
    updateBookingEmailDelivery(fresh.id, patch);
    return { emailSent: true, emailSkipped: false, providerMessageId: result.messageId };
  }

  if (result.skipped) {
    updateBookingEmailDelivery(fresh.id, {
      status: "skipped",
      attempts: attempt,
      lastAttemptAt: new Date().toISOString(),
      lastError: result.error,
      recipient: fresh.email,
    });
    return { emailSent: false, emailSkipped: true, emailError: result.error };
  }

  console.error("[booking-email] send failed", { bookingId: fresh.id, attempt, error: result.error });
  updateBookingEmailDelivery(fresh.id, {
    status: "failed",
    attempts: attempt,
    lastAttemptAt: new Date().toISOString(),
    lastError: result.error,
    recipient: fresh.email,
  });
  return { emailSent: false, emailSkipped: false, emailError: result.error };
}
