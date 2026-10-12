/**
 * Safe SMTP probe — set BOOKING_TEST_EMAIL and SMTP_* in .env.local. Does not use Resend.
 */
import { loadEnvLocal } from "./load-env-local.mjs";
import nodemailer from "nodemailer";

loadEnvLocal();

const to = process.env.BOOKING_TEST_EMAIL?.trim();
const host = process.env.SMTP_HOST?.trim();
const user = process.env.SMTP_USER?.trim();
const pass = process.env.SMTP_PASSWORD?.trim();
const from = process.env.SMTP_FROM_EMAIL?.trim() || user;

if (!to) {
  console.error("test-booking-email: FAIL set BOOKING_TEST_EMAIL to a test inbox");
  process.exit(1);
}
if (!host || !user || !pass || !from) {
  console.error("test-booking-email: FAIL SMTP_HOST, SMTP_USER, SMTP_PASSWORD, SMTP_FROM_EMAIL required");
  process.exit(1);
}

const transport = nodemailer.createTransport({
  host,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  requireTLS: process.env.SMTP_SECURE !== "true",
  auth: { user, pass },
  tls: { minVersion: "TLSv1.2", rejectUnauthorized: true },
});

const info = await transport.sendMail({
  from: `${process.env.SMTP_FROM_NAME || "Kaya Healing Spa"} <${from}>`,
  to,
  subject: "Kaya SMTP test (no customer data)",
  text: "SMTP configuration test from Kaya Healing Spa tooling.",
});

console.log("test-booking-email: PASS message accepted", info.messageId ? "(id present)" : "");
process.exit(0);
