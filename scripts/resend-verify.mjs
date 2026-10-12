/**
 * Verifies RESEND_API_KEY is present (does not send mail or print the key).
 */
import { loadEnvLocal } from "./load-env-local.mjs";

loadEnvLocal();

const key = process.env.RESEND_API_KEY?.trim();
const from = process.env.BOOKING_FROM_EMAIL?.trim() || process.env.RESEND_FROM_EMAIL?.trim();

if (!key) {
  console.error("resend-verify: FAIL RESEND_API_KEY not set");
  process.exit(1);
}
if (!from) {
  console.error("resend-verify: FAIL BOOKING_FROM_EMAIL not set");
  process.exit(1);
}

console.log("resend-verify: PASS key and from configured (domain must be verified in Resend for live delivery)");
