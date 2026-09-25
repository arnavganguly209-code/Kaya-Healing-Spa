import { appendInquiry } from "@/lib/admin-store";
import { readOrbitContent } from "@/lib/orbit-store";
import { NextResponse } from "next/server";

type Body = {
  bookingType?: string;
  name?: string;
  email?: string;
  phone?: string;
  preferredDate?: string;
  preferredTime?: string;
  serviceSlug?: string;
  packageSlug?: string;
  therapistSlug?: string;
  guests?: number;
  notes?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Body | null;
  if (!body) return NextResponse.json({ message: "Invalid request." }, { status: 400 });

  const emailOk = typeof body.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email);
  const guests = Number(body.guests);
  if (!body.name || body.name.trim().length < 2) return NextResponse.json({ message: "Enter your name." }, { status: 400 });
  if (!emailOk) return NextResponse.json({ message: "Enter a valid email." }, { status: 400 });
  if (!body.phone || body.phone.trim().length < 6) return NextResponse.json({ message: "Enter a phone number." }, { status: 400 });
  if (!body.preferredDate || !body.preferredTime) return NextResponse.json({ message: "Choose a date and time." }, { status: 400 });
  const bookingType = body.bookingType || "service";
  if (bookingType === "package" && !body.packageSlug) {
    return NextResponse.json({ message: "Choose a package." }, { status: 400 });
  }
  if (bookingType === "service" && !body.serviceSlug) {
    return NextResponse.json({ message: "Choose a treatment." }, { status: 400 });
  }
  if (bookingType === "therapist") {
    if (!body.therapistSlug) {
      return NextResponse.json({ message: "Choose a therapist." }, { status: 400 });
    }
    if (!body.serviceSlug && !body.packageSlug) {
      return NextResponse.json({ message: "Choose a treatment or package for this booking." }, { status: 400 });
    }
  }
  if (bookingType !== "therapist" && !body.serviceSlug && !body.packageSlug) {
    return NextResponse.json({ message: "Choose a treatment or a package." }, { status: 400 });
  }
  if (!Number.isInteger(guests) || guests < 1 || guests > 8) return NextResponse.json({ message: "Guests must be between 1 and 8." }, { status: 400 });

  const orbit = readOrbitContent();
  const serviceName = body.serviceSlug ? orbit.services.find((s) => s.slug === body.serviceSlug)?.name : "";
  const packageName = body.packageSlug ? orbit.packages.find((p) => p.slug === body.packageSlug)?.name : "";

  appendInquiry({
    type: "booking",
    name: body.name.trim(),
    email: body.email!.trim(),
    phone: body.phone.trim(),
    summary: `${bookingType} · ${serviceName || packageName || body.serviceSlug || body.packageSlug || "General"}`,
    payload: { ...body, guests },
  });

  return NextResponse.json({ success: true, message: "Appointment request received", data: { received: true } });
}
