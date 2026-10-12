import { smtpConfigured } from "@/lib/smtp-mail";
import { smtpFromEmail, spaPublicUrl } from "@/lib/spa-config";

export type BookingConfigIssue = {
  code: string;
  message: string;
  severity: "error" | "warning";
};

export function assessBookingConfig(): BookingConfigIssue[] {
  const issues: BookingConfigIssue[] = [];
  const isProd = process.env.NODE_ENV === "production";

  if (!smtpConfigured()) {
    issues.push({
      code: "SMTP_NOT_CONFIGURED",
      message: "Booking emails require SMTP_HOST, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM_EMAIL.",
      severity: isProd ? "error" : "warning",
    });
  }

  if (!smtpFromEmail()) {
    issues.push({
      code: "SMTP_FROM_EMAIL_MISSING",
      message: "Set SMTP_FROM_EMAIL (or SMTP_USER) for the From address.",
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
  for (const issue of assessBookingConfig()) {
    const line = `[booking-config] ${issue.code}: ${issue.message}`;
    if (issue.severity === "error") console.error(line);
    else console.warn(line);
  }
}
