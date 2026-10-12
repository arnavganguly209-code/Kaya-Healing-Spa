import { sendResendMail, type ResendSendResult } from "@/lib/resend-mail";
import { sendSmtpMail, smtpConfigured, type SmtpSendResult } from "@/lib/smtp-mail";
import { bookingEmailProvider } from "@/lib/spa-config";

export type BookingMailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: { filename: string; content: Buffer }[];
};

export type BookingMailResult = ResendSendResult | SmtpSendResult;

export async function sendBookingMail(payload: BookingMailPayload): Promise<BookingMailResult> {
  const provider = bookingEmailProvider();
  if (provider === "resend") {
    return sendResendMail(payload);
  }
  return sendSmtpMail(payload);
}

export function bookingMailConfigured(): boolean {
  const provider = bookingEmailProvider();
  if (provider === "resend") {
    return Boolean(process.env.RESEND_API_KEY?.trim());
  }
  return smtpConfigured();
}
