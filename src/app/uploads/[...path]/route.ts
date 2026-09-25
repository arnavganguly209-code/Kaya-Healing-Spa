import { contentTypeForUpload, resolveUploadFile } from "@/lib/upload-path";
import { readFileSync } from "fs";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;
  const uploadPath = `/uploads/${segments.join("/")}`;
  const filePath = resolveUploadFile(uploadPath);
  if (!filePath) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  try {
    const data = readFileSync(filePath);
    if (data.length <= 0) {
      return NextResponse.json({ message: "Empty file" }, { status: 404 });
    }
    return new NextResponse(data, {
      headers: {
        "Content-Type": contentTypeForUpload(filePath),
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
}
