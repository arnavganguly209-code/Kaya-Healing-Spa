/**
 * Checks required env keys exist (values not printed). Run after loadEnvLocal.
 */
import { loadEnvLocal } from "./load-env-local.mjs";

loadEnvLocal();

const required = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "SMTP_FROM_EMAIL",
  "SPA_PUBLIC_URL",
  "NEXT_PUBLIC_SITE_URL",
  "BOOKING_PDF_SECRET",
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

const publicUrl = process.env.SPA_PUBLIC_URL?.trim() || "";
if (!publicUrl.includes("kayahealingspa.com.np") && !publicUrl.includes("kaya.theglobalorbit.com")) {
  console.warn("go-live-check: WARN SPA_PUBLIC_URL is not a known Kaya host");
}

process.exit(fail ? 1 : 0);
