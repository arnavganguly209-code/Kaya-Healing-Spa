import {
  sendAdminBookingNotificationEmail,
  sendCustomerBookingConfirmationEmail,
} from "@/lib/booking-email";
import {
  findBookingById,
  updateBookingAdminEmailDelivery,
  updateBookingEmailDelivery,
} from "@/lib/booking-store";
import type { BookingEmailDelivery, SpaBooking } from "@/lib/booking-types";
import { bookingNotificationEmail } from "@/lib/spa-config";
import { sanitizeSmtpError } from "@/lib/smtp-mail";

const MAX_ATTEMPTS = 5;

export type DeliverBookingEmailOptions = {
  /** Retry customer email even if previously sent */
  forceCustomer?: boolean;
  /** Retry staff notification even if previously sent */
  forceAdmin?: boolean;
  /** @deprecated use forceCustomer + forceAdmin */
  forceResend?: boolean;
  sendCustomer?: boolean;
  sendAdmin?: boolean;
};

function messageId(delivery?: BookingEmailDelivery): string | undefined {
  return delivery?.providerMessageId || delivery?.resendMessageId;
}

function applyDeliveryResult(
  bookingId: string,
  field: "customer" | "admin",
  attempt: number,
  recipient: string,
  result: Awaited<ReturnType<typeof sendCustomerBookingConfirmationEmail>>,
) {
  const update = field === "customer" ? updateBookingEmailDelivery : updateBookingAdminEmailDelivery;
  const safeError = result.ok ? undefined : sanitizeSmtpError(result.error);
  if (result.ok) {
    update(bookingId, {
      status: "sent",
      providerMessageId: result.messageId,
      attempts: attempt,
      lastAttemptAt: new Date().toISOString(),
      lastError: undefined,
      recipient,
    });
    return { sent: true, skipped: false, messageId: result.messageId };
  }
  if (result.skipped) {
    update(bookingId, {
      status: "skipped",
      attempts: attempt,
      lastAttemptAt: new Date().toISOString(),
      lastError: safeError,
      recipient,
    });
    return { sent: false, skipped: true, error: safeError };
  }
  update(bookingId, {
    status: "failed",
    attempts: attempt,
    lastAttemptAt: new Date().toISOString(),
    lastError: safeError,
    recipient,
  });
  return { sent: false, skipped: false, error: safeError };
}

async function deliverCustomer(
  booking: SpaBooking,
  force: boolean,
): Promise<{ sent: boolean; skipped: boolean; error?: string; messageId?: string }> {
  const priorId = messageId(booking.emailDelivery);
  if (!force && booking.emailDelivery?.status === "sent" && priorId) {
    return { sent: true, skipped: false, messageId: priorId };
  }
  const attempt = (booking.emailDelivery?.attempts ?? 0) + 1;
  if (!force && attempt > MAX_ATTEMPTS && booking.emailDelivery?.status === "failed") {
    return {
      sent: false,
      skipped: false,
      error: booking.emailDelivery?.lastError || "Max customer email attempts reached",
    };
  }

  updateBookingEmailDelivery(booking.id, {
    status: "pending",
    attempts: attempt,
    lastAttemptAt: new Date().toISOString(),
    recipient: booking.email,
  });

  try {
    const result = await sendCustomerBookingConfirmationEmail(booking);
    return applyDeliveryResult(booking.id, "customer", attempt, booking.email, result);
  } catch (e) {
    const msg = sanitizeSmtpError(e instanceof Error ? e.message : "Customer email failed");
    updateBookingEmailDelivery(booking.id, {
      status: "failed",
      attempts: attempt,
      lastAttemptAt: new Date().toISOString(),
      lastError: msg,
      recipient: booking.email,
    });
    return { sent: false, skipped: false, error: msg };
  }
}

async function deliverAdmin(
  booking: SpaBooking,
  force: boolean,
  adminRecipient: string,
): Promise<{ sent: boolean; skipped: boolean; error?: string; messageId?: string }> {
  const priorId = messageId(booking.adminEmailDelivery);
  if (!force && booking.adminEmailDelivery?.status === "sent" && priorId) {
    return { sent: true, skipped: false, messageId: priorId };
  }
  const attempt = (booking.adminEmailDelivery?.attempts ?? 0) + 1;
  if (!force && attempt > MAX_ATTEMPTS && booking.adminEmailDelivery?.status === "failed") {
    return {
      sent: false,
      skipped: false,
      error: booking.adminEmailDelivery?.lastError || "Max staff email attempts reached",
    };
  }

  updateBookingAdminEmailDelivery(booking.id, {
    status: "pending",
    attempts: attempt,
    lastAttemptAt: new Date().toISOString(),
    recipient: adminRecipient,
  });

  try {
    const result = await sendAdminBookingNotificationEmail(booking);
    return applyDeliveryResult(booking.id, "admin", attempt, adminRecipient, result);
  } catch (e) {
    const msg = sanitizeSmtpError(e instanceof Error ? e.message : "Staff email failed");
    updateBookingAdminEmailDelivery(booking.id, {
      status: "failed",
      attempts: attempt,
      lastAttemptAt: new Date().toISOString(),
      lastError: msg,
      recipient: adminRecipient,
    });
    return { sent: false, skipped: false, error: msg };
  }
}

function idleCustomerResult(booking: SpaBooking) {
  const sent = booking.emailDelivery?.status === "sent";
  return {
    sent,
    skipped: booking.emailDelivery?.status === "skipped",
    error: booking.emailDelivery?.lastError,
    messageId: messageId(booking.emailDelivery),
  };
}

function idleAdminResult(booking: SpaBooking) {
  const sent = booking.adminEmailDelivery?.status === "sent";
  return {
    sent,
    skipped: booking.adminEmailDelivery?.status === "skipped",
    error: booking.adminEmailDelivery?.lastError,
    messageId: messageId(booking.adminEmailDelivery),
  };
}

export async function deliverBookingConfirmation(
  booking: SpaBooking,
  options?: DeliverBookingEmailOptions,
): Promise<{
  emailSent: boolean;
  emailSkipped: boolean;
  emailError?: string;
  providerMessageId?: string;
  adminEmailSent: boolean;
  adminEmailSkipped: boolean;
  adminEmailError?: string;
  adminProviderMessageId?: string;
}> {
  const fresh = findBookingById(booking.id) ?? booking;
  const legacyForce = Boolean(options?.forceResend);
  const sendCustomer = options?.sendCustomer ?? true;
  const sendAdmin = options?.sendAdmin ?? true;
  const forceCustomer = options?.forceCustomer ?? legacyForce;
  const forceAdmin = options?.forceAdmin ?? legacyForce;
  const adminRecipient = bookingNotificationEmail();

  const customer = sendCustomer
    ? await deliverCustomer(fresh, forceCustomer)
    : idleCustomerResult(fresh);

  const afterCustomer = findBookingById(fresh.id) ?? fresh;
  const admin = sendAdmin
    ? await deliverAdmin(afterCustomer, forceAdmin, adminRecipient)
    : idleAdminResult(afterCustomer);

  return {
    emailSent: customer.sent,
    emailSkipped: customer.skipped,
    emailError: customer.error,
    providerMessageId: customer.messageId,
    adminEmailSent: admin.sent,
    adminEmailSkipped: admin.skipped,
    adminEmailError: admin.error,
    adminProviderMessageId: admin.messageId,
  };
}
