import { isOrbitOrAdminAuthed } from "@/lib/admin-auth";
import { listUploads, saveUpload } from "@/lib/orbit-media";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET() {
  if (!(await isOrbitOrAdminAuthed())) return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  return NextResponse.json({ data: listUploads() });
}

export async function POST(request: Request) {
  if (!(await isOrbitOrAdminAuthed())) return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ message: "Choose a file to upload." }, { status: 400 });
    }
    const saved = await saveUpload(file);
    return NextResponse.json({ success: true, ...saved });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
