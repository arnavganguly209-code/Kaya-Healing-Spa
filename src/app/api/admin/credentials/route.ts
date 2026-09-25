import { isAdminAuthed } from "@/lib/admin-auth";
import { readAdminCredentials, writeAdminCredentials } from "@/lib/admin-store";
import { isOrbitAuthed } from "@/lib/orbit-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const orbit = await isOrbitAuthed();
  const admin = await isAdminAuthed();
  if (!orbit && !admin) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }
  const cred = readAdminCredentials();
  return NextResponse.json({ data: { username: cred.username } });
}

export async function PUT(request: Request) {
  const orbit = await isOrbitAuthed();
  const admin = await isAdminAuthed();
  if (!orbit && !admin) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as {
    username?: string;
    password?: string;
    currentPassword?: string;
  } | null;
  const current = readAdminCredentials();
  if (admin && !orbit) {
    if (body?.currentPassword !== current.password) {
      return NextResponse.json({ message: "Current password is incorrect." }, { status: 400 });
    }
  }
  const username = body?.username?.trim() || current.username;
  const password = body?.password?.trim() || current.password;
  if (username.length < 2) return NextResponse.json({ message: "User ID is too short." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ message: "Password must be at least 8 characters." }, { status: 400 });
  writeAdminCredentials({ username, password });
  return NextResponse.json({ success: true, data: { username } });
}
