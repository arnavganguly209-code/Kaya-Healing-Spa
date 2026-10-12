import type { SpaBooking } from "@/lib/booking-types";

const SEQUENTIAL_RE = /^KAYA(\d{5})$/;

export function parseSequentialBookingNumber(value: string | undefined): number | null {
  if (!value) return null;
  const m = value.trim().match(SEQUENTIAL_RE);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

export function formatSequentialBookingNumber(sequence: number): string {
  return `KAYA${String(sequence).padStart(5, "0")}`;
}

export function displayBookingNumber(booking: SpaBooking): string {
  return booking.bookingNumber || booking.reference;
}

export function maxSequentialFromBookings(bookings: SpaBooking[], floor = 2000): number {
  let max = floor;
  for (const b of bookings) {
    const n = parseSequentialBookingNumber(b.bookingNumber) ?? parseSequentialBookingNumber(b.reference);
    if (n != null && n > max) max = n;
  }
  return max;
}
