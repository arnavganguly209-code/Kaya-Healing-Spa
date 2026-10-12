import { bookingEmailProvider, bookingFromEmail, spaPublicUrl } from "@/lib/spa-config";
import { resendConfigured } from "@/lib/resend-mail";
import { smtpConfigured } from "@/lib/smtp-mail";

export type BookingConfigIssue = {
  code: string;
  message: string;
  severity: "error" | "warning";
};

export function assessBookingConfig(): BookingConfigIssue[] {
  const issues: BookingConfigIssue[] = [];
  const isProd = process.env.NODE_ENV === "production";
  const provider = bookingEmailProvider();

  if (provider === "resend") {
    if (!resendConfigured()) {
      issues.push({
        code: "RESEND_NOT_CONFIGURED",
        message: "Booking emails use Resend — set RESEND_API_KEY and BOOKING_FROM_EMAIL.",
        severity: isProd ? "error" : "warning",
      });
    }
  } else if (!smtpConfigured()) {
    issues.push({
      code: "SMTP_NOT_CONFIGURED",
      message: "Booking emails use SMTP — set SMTP_HOST, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM_EMAIL.",
      severity: isProd ? "error" : "warning",
    });
  }

  if (!bookingFromEmail()) {
    issues.push({
      code: "BOOKING_FROM_EMAIL_MISSING",
      message: "Set BOOKING_FROM_EMAIL (or SMTP_FROM_EMAIL).",
      severity: "error",
    });
  }

  if (!process.env.BOOKING_PDF_SECRET?.trim()) {
    issues.push({
      code: "BOOKING_PDF_SECRET_MISSING",
      message: "Set BOOKING_PDF_SECRET in production.",
      severity: isProd ? "error" : "warning",
    });
  }

  const publicUrl = spaPublicUrl();
  const allowedHosts = ["kayahealingspa.com.np", "kaya.theglobalorbit.com"];
  if (isProd && !allowedHosts.some((h) => publicUrl.includes(h))) {
    issues.push({
      code: "SPA_PUBLIC_URL",
      message:
        "SPA_PUBLIC_URL should be https://kayahealingspa.com.np or the demo host https://kaya.theglobalorbit.com.",
      severity: "warning",
    });
  }

  return issues;
}

export function logBookingConfigIssues(): void {
  console.info(`[booking-config] email provider: ${bookingEmailProvider()}`);
  for (const issue of assessBookingConfig()) {
    const line = `[booking-config] ${issue.code}: ${issue.message}`;
    if (issue.severity === "error") console.error(line);
    else console.warn(line);
  }
}
