import { isAdminAuthed } from "@/lib/admin-auth";
import { deliverBookingConfirmation } from "@/lib/booking-confirm";
import { findBookingById } from "@/lib/booking-store";
import { NextResponse } from "next/server";

type Body = {
  id?: string;
  /** customer | admin | both (default both) */
  target?: string;
};

export async function POST(request: Request) {
  if (!(await isAdminAuthed())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as Body | null;
  const id = body?.id?.trim();
  if (!id) return NextResponse.json({ message: "Missing booking id." }, { status: 400 });

  const booking = findBookingById(id);
  if (!booking) return NextResponse.json({ message: "Booking not found." }, { status: 404 });

  const target = (body?.target || "both").toLowerCase();
  const sendCustomer = target === "customer" || target === "both";
  const sendAdmin = target === "admin" || target === "both";

  const delivery = await deliverBookingConfirmation(booking, {
    sendCustomer,
    sendAdmin,
    forceCustomer: sendCustomer,
    forceAdmin: sendAdmin,
  });

  return NextResponse.json({
    data: {
      target,
      emailSent: delivery.emailSent,
      emailSkipped: delivery.emailSkipped,
      emailError: delivery.emailError,
      providerMessageId: delivery.providerMessageId,
      adminEmailSent: delivery.adminEmailSent,
      adminEmailSkipped: delivery.adminEmailSkipped,
      adminEmailError: delivery.adminEmailError,
      adminProviderMessageId: delivery.adminProviderMessageId,
    },
  });
}
