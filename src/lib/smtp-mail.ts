import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { smtpConfig, smtpFromAddress } from "@/lib/spa-config";

let cached: Transporter | null = null;
let cachedKey = "";

function transportKey(cfg: ReturnType<typeof smtpConfig>) {
  return `${cfg.host}:${cfg.port}:${cfg.secure}:${cfg.user}`;
}

export function sanitizeSmtpError(message: string): string {
  return message
    .replace(/SMTP_PASSWORD/gi, "SMTP_CREDENTIAL")
    .replace(/\bpass(?:word)?\s*[=:]\s*\S+/gi, "password=[redacted]")
    .replace(/AUTH[^.]+/gi, "AUTH [redacted]")
    .slice(0, 500);
}

export function createSmtpTransport(): Transporter | null {
  const cfg = smtpConfig();
  if (!cfg.password) return null;
  const key = transportKey(cfg);
  if (!cached || cachedKey !== key) {
    cached = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      requireTLS: cfg.starttls,
      auth: { user: cfg.user, pass: cfg.password },
      tls: { minVersion: "TLSv1.2", rejectUnauthorized: true },
      connectionTimeout: 20_000,
      greetingTimeout: 15_000,
      socketTimeout: 25_000,
    });
    cachedKey = key;
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

function isValidRecipient(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/[\r\n]/.test(email);
}

const mockSends: SmtpSendInput[] = [];

export function resetMockSmtpSends() {
  mockSends.length = 0;
}

export function getMockSmtpSends(): SmtpSendInput[] {
  return mockSends.slice();
}

export async function sendSmtpMail(input: SmtpSendInput): Promise<SmtpSendResult> {
  if (!isValidRecipient(input.to)) {
    return { ok: false, error: "Invalid recipient address" };
  }
  if (process.env.SMTP_MOCK === "1") {
    mockSends.push(input);
    if (process.env.SMTP_MOCK_FAIL === "1") {
      return { ok: false, error: "mock SMTP rejection" };
    }
    return { ok: true, messageId: "mock-smtp-accepted" };
  }
  const transport = createSmtpTransport();
  if (!transport) {
    return { ok: false, error: "SMTP is not configured (missing host or SMTP credential)", skipped: true };
  }
  try {
    const info = await transport.sendMail({
      from: smtpFromAddress(),
      to: input.to,
      subject: input.subject.replace(/[\r\n]/g, " "),
      html: input.html,
      text: input.text,
      attachments: input.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: "application/pdf",
      })),
    });
    const messageId = typeof info.messageId === "string" ? info.messageId : "smtp-accepted";
    return { ok: true, messageId };
  } catch (e) {
    const raw = e instanceof Error ? e.message : "SMTP send failed";
    return { ok: false, error: sanitizeSmtpError(raw) };
  }
}

export async function verifySmtpConnection(): Promise<{ ok: boolean; error?: string }> {
  const transport = createSmtpTransport();
  if (!transport) return { ok: false, error: "SMTP not configured" };
  try {
    await transport.verify();
    return { ok: true };
  } catch (e) {
    const raw = e instanceof Error ? e.message : "verify failed";
    return { ok: false, error: sanitizeSmtpError(raw) };
  }
}

export function smtpConfigured(): boolean {
  const cfg = smtpConfig();
  return Boolean(cfg.password && cfg.host && cfg.user);
}
