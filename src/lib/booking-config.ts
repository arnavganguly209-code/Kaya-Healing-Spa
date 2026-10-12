import { bookingFromAddress, resendApiKey, spaPublicUrl } from "@/lib/spa-config";

export type BookingConfigIssue = {
  code: string;
  message: string;
  severity: "error" | "warning";
};

export function assessBookingConfig(): BookingConfigIssue[] {
  const issues: BookingConfigIssue[] = [];
  const isProd = process.env.NODE_ENV === "production";

  if (!resendApiKey()) {
    issues.push({
      code: "RESEND_API_KEY_MISSING",
      message: "Booking confirmation emails are disabled until RESEND_API_KEY is set.",
      severity: isProd ? "error" : "warning",
    });
  }

  if (!process.env.RESEND_FROM_EMAIL?.trim()) {
    issues.push({
      code: "RESEND_FROM_EMAIL_DEFAULT",
      message: "Using default sender booking@kayahealingspa.com.np (set RESEND_FROM_EMAIL to override).",
      severity: "warning",
    });
  }

  if (!process.env.BOOKING_PDF_SECRET?.trim()) {
    issues.push({
      code: "BOOKING_PDF_SECRET_MISSING",
      message: "Set BOOKING_PDF_SECRET in production (do not rely on dev fallbacks).",
      severity: isProd ? "error" : "warning",
    });
  }

  const publicUrl = spaPublicUrl();
  if (!publicUrl.includes("kayahealingspa.com.np") && isProd) {
    issues.push({
      code: "SPA_PUBLIC_URL",
      message: "SPA_PUBLIC_URL or NEXT_PUBLIC_SITE_URL should point at https://kayahealingspa.com.np for production emails/PDFs.",
      severity: "warning",
    });
  }

  if (!bookingFromAddress().includes("@")) {
    issues.push({
      code: "RESEND_FROM_INVALID",
      message: "RESEND_FROM_EMAIL is not a valid address.",
      severity: "error",
    });
  }

  return issues;
}

export function logBookingConfigIssues(): void {
  const issues = assessBookingConfig();
  for (const issue of issues) {
    const line = `[booking-config] ${issue.code}: ${issue.message}`;
    if (issue.severity === "error") console.error(line);
    else console.warn(line);
  }
}
