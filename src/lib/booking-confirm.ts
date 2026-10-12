import { sendBookingConfirmationEmail } from "@/lib/booking-email";
import { updateBookingEmailDelivery } from "@/lib/booking-store";
import type { SpaBooking } from "@/lib/booking-types";

function messageId(booking: SpaBooking): string | undefined {
  return booking.emailDelivery?.providerMessageId || booking.emailDelivery?.resendMessageId;
}

export async function deliverBookingConfirmation(booking: SpaBooking): Promise<{
  emailSent: boolean;
  emailSkipped: boolean;
  emailError?: string;
  providerMessageId?: string;
}> {
  const priorId = messageId(booking);
  if (booking.emailDelivery?.status === "sent" && priorId) {
    return { emailSent: true, emailSkipped: false, providerMessageId: priorId };
  }

  const attempt = (booking.emailDelivery?.attempts ?? 0) + 1;
  updateBookingEmailDelivery(booking.id, {
    status: "pending",
    attempts: attempt,
    lastAttemptAt: new Date().toISOString(),
    recipient: booking.email,
  });

  let result;
  try {
    result = await sendBookingConfirmationEmail(booking);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Email/PDF delivery failed";
    updateBookingEmailDelivery(booking.id, {
      status: "failed",
      attempts: attempt,
      lastAttemptAt: new Date().toISOString(),
      lastError: msg,
      recipient: booking.email,
    });
    return { emailSent: false, emailSkipped: false, emailError: msg };
  }

  if (result.ok) {
    updateBookingEmailDelivery(booking.id, {
      status: "sent",
      providerMessageId: result.messageId,
      attempts: attempt,
      lastAttemptAt: new Date().toISOString(),
      lastError: undefined,
      recipient: booking.email,
    });
    return { emailSent: true, emailSkipped: false, providerMessageId: result.messageId };
  }

  if (result.skipped) {
    updateBookingEmailDelivery(booking.id, {
      status: "skipped",
      attempts: attempt,
      lastAttemptAt: new Date().toISOString(),
      lastError: result.error,
      recipient: booking.email,
    });
    return { emailSent: false, emailSkipped: true, emailError: result.error };
  }

  updateBookingEmailDelivery(booking.id, {
    status: "failed",
    attempts: attempt,
    lastAttemptAt: new Date().toISOString(),
    lastError: result.error,
    recipient: booking.email,
  });
  return { emailSent: false, emailSkipped: false, emailError: result.error };
}
