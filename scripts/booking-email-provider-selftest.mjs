/**
 * Documents provider selection without sending mail.
 */
const provider = (() => {
  const raw = process.env.BOOKING_EMAIL_PROVIDER?.trim().toLowerCase();
  if (raw === "resend" || raw === "smtp") return raw;
  if (process.env.RESEND_API_KEY?.trim()) return "resend";
  return "smtp";
})();

if (provider !== "resend" && provider !== "smtp") {
  console.error("booking-email-provider-selftest: FAIL invalid provider", provider);
  process.exit(1);
}

const requiredResend = ["RESEND_API_KEY", "BOOKING_FROM_EMAIL"];
const requiredSmtp = ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD", "SMTP_FROM_EMAIL"];

for (const key of provider === "resend" ? requiredResend : requiredSmtp) {
  if (!process.env[key] && process.env.CI !== "true") {
    console.log(`booking-email-provider-selftest: note ${key} not set locally (OK for dev)`);
  }
}

console.log("booking-email-provider-selftest: OK provider", provider);
