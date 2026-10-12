import { site } from "@/lib/content";

const DEMO_SITE = "https://kaya.theglobalorbit.com";

export function spaPublicUrl(): string {
  const raw = process.env.SPA_PUBLIC_URL || process.env.NEXT_PUBLIC_SITE_URL || site.url;
  if (raw.includes("localhost") || raw.includes("127.0.0.1")) return DEMO_SITE;
  return raw.replace(/\/$/, "");
}

export function smtpFromEmail(): string {
  return (
    process.env.SMTP_FROM_EMAIL?.trim() ||
    process.env.SMTP_USER?.trim() ||
    process.env.RESEND_FROM_EMAIL?.trim() ||
    ""
  );
}

export function smtpFromName(): string {
  return process.env.SMTP_FROM_NAME?.trim() || "Kaya Healing Spa";
}

export function smtpFromAddress(): string {
  const email = smtpFromEmail();
  if (!email) return smtpFromName();
  return `${smtpFromName()} <${email}>`;
}

export function smtpConfig() {
  const host = process.env.SMTP_HOST?.trim() || "mail.globalorbitmail.cloud";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER?.trim() || smtpFromEmail();
  const password = process.env.SMTP_PASSWORD?.trim();
  const secure = process.env.SMTP_SECURE === "true";
  return { host, port, user, password, secure, starttls: !secure && port === 587 };
}

export function bookingPdfSecret(): string {
  const explicit = process.env.BOOKING_PDF_SECRET?.trim();
  if (explicit) return explicit;
  if (process.env.NODE_ENV === "production") {
    throw new Error("BOOKING_PDF_SECRET is required in production");
  }
  const fallback = process.env.ORBIT_PASSKEY?.trim();
  if (fallback) return fallback;
  return "dev-booking-pdf-secret-local-only";
}

export const SPA_BOOKING_PHONE = "01-5355882";
