import { site } from "@/lib/content";
import { loadRuntimeEnvFiles, runtimeEnv } from "@/lib/runtime-env";

const DEMO_SITE = "https://kaya.theglobalorbit.com";

export function spaPublicUrl(): string {
  const raw = runtimeEnv("SPA_PUBLIC_URL") || runtimeEnv("NEXT_PUBLIC_SITE_URL") || site.url;
  if (raw.includes("localhost") || raw.includes("127.0.0.1")) return DEMO_SITE;
  return raw.replace(/\/$/, "");
}

export function smtpFromEmail(): string {
  loadRuntimeEnvFiles();
  return runtimeEnv("SMTP_FROM_EMAIL") || runtimeEnv("SMTP_USER") || "booking@kayahealingspa.com.np";
}

export function smtpFromName(): string {
  return runtimeEnv("SMTP_FROM_NAME") || "Kaya Healing Spa";
}

export function smtpFromAddress(): string {
  const email = smtpFromEmail();
  if (!email) return smtpFromName();
  return `${smtpFromName()} <${email}>`;
}

/** Spa staff inbox for new-booking alerts (falls back to SMTP_USER). */
export function bookingNotificationEmail(): string {
  loadRuntimeEnvFiles();
  const configured = runtimeEnv("BOOKING_NOTIFICATION_EMAIL");
  if (configured) return configured;
  return runtimeEnv("SMTP_USER") || smtpFromEmail();
}

export function smtpConfig() {
  loadRuntimeEnvFiles();
  const host = runtimeEnv("SMTP_HOST") || "mail.globalorbitmail.cloud";
  const port = Number(runtimeEnv("SMTP_PORT") || 587);
  const secureExplicit = runtimeEnv("SMTP_SECURE").toLowerCase();
  const secure = secureExplicit === "true" || (secureExplicit !== "false" && port === 465);
  const user = runtimeEnv("SMTP_USER") || smtpFromEmail();
  const password = runtimeEnv("SMTP_PASSWORD");
  const starttls = !secure && port === 587;
  return { host, port, user, password, secure, starttls };
}

export function bookingPdfSecret(): string {
  loadRuntimeEnvFiles();
  const explicit = runtimeEnv("BOOKING_PDF_SECRET");
  if (explicit) return explicit;
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") {
    throw new Error("BOOKING_PDF_SECRET is required in production");
  }
  const fallback = runtimeEnv("ORBIT_PASSKEY");
  if (fallback) return fallback;
  return "dev-booking-pdf-secret-local-only";
}

export const SPA_BOOKING_PHONE = "01-5355882";
