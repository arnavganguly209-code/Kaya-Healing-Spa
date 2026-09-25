import {
  adminCookie,
  adminCookieOptions,
  adminCredentialsMatch,
  createAdminSessionToken,
} from "@/lib/admin-auth";
import { NextResponse } from "next/server";

function cookieOptions(request: Request) {
  const proto = request.headers.get("x-forwarded-proto") || new URL(request.url).protocol.replace(":", "");
  return adminCookieOptions(proto === "https");
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { username?: string; password?: string } | null;
  const username = body?.username?.trim() ?? "";
  const password = body?.password ?? "";
  if (!adminCredentialsMatch(username, password)) {
    return NextResponse.json({ message: "User ID or password is not correct." }, { status: 401 });
  }
  const response = NextResponse.json({ success: true });
  response.cookies.set(adminCookie.name, createAdminSessionToken(username), cookieOptions(request));
  return response;
}

export async function DELETE(request: Request) {
  const response = NextResponse.json({ success: true });
  response.cookies.set(adminCookie.name, "", { ...cookieOptions(request), maxAge: 0 });
  return response;
}
