/**
 * Booking email uses SMTP only (no third-party transactional APIs).
 */
const required = ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD", "SMTP_FROM_EMAIL"];

for (const key of required) {
  if (!process.env[key] && process.env.CI !== "true") {
    console.log(`booking-email-provider-selftest: note ${key} not set locally (OK for dev)`);
  }
}

if (process.env.RESEND_API_KEY) {
  console.error("booking-email-provider-selftest: FAIL RESEND_API_KEY should not be used");
  process.exit(1);
}

console.log("booking-email-provider-selftest: OK provider smtp");
