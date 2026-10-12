import { sendBookingConfirmationEmail } from "@/lib/booking-email";
import { updateBookingEmailDelivery } from "@/lib/booking-store";
import type { SpaBooking } from "@/lib/booking-types";

export async function deliverBookingConfirmation(booking: SpaBooking): Promise<{
  emailSent: boolean;
  emailSkipped: boolean;
  emailError?: string;
  resendMessageId?: string;
}> {
  if (booking.emailDelivery?.status === "sent" && booking.emailDelivery.resendMessageId) {
    return {
      emailSent: true,
      emailSkipped: false,
      resendMessageId: booking.emailDelivery.resendMessageId,
    };
  }

  const attempt = (booking.emailDelivery?.attempts ?? 0) + 1;
  updateBookingEmailDelivery(booking.id, {
    status: "pending",
    attempts: attempt,
    lastAttemptAt: new Date().toISOString(),
    recipient: booking.email,
  });

  const result = await sendBookingConfirmationEmail(booking);

  if (result.ok) {
    updateBookingEmailDelivery(booking.id, {
      status: "sent",
      resendMessageId: result.messageId,
      attempts: attempt,
      lastAttemptAt: new Date().toISOString(),
      lastError: undefined,
      recipient: booking.email,
    });
    return { emailSent: true, emailSkipped: false, resendMessageId: result.messageId };
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
