import { isAdminAuthed } from "@/lib/admin-auth";
import { readBookings, updateBookingStatus } from "@/lib/booking-store";
import type { BookingStatus } from "@/lib/booking-types";
import { NextResponse } from "next/server";

export async function GET() {
  if (!(await isAdminAuthed())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ data: readBookings() });
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthed())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { id?: string; status?: BookingStatus; note?: string } | null;
  if (!body?.id || !body.status) return NextResponse.json({ message: "Invalid body." }, { status: 400 });
  const updated = updateBookingStatus(body.id, body.status, body.note);
  if (!updated) return NextResponse.json({ message: "Booking not found." }, { status: 404 });
  return NextResponse.json({ data: updated });
}
