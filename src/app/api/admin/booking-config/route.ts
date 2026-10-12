import { isAdminAuthed } from "@/lib/admin-auth";
import { assessBookingConfig } from "@/lib/booking-config";
import { NextResponse } from "next/server";

export async function GET() {
  if (!(await isAdminAuthed())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const issues = assessBookingConfig();
  return NextResponse.json({
    data: {
      ok: issues.every((i) => i.severity !== "error"),
      issues,
    },
  });
}
