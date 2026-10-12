import { readBookings } from "@/lib/booking-store";
import { readBookingSettings } from "@/lib/booking-settings";
import { isPastDate, listAvailableSlots, parseDateYmd, timeToMinutes } from "@/lib/booking-scheduler";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date")?.trim() ?? "";
  const duration = Number(url.searchParams.get("durationMinutes") || 60);
  const therapistSlug = url.searchParams.get("therapistSlug")?.trim() || undefined;

  if (!parseDateYmd(date)) {
    return NextResponse.json({ message: "Invalid date." }, { status: 400 });
  }
  if (!Number.isFinite(duration) || duration < 15 || duration > 240) {
    return NextResponse.json({ message: "Invalid duration." }, { status: 400 });
  }

  const settings = readBookingSettings();
  if (isPastDate(date, settings.timezone)) {
    return NextResponse.json({ data: { slots: [], labels: [] } });
  }

  const slots = listAvailableSlots(date, duration, settings, readBookings(), therapistSlug);
  const labels = slots.map((t) => {
    const m = timeToMinutes(t);
    const h24 = Math.floor(m / 60);
    const min = m % 60;
    const period = h24 >= 12 ? "PM" : "AM";
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return `${h12}:${min.toString().padStart(2, "0")} ${period}`;
  });

  return NextResponse.json({ data: { slots, labels } });
}
