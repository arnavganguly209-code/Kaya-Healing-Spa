/**
 * Verifies SMTP STARTTLS + AUTH using .env.local (no secrets printed).
 */
import nodemailer from "nodemailer";
import { loadEnvLocal } from "./load-env-local.mjs";

loadEnvLocal();

const host = process.env.SMTP_HOST?.trim();
const port = Number(process.env.SMTP_PORT || 587);
const user = process.env.SMTP_USER?.trim();
const pass = process.env.SMTP_PASSWORD?.trim();

if (!host || !user || !pass) {
  console.error("smtp-verify: FAIL missing SMTP_HOST, SMTP_USER, or SMTP_PASSWORD");
  process.exit(1);
}

const transport = nodemailer.createTransport({
  host,
  port,
  secure: false,
  requireTLS: true,
  auth: { user, pass },
  tls: { minVersion: "TLSv1.2" },
});

try {
  await transport.verify();
  console.log("smtp-verify: PASS STARTTLS auth OK", host, port, user);
} catch (e) {
  console.error("smtp-verify: FAIL", e instanceof Error ? e.message : "unknown");
  process.exit(1);
}
