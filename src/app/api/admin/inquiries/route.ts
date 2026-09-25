import { isAdminAuthed } from "@/lib/admin-auth";
import { readInquiries, updateInquiries } from "@/lib/admin-store";
import { NextResponse } from "next/server";

export async function GET() {
  if (!(await isAdminAuthed())) return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  return NextResponse.json({ data: readInquiries() });
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthed())) return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { id?: string; read?: boolean; markAllRead?: boolean } | null;
  const list = readInquiries();
  if (body?.markAllRead) {
    updateInquiries(list.map((i) => ({ ...i, read: true })));
    return NextResponse.json({ success: true });
  }
  if (!body?.id) return NextResponse.json({ message: "Missing inquiry id." }, { status: 400 });
  updateInquiries(list.map((i) => (i.id === body.id ? { ...i, read: body.read !== false } : i)));
  return NextResponse.json({ success: true });
}
