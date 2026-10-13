import { isOrbitAuthed } from "@/lib/orbit-auth";
import { deleteBooking, readBookings } from "@/lib/booking-store";
import { NextResponse } from "next/server";

export async function GET() {
  if (!(await isOrbitAuthed())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ data: readBookings() });
}

export async function DELETE(request: Request) {
  if (!(await isOrbitAuthed())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { id?: string } | null;
  if (!body?.id) return NextResponse.json({ message: "Booking id is required." }, { status: 400 });
  const removed = deleteBooking(body.id);
  if (!removed) return NextResponse.json({ message: "Booking not found." }, { status: 404 });
  return NextResponse.json({ success: true, data: { id: body.id } });
}
