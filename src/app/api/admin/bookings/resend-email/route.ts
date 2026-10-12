import { isAdminAuthed } from "@/lib/admin-auth";
import { deliverBookingConfirmation } from "@/lib/booking-confirm";
import { findBookingById } from "@/lib/booking-store";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!(await isAdminAuthed())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { id?: string } | null;
  const id = body?.id?.trim();
  if (!id) return NextResponse.json({ message: "Missing booking id." }, { status: 400 });

  const booking = findBookingById(id);
  if (!booking) return NextResponse.json({ message: "Booking not found." }, { status: 404 });

  const delivery = await deliverBookingConfirmation(booking, { forceResend: true });
  return NextResponse.json({
    data: {
      emailSent: delivery.emailSent,
      emailSkipped: delivery.emailSkipped,
      emailError: delivery.emailError,
      providerMessageId: delivery.providerMessageId,
    },
  });
}
