import { Resend } from "resend";
import { bookingFromAddress, bookingFromEmail } from "@/lib/spa-config";

export type ResendSendInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: { filename: string; content: Buffer }[];
};

export type ResendSendResult =
  | { ok: true; messageId: string }
  | { ok: false; error: string; skipped?: boolean };

export function resendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && bookingFromEmail());
}

export async function sendResendMail(input: ResendSendInput): Promise<ResendSendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY is not configured", skipped: true };
  }
  if (!bookingFromEmail()) {
    return { ok: false, error: "BOOKING_FROM_EMAIL is not configured", skipped: true };
  }

  const resend = new Resend(apiKey);
  try {
    const { data, error } = await resend.emails.send({
      from: bookingFromAddress(),
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      attachments: input.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
      })),
    });

    if (error) {
      const msg = error.message || "Resend API error";
      if (/rate limit/i.test(msg)) {
        return { ok: false, error: "Resend rate limit — retry shortly" };
      }
      return { ok: false, error: msg };
    }

    const messageId = data?.id;
    if (!messageId) {
      return { ok: false, error: "Resend accepted the request but returned no message id" };
    }
    return { ok: true, messageId };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Resend send failed";
    return { ok: false, error: msg };
  }
}
