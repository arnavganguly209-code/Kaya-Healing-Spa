import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { smtpConfig, smtpFromAddress, smtpFromName } from "@/lib/spa-config";

let cached: Transporter | null = null;

function getTransport(): Transporter | null {
  const cfg = smtpConfig();
  if (!cfg.password) return null;
  if (!cached) {
    cached = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      requireTLS: cfg.starttls,
      auth: { user: cfg.user, pass: cfg.password },
      tls: { minVersion: "TLSv1.2", rejectUnauthorized: true },
    });
  }
  return cached;
}

export type SmtpSendInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: { filename: string; content: Buffer }[];
};

export type SmtpSendResult =
  | { ok: true; messageId: string }
  | { ok: false; error: string; skipped?: boolean };

export async function sendSmtpMail(input: SmtpSendInput): Promise<SmtpSendResult> {
  const transport = getTransport();
  if (!transport) {
    return { ok: false, error: "SMTP is not configured (missing SMTP_PASSWORD or host)", skipped: true };
  }
  try {
    const info = await transport.sendMail({
      from: smtpFromAddress(),
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      attachments: input.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: "application/pdf",
      })),
    });
    const messageId = typeof info.messageId === "string" ? info.messageId : "smtp-sent";
    return { ok: true, messageId };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "SMTP send failed";
    return { ok: false, error: msg };
  }
}

export function smtpConfigured(): boolean {
  return Boolean(smtpConfig().password && smtpConfig().host && smtpConfig().user);
}
