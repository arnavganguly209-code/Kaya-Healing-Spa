/**
 * Checks required env keys exist (values not printed). Run after loadEnvLocal.
 */
import { loadEnvLocal } from "./load-env-local.mjs";

loadEnvLocal();

const required = [
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "SPA_PUBLIC_URL",
  "NEXT_PUBLIC_SITE_URL",
  "BOOKING_PDF_SECRET",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
];

let fail = 0;
for (const key of required) {
  const val = process.env[key]?.trim();
  if (!val || val.includes("<") || val.includes("placeholder")) {
    console.error(`go-live-check: FAIL ${key} missing or placeholder`);
    fail++;
  } else {
    console.log(`go-live-check: OK ${key} set`);
  }
}

if (process.env.SPA_PUBLIC_URL !== "https://kayahealingspa.com.np") {
  console.warn("go-live-check: WARN SPA_PUBLIC_URL is not https://kayahealingspa.com.np");
}
if (process.env.RESEND_FROM_EMAIL !== "booking@kayahealingspa.com.np") {
  console.warn("go-live-check: WARN RESEND_FROM_EMAIL mismatch");
}

process.exit(fail ? 1 : 0);
