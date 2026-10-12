import { createRequire } from "module";

// Self-contained mirror of publicBookingEmailError for node tests without TS build.
function publicBookingEmailError(error) {
  if (!error?.trim()) return undefined;
  const lower = error.toLowerCase();
  if (
    lower.includes("smtp") ||
    lower.includes("auth") ||
    lower.includes("certificate") ||
    lower.includes("password") ||
    lower.includes("credential") ||
    lower.includes("econn") ||
    lower.includes("timeout")
  ) {
    return "We could not send the confirmation email yet. Your booking is saved — contact the spa with your booking number.";
  }
  return error.length > 160 ? `${error.slice(0, 157)}…` : error;
}

let fail = 0;
if (!publicBookingEmailError("SMTP auth failed")?.includes("booking is saved")) fail++;
if (publicBookingEmailError("Please call reception") === "Please call reception") {
  /* ok */
} else fail++;
if (fail) {
  console.error("booking-public-error-selftest: FAIL");
  process.exit(1);
}
console.log("booking-public-error-selftest: OK");
