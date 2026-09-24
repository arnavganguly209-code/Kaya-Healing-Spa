import { createHmac, timingSafeEqual } from "crypto";
import { existsSync, readFileSync } from "fs";
import { cookies } from "next/headers";
import path from "path";

const COOKIE = "orbit_session";

function readPasskeyFromFile(filePath: string) {
  if (!existsSync(filePath)) return "";
  try {
    const match = readFileSync(filePath, "utf8").match(/^\s*ORBIT_PASSKEY\s*=\s*(.*)\s*$/m);
    return (match?.[1] ?? "").trim().replace(/^["']|["']$/g, "");
  } catch {
    return "";
  }
}

function passkey() {
  const fromEnv = (process.env.ORBIT_PASSKEY ?? "").trim();
  if (fromEnv.length >= 6) return fromEnv;
  const root = process.cwd();
  return (
    readPasskeyFromFile(path.join(root, ".env.local")) ||
    readPasskeyFromFile(path.join(root, ".env")) ||
    readPasskeyFromFile(path.join(root, ".env.production"))
  );
}

export function passkeyConfigured() {
  return passkey().length >= 6;
}

export function passkeyMatches(input: string) {
  const expected = passkey();
  const received = input.trim();
  if (!expected || !received) return false;
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function createSessionToken() {
  const exp = Date.now() + 1000 * 60 * 60 * 12;
  const payload = String(exp);
  const mac = createHmac("sha256", passkey()).update(payload).digest("hex");
  return `${payload}.${mac}`;
}

export function sessionTokenValid(token: string | undefined) {
  if (!token || !passkeyConfigured()) return false;
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return false;
  const exp = Number(payload);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = createHmac("sha256", passkey()).update(payload).digest("hex");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isOrbitAuthed() {
  const jar = await cookies();
  return sessionTokenValid(jar.get(COOKIE)?.value);
}

export function orbitCookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: 60 * 60 * 12,
  };
}

export const orbitCookie = {
  name: COOKIE,
};
