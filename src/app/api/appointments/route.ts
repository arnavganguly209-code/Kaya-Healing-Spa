import { NextResponse } from "next/server";

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  preferredDate?: string;
  preferredTime?: string;
  serviceSlug?: string;
  packageSlug?: string;
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
  if (!body.serviceSlug && !body.packageSlug) return NextResponse.json({ message: "Choose a treatment or a package." }, { status: 400 });
  if (!Number.isInteger(guests) || guests < 1 || guests > 8) return NextResponse.json({ message: "Guests must be between 1 and 8." }, { status: 400 });

  return NextResponse.json({ success: true, message: "Appointment request received", data: { received: true } });
}
