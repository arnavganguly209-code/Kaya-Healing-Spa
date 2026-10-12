import { site } from "@/lib/content";

export function spaPublicUrl(): string {
  const raw = process.env.SPA_PUBLIC_URL || process.env.NEXT_PUBLIC_SITE_URL || site.url;
  return raw.replace(/\/$/, "");
}

export function resendFromEmail(): string {
  const from = process.env.RESEND_FROM_EMAIL?.trim() || "booking@kayahealingspa.com.np";
  return `Kaya Healing Spa <${from}>`;
}

export function bookingFromAddress(): string {
  return process.env.RESEND_FROM_EMAIL?.trim() || "booking@kayahealingspa.com.np";
}

export function resendApiKey(): string | undefined {
  return process.env.RESEND_API_KEY?.trim() || undefined;
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
export const SPA_BOOKING_EMAIL = "booking@kayahealingspa.com.np";
