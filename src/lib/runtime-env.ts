import { existsSync, readFileSync } from "fs";
import path from "path";

const RUNTIME_ENV_KEYS = [
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
] as const;

export type RuntimeEnvKey = (typeof RUNTIME_ENV_KEYS)[number];

/** Strip wrapping quotes without treating the value as a secret log. */
export function normalizeEnvValue(raw: string): string {
  let value = raw.replace(/^\uFEFF/, "").trim();
  if (
    (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
    (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
  ) {
    value = value.slice(1, -1);
  }
  return value.trim();
}

export function parseEnvFileContents(contents: string): Record<string, string> {
  const out: Record<string, string> = {};
  const text = contents.replace(/^\uFEFF/, "");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx < 1) continue;
    const key = trimmed.slice(0, idx).trim();
    if (!key) continue;
    out[key] = normalizeEnvValue(trimmed.slice(idx + 1));
  }
  return out;
}

/**
 * Dynamic lookup so Next.js cannot replace the value at build time.
 * Static `process.env.SMTP_PASSWORD` is inlined during `next build`; if the
 * secret was empty then, production would skip mail even when `.env` / PM2
 * later contain the password.
 */
export function runtimeEnv(name: string): string {
  const fromProcess = process.env[name];
  if (typeof fromProcess === "string") {
    const normalized = normalizeEnvValue(fromProcess);
    if (normalized) return normalized;
  }
  return "";
}

function readEnvFile(relativeName: string): Record<string, string> {
  const file = path.join(/* turbopackIgnore: true */ process.cwd(), relativeName);
  try {
    if (!existsSync(/* turbopackIgnore: true */ file)) return {};
    return parseEnvFileContents(readFileSync(/* turbopackIgnore: true */ file, "utf8"));
  } catch {
    return {};
  }
}

/**
 * Fill missing process.env keys from `.env` then `.env.local`.
 * Never overwrites an already-set variable. Never logs values.
 */
export function loadRuntimeEnvFiles(): void {
  if (process.env.KAYA_SKIP_ENV_FILE_LOAD === "1") return;
  const fromDotEnv = readEnvFile(".env");
  const fromLocal = readEnvFile(".env.local");
  const merged = { ...fromDotEnv, ...fromLocal };
  for (const key of RUNTIME_ENV_KEYS) {
    if (runtimeEnv(key)) continue;
    const fileValue = merged[key];
    if (fileValue) process.env[key] = fileValue;
  }
}

export function smtpEnvPresent(): {
  host: boolean;
  user: boolean;
  password: boolean;
  from: boolean;
  pdfSecret: boolean;
} {
  return {
    host: Boolean(runtimeEnv("SMTP_HOST")),
    user: Boolean(runtimeEnv("SMTP_USER")),
    password: Boolean(runtimeEnv("SMTP_PASSWORD")),
    from: Boolean(runtimeEnv("SMTP_FROM_EMAIL") || runtimeEnv("SMTP_USER")),
    pdfSecret: Boolean(runtimeEnv("BOOKING_PDF_SECRET")),
  };
}

export const RUNTIME_ENV_KEY_LIST = RUNTIME_ENV_KEYS;
