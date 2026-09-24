import { createSessionToken, isOrbitAuthed, orbitCookie, orbitCookieOptions, passkeyConfigured, passkeyMatches } from "@/lib/orbit-auth";
import { readOrbitContent, writeOrbitContent, type OrbitContent } from "@/lib/orbit-store";
import { mkdirSync, writeFileSync } from "fs";
import { NextResponse } from "next/server";
import path from "path";

function cookieOptions(request: Request) {
  const proto = request.headers.get("x-forwarded-proto") || new URL(request.url).protocol.replace(":", "");
  return orbitCookieOptions(proto === "https");
}

export async function POST(request: Request) {
  if (!passkeyConfigured()) {
    return NextResponse.json({ message: "Orbit passkey is not configured." }, { status: 503 });
  }
  const body = (await request.json().catch(() => null)) as { passkey?: string } | null;
  const passkey = typeof body?.passkey === "string" ? body.passkey.trim() : "";
  if (!passkey || !passkeyMatches(passkey)) {
    return NextResponse.json({ message: "That passkey is not correct." }, { status: 401 });
  }
  const response = NextResponse.json({ success: true });
  response.cookies.set(orbitCookie.name, createSessionToken(), cookieOptions(request));
  return response;
}

export async function DELETE(request: Request) {
  const response = NextResponse.json({ success: true });
  response.cookies.set(orbitCookie.name, "", { ...cookieOptions(request), maxAge: 0 });
  return response;
}

export async function GET() {
  if (!(await isOrbitAuthed())) return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  return NextResponse.json({ data: readOrbitContent() });
}

export async function PUT(request: Request) {
  if (!(await isOrbitAuthed())) return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as OrbitContent | null;
  if (!body?.hero || !body.therapies || !Array.isArray(body.services)) {
    return NextResponse.json({ message: "Content is incomplete." }, { status: 400 });
  }
  writeOrbitContent(body);
  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  if (!(await isOrbitAuthed())) return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ message: "Choose an image." }, { status: 400 });
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) return NextResponse.json({ message: "Use a JPG, PNG, or WebP image." }, { status: 400 });
  if (file.size > 8_000_000) return NextResponse.json({ message: "Image must be under 8 MB." }, { status: 400 });
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ success: true, path: `/uploads/${name}` });
}
