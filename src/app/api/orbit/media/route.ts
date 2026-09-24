import { isOrbitAuthed } from "@/lib/orbit-auth";
import { listUploads, saveUpload } from "@/lib/orbit-media";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET() {
  if (!(await isOrbitAuthed())) return NextResponse.json({ message: "Sign in required. Open /orbit/login first." }, { status: 401 });
  return NextResponse.json({ data: listUploads() });
}

export async function POST(request: Request) {
  if (!(await isOrbitAuthed())) return NextResponse.json({ message: "Sign in required. Open /orbit/login first." }, { status: 401 });
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ message: "Choose an image or video to upload." }, { status: 400 });
    }
    const saved = await saveUpload(file);
    return NextResponse.json({ success: true, ...saved });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The file could not be saved.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
