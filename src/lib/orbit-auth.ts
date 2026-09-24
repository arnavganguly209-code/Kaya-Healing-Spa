import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "orbit_session";

function passkey() {
  return process.env.ORBIT_PASSKEY ?? "";
}

export function passkeyConfigured() {
  return passkey().length >= 6;
}

export function passkeyMatches(input: string) {
  const expected = passkey();
  if (!expected || !input) return false;
  const a = Buffer.from(input);
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

export const orbitCookie = {
  name: COOKIE,
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  },
};
