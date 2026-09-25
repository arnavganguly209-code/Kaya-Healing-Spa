import { readAdminCredentials } from "@/lib/admin-store";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "admin_session";

function sessionSecret() {
  const { username, password } = readAdminCredentials();
  return createHmac("sha256", "kaya-admin").update(`${username}:${password}`).digest("hex");
}

export function adminCredentialsMatch(username: string, password: string) {
  const cred = readAdminCredentials();
  const u = username.trim();
  const p = password;
  if (!u || !p) return false;
  const ua = Buffer.from(u);
  const ub = Buffer.from(cred.username);
  const pa = Buffer.from(p);
  const pb = Buffer.from(cred.password);
  if (ua.length !== ub.length || pa.length !== pb.length) return false;
  return timingSafeEqual(ua, ub) && timingSafeEqual(pa, pb);
}

export function createAdminSessionToken(username: string) {
  const exp = Date.now() + 1000 * 60 * 60 * 12;
  const payload = `${username.trim()}|${exp}`;
  const mac = createHmac("sha256", sessionSecret()).update(payload).digest("hex");
  return `${payload}|${mac}`;
}

export function adminSessionTokenValid(token: string | undefined) {
  if (!token) return false;
  const parts = token.split("|");
  if (parts.length !== 3) return false;
  const [userPart, expPart, mac] = parts;
  const exp = Number(expPart);
  if (!userPart || !Number.isFinite(exp) || exp < Date.now()) return false;
  const cred = readAdminCredentials();
  if (userPart !== cred.username) return false;
  const payload = `${userPart}|${expPart}`;
  const expected = createHmac("sha256", sessionSecret()).update(payload).digest("hex");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isAdminAuthed() {
  const jar = await cookies();
  return adminSessionTokenValid(jar.get(COOKIE)?.value);
}

export async function isOrbitOrAdminAuthed() {
  const { isOrbitAuthed } = await import("@/lib/orbit-auth");
  return (await isOrbitAuthed()) || (await isAdminAuthed());
}

export function adminCookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: 60 * 60 * 12,
  };
}

export const adminCookie = { name: COOKIE };
