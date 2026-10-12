import { appendInquiry } from "@/lib/admin-store";
import { createBooking, readBookings } from "@/lib/booking-store";
import { readBookingSettings } from "@/lib/booking-settings";
import { isPastDate, listAvailableSlots, parseDateYmd, timeToMinutes } from "@/lib/booking-scheduler";
import { parseServiceDurationOptions } from "@/lib/service-pricing";
import { readOrbitContent } from "@/lib/orbit-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = {
  bookingType?: string;
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  preferredDate?: string;
  preferredTime?: string;
  durationMinutes?: number;
  priceNpr?: number | null;
  serviceSlug?: string;
  packageSlug?: string;
  therapistSlug?: string;
  guests?: number;
  notes?: string;
  privacyAccepted?: boolean;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as Body | null;
    if (!body) return NextResponse.json({ message: "Invalid request." }, { status: 400 });

    if (!body.privacyAccepted) {
      return NextResponse.json({ message: "Please accept the privacy policy and booking terms." }, { status: 400 });
    }

    const emailOk = typeof body.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email);
    if (!body.name || body.name.trim().length < 2) return NextResponse.json({ message: "Enter your name." }, { status: 400 });
    if (!emailOk) return NextResponse.json({ message: "Enter a valid email." }, { status: 400 });
    if (!body.phone || body.phone.trim().length < 6) return NextResponse.json({ message: "Enter a phone number." }, { status: 400 });
    if (!body.country?.trim()) return NextResponse.json({ message: "Select your country." }, { status: 400 });
    if (!body.preferredDate || !body.preferredTime) return NextResponse.json({ message: "Choose a date and time." }, { status: 400 });
    if (!parseDateYmd(body.preferredDate)) return NextResponse.json({ message: "Invalid date." }, { status: 400 });

    const settings = readBookingSettings();
    if (isPastDate(body.preferredDate, settings.timezone)) {
      return NextResponse.json({ message: "Choose a future date." }, { status: 400 });
    }

    const durationMinutes = Number(body.durationMinutes) || settings.defaultDurationMinutes;
    const startMin = timeToMinutes(body.preferredTime);
    if (startMin < 0) return NextResponse.json({ message: "Invalid time." }, { status: 400 });

    const bookingType = body.bookingType || "service";
    const orbit = readOrbitContent();
    const service = body.serviceSlug ? orbit.services.find((s) => s.slug === body.serviceSlug) : undefined;
    const packageItem = body.packageSlug ? orbit.packages.find((p) => p.slug === body.packageSlug) : undefined;

    if (bookingType === "service" && !service) {
      return NextResponse.json({ message: "Choose a valid treatment." }, { status: 400 });
    }
    if (bookingType === "package" && !packageItem) {
      return NextResponse.json({ message: "Choose a valid package." }, { status: 400 });
    }

    let serverPrice: number | null = null;
    if (service) {
      const tier = parseServiceDurationOptions(service).find((o) => o.minutes === durationMinutes);
      serverPrice = tier?.priceNpr ?? (service.priceFromNpr > 0 ? service.priceFromNpr : null);
    } else if (packageItem && packageItem.priceNpr > 0) {
      serverPrice = packageItem.priceNpr;
    }

    const existing = readBookings();
    const slots = listAvailableSlots(body.preferredDate, durationMinutes, settings, existing, body.therapistSlug || undefined);
    if (!slots.includes(body.preferredTime)) {
      return NextResponse.json({ message: "That time is no longer available. Please choose another slot." }, { status: 409 });
    }

    const therapist = body.therapistSlug ? orbit.therapists.find((t) => t.slug === body.therapistSlug) : undefined;

    const booking = createBooking({
      status: "pending",
      name: body.name.trim(),
      email: body.email!.trim(),
      phone: body.phone.trim(),
      country: body.country.trim(),
      whatsapp: body.phone.trim(),
      serviceSlug: service?.slug,
      serviceName: service?.name,
      packageSlug: packageItem?.slug,
      packageName: packageItem?.name,
      therapistSlug: therapist?.slug,
      therapistName: therapist?.name,
      durationMinutes,
      priceNpr: serverPrice,
      priceConfirmed: serverPrice != null && serverPrice > 0,
      appointmentDate: body.preferredDate,
      appointmentTime: body.preferredTime,
      notes: body.notes?.trim(),
      privacyAccepted: true,
    });

    appendInquiry({
      type: "booking",
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      summary: `${booking.reference} · ${booking.serviceName || booking.packageName || "Booking"}`,
      payload: { ...body, reference: booking.reference, bookingId: booking.id },
    });

    return NextResponse.json({
      success: true,
      message: "Appointment request received",
      data: { reference: booking.reference, bookingId: booking.id },
    });
  } catch (error) {
    console.error("appointments POST failed", error);
    return NextResponse.json({ message: "Server busy — please try again in a moment." }, { status: 503 });
  }
}
