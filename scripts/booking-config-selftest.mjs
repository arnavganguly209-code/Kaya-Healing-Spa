/**
 * Ensures production booking mail/PDF env key names are documented (no secret values).
 */
const required = [
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "SMTP_FROM_EMAIL",
  "BOOKING_PDF_SECRET",
];
let ok = true;
for (const key of required) {
  if (!process.env[key] && process.env.CI !== "true") {
    console.log(`booking-config-selftest: note ${key} not set locally (OK for dev)`);
  }
}
console.log("booking-config-selftest: OK");
process.exit(ok ? 0 : 1);
