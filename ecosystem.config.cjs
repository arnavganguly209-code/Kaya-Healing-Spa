const fs = require("fs");
const path = require("path");

const ENV_KEYS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "SMTP_FROM_EMAIL",
  "SMTP_FROM_NAME",
  "BOOKING_NOTIFICATION_EMAIL",
  "BOOKING_TEST_EMAIL",
  "BOOKING_PDF_SECRET",
  "ORBIT_PASSKEY",
  "SPA_PUBLIC_URL",
  "NEXT_PUBLIC_SITE_URL",
];

function parseEnvFile(filePath) {
  const out = {};
  if (!fs.existsSync(filePath)) return out;
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx < 1) continue;
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
      (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
    ) {
      value = value.slice(1, -1);
    }
    out[trimmed.slice(0, idx).trim()] = value.trim();
  }
  return out;
}

function loadAppEnv() {
  const cwd = process.cwd();
  const fromDotEnv = parseEnvFile(path.join(cwd, ".env"));
  const fromLocal = parseEnvFile(path.join(cwd, ".env.local"));
  const fromFiles = { ...fromDotEnv, ...fromLocal };
  const env = {
    NODE_ENV: "production",
    PORT: process.env.PORT || "3005",
    HOSTNAME: process.env.HOSTNAME || "0.0.0.0",
  };
  for (const key of ENV_KEYS) {
    if (process.env[key]) env[key] = process.env[key];
    else if (fromFiles[key]) env[key] = fromFiles[key];
  }
  return env;
}

module.exports = {
  apps: [
    {
      name: "kaya-healing-spa",
      cwd: "/var/www/kaya-healing-spa",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 0.0.0.0 -p " + (process.env.PORT || "3005"),
      interpreter: "node",
      env: loadAppEnv(),
    },
  ],
};
