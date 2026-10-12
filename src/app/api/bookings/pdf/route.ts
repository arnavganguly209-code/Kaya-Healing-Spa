import { bookingPdfFilename, generateBookingPdf } from "@/lib/booking-pdf";
import { findBookingByReference, verifyPdfAccess } from "@/lib/booking-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get("ref")?.trim();
  const token = searchParams.get("token")?.trim();
  if (!ref || !token) {
    return NextResponse.json({ message: "Missing booking reference or access token." }, { status: 400 });
  }

  const booking = findBookingByReference(ref);
  if (!booking || !verifyPdfAccess(booking, token)) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  try {
    const pdf = await generateBookingPdf(booking);
    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${bookingPdfFilename(booking)}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (e) {
    console.error("booking pdf GET failed", e);
    return NextResponse.json({ message: "Could not generate PDF." }, { status: 500 });
  }
}
