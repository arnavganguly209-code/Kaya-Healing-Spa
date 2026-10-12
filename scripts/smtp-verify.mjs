/**
 * Verifies SMTP connection + AUTH using .env.local (no secrets printed).
 */
import nodemailer from "nodemailer";
import { loadEnvLocal } from "./load-env-local.mjs";

loadEnvLocal();

const host = process.env.SMTP_HOST?.trim() || "mail.globalorbitmail.cloud";
const port = Number(process.env.SMTP_PORT || 587);
const secureExplicit = process.env.SMTP_SECURE?.trim().toLowerCase();
const secure = secureExplicit === "true" || (secureExplicit !== "false" && port === 465);
const user = process.env.SMTP_USER?.trim();
const pass = process.env.SMTP_PASSWORD?.trim();

if (!user || !pass) {
  console.error("smtp-verify: FAIL missing SMTP_USER or SMTP_PASSWORD");
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
  await transport.verify();
  console.log("smtp-verify: PASS auth OK", host, port, secure ? "implicit-TLS" : "STARTTLS", user);
} catch (e) {
  console.error("smtp-verify: FAIL", e instanceof Error ? e.message : "unknown");
  process.exit(1);
}
