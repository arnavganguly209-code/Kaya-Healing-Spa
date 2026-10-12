import { isAdminAuthed } from "@/lib/admin-auth";
import { bookingPdfFilename, generateBookingPdf } from "@/lib/booking-pdf";
import { findBookingById, findBookingByReference } from "@/lib/booking-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAdminAuthed())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim();
  const ref = searchParams.get("ref")?.trim();
  const booking = (id && findBookingById(id)) || (ref && findBookingByReference(ref));
  if (!booking) return NextResponse.json({ message: "Booking not found." }, { status: 404 });

  try {
    const pdf = await generateBookingPdf(booking);
    const variant = searchParams.get("variant") === "invoice" ? "Invoice" : "Booking-Confirmation";
    const filename = bookingPdfFilename(booking).replace("Booking-Confirmation", variant);
    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (e) {
    console.error("admin booking pdf failed", e);
    return NextResponse.json({ message: "Could not generate PDF." }, { status: 500 });
  }
}
