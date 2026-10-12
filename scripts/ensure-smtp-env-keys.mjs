/**
 * Appends missing non-secret SMTP/booking env keys to .env.local (never overwrites, never sets SMTP_PASSWORD).
 */
import { appendFileSync, existsSync, readFileSync } from "fs";
import path from "path";

const file = path.join(process.cwd(), ".env.local");
const defaults = {
  SMTP_HOST: "mail.globalorbitmail.cloud",
  SMTP_PORT: "587",
  SMTP_SECURE: "false",
  SMTP_USER: "booking@kayahealingspa.com.np",
  SMTP_FROM_EMAIL: "booking@kayahealingspa.com.np",
  SMTP_FROM_NAME: "Kaya Healing Spa",
  BOOKING_TEST_EMAIL: "booking@kayahealingspa.com.np",
  BOOKING_NOTIFICATION_EMAIL: "booking@kayahealingspa.com.np",
  SPA_PUBLIC_URL: "https://kayahealingspa.com.np",
};

let existing = "";
if (existsSync(file)) {
  existing = readFileSync(file, "utf8");
} else {
  appendFileSync(file, "# Local env — not committed\n", "utf8");
}

const lines = [];
for (const [key, value] of Object.entries(defaults)) {
  const re = new RegExp(`^${key}=`, "m");
  if (!re.test(existing)) {
    lines.push(`${key}=${value}`);
  }
}

if (lines.length) {
  appendFileSync(file, `${lines.join("\n")}\n`, "utf8");
  console.log("ensure-smtp-env-keys: appended", lines.map((l) => l.split("=")[0]).join(", "));
} else {
  console.log("ensure-smtp-env-keys: OK all non-secret keys present");
}
