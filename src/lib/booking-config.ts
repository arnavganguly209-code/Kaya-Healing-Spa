import { bookingNotificationEmail, smtpFromEmail, spaPublicUrl } from "@/lib/spa-config";
import { smtpConfigured } from "@/lib/smtp-mail";
import { loadRuntimeEnvFiles, runtimeEnv, smtpEnvPresent } from "@/lib/runtime-env";

export type BookingConfigIssue = {
  code: string;
  message: string;
  severity: "error" | "warning";
};

export function assessBookingConfig(): BookingConfigIssue[] {
  loadRuntimeEnvFiles();
  const issues: BookingConfigIssue[] = [];
  const isProd = process.env.NODE_ENV === "production";

  if (!smtpConfigured()) {
    issues.push({
      code: "SMTP_NOT_CONFIGURED",
      message:
        "Booking emails require SMTP_HOST, SMTP_USER, SMTP credential, and SMTP_FROM_EMAIL (mail.globalorbitmail.cloud).",
      severity: isProd ? "error" : "warning",
    });
  }

  if (!smtpFromEmail()) {
    issues.push({
      code: "SMTP_FROM_EMAIL_MISSING",
      message: "Set SMTP_FROM_EMAIL to booking@kayahealingspa.com.np (or SMTP_USER).",
      severity: "error",
    });
  }

  if (!bookingNotificationEmail()) {
    issues.push({
      code: "BOOKING_NOTIFICATION_EMAIL_MISSING",
      message: "Set BOOKING_NOTIFICATION_EMAIL for staff booking alerts.",
      severity: "warning",
    });
  }

  if (!runtimeEnv("BOOKING_PDF_SECRET")) {
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
  const present = smtpEnvPresent();
  console.info(
    `[booking-config] email provider: smtp keys host=${present.host ? "yes" : "no"} user=${present.user ? "yes" : "no"} password=${present.password ? "yes" : "no"} from=${present.from ? "yes" : "no"} pdfSecret=${present.pdfSecret ? "yes" : "no"} (values not logged)`,
  );
  for (const issue of assessBookingConfig()) {
    const line = `[booking-config] ${issue.code}: ${issue.message}`;
    if (issue.severity === "error") console.error(line);
    else console.warn(line);
  }
}
