/**
 * Safe live SMTP send test (no booking data, no customer inboxes).
 *
 * Configure in .env.local (never commit):
 *   BOOKING_TEST_EMAIL=<authorized test inbox>
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD, SMTP_FROM_EMAIL
 *
 * Run: node scripts/test-booking-email.mjs
 * Or:  npm run verify:test-email  (if defined)
 *
 * PASS means the SMTP server accepted the message — not confirmed inbox delivery.
 */
import { loadEnvLocal } from "./load-env-local.mjs";
import nodemailer from "nodemailer";

loadEnvLocal();

const to = process.env.BOOKING_TEST_EMAIL?.trim();
const host = process.env.SMTP_HOST?.trim() || "mail.globalorbitmail.cloud";
const port = Number(process.env.SMTP_PORT || 587);
const secureExplicit = process.env.SMTP_SECURE?.trim().toLowerCase();
const secure = secureExplicit === "true" || (secureExplicit !== "false" && port === 465);
const user = process.env.SMTP_USER?.trim();
const pass = process.env.SMTP_PASSWORD?.trim();
const from = process.env.SMTP_FROM_EMAIL?.trim() || user;

if (!to) {
  console.error("test-booking-email: FAIL set BOOKING_TEST_EMAIL in .env.local to an authorized test inbox");
  console.error("test-booking-email: This script does not send to customers or write bookings.");
  process.exit(1);
}
if (!user || !pass || !from) {
  console.error("test-booking-email: FAIL SMTP_USER, SMTP_PASSWORD, and SMTP_FROM_EMAIL required");
  process.exit(1);
}

const transport = nodemailer.createTransport({
  host,
  port,
  secure,
  requireTLS: !secure && port === 587,
  auth: { user, pass },
  tls: { minVersion: "TLSv1.2", rejectUnauthorized: true },
  connectionTimeout: 20_000,
  greetingTimeout: 15_000,
});

try {
  const info = await transport.sendMail({
    from: `${process.env.SMTP_FROM_NAME || "Kaya Healing Spa"} <${from}>`,
    to,
    subject: "Kaya SMTP test (no customer data)",
    text: "SMTP configuration test from Kaya Healing Spa tooling. No booking or customer data included.",
  });
  const accepted = Boolean(info.messageId || info.response);
  console.log(
    "test-booking-email: PASS SMTP server accepted message",
    secure ? "implicit-TLS" : "STARTTLS",
    accepted ? "(message id present)" : "(no message id)",
  );
  console.log("test-booking-email: Inbox delivery was NOT verified — check the test inbox manually.");
} catch (e) {
  console.error("test-booking-email: FAIL", e instanceof Error ? e.message : "unknown");
  process.exit(1);
}
