import { isOrbitAuthed } from "@/lib/orbit-auth";
import { contentTypeForUpload, resolveUploadFile } from "@/lib/upload-path";
import { readFileSync } from "fs";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Orbit preview + fallback when nginx/static miss an upload. */
export async function GET(request: Request) {
  if (!(await isOrbitAuthed())) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }
  const url = new URL(request.url);
  const raw = url.searchParams.get("path") || "";
  const filePath = resolveUploadFile(raw);
  if (!filePath) {
    return NextResponse.json({ message: "Invalid path." }, { status: 400 });
  }
  try {
    const data = readFileSync(filePath);
    if (data.length <= 0) {
      return NextResponse.json({ message: "File is empty." }, { status: 404 });
    }
    return new NextResponse(data, {
      headers: {
        "Content-Type": contentTypeForUpload(filePath),
        "Cache-Control": "private, no-cache",
      },
    });
  } catch {
    return NextResponse.json({ message: "File not found on server." }, { status: 404 });
  }
}
