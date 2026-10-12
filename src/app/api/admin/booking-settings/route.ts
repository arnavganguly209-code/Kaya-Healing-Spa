import { isAdminAuthed } from "@/lib/admin-auth";
import { readBookingSettings, writeBookingSettings } from "@/lib/booking-settings";
import type { BookingSettings } from "@/lib/booking-types";
import { NextResponse } from "next/server";

export async function GET() {
  if (!(await isAdminAuthed())) return NextResponse.json({ message: "Sign in at /admin/login." }, { status: 401 });
  return NextResponse.json({ data: readBookingSettings() });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthed())) return NextResponse.json({ message: "Sign in at /admin/login." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as Partial<BookingSettings> | null;
  if (!body) return NextResponse.json({ message: "Invalid body." }, { status: 400 });
  const current = readBookingSettings();
  const next: BookingSettings = {
    ...current,
    ...body,
    blocks: Array.isArray(body.blocks) ? body.blocks : current.blocks,
  };
  writeBookingSettings(next);
  return NextResponse.json({ data: next });
}
