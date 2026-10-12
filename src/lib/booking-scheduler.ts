import type { BookingSettings, SpaBooking } from "@/lib/booking-types";

/** Parse "HH:mm" (24h) to minutes from midnight */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map((x) => Number(x));
  if (!Number.isFinite(h) || !Number.isFinite(m)) return -1;
  return h * 60 + m;
}

export function minutesToTime12(minutes: number): string {
  const h24 = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

export function minutesToTime24(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function isSlotStartValid(startMinutes: number, durationMinutes: number, settings: BookingSettings): boolean {
  if (startMinutes < settings.dayStartMinutes || startMinutes > settings.lastStartMinutes) return false;
  const end = startMinutes + durationMinutes;
  return end <= settings.hardCloseMinutes;
}

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd;
}

function isBlocked(date: string, startMinutes: number, durationMinutes: number, settings: BookingSettings): boolean {
  for (const block of settings.blocks) {
    if (block.date !== date) continue;
    if (!block.startTime && !block.endTime) return true;
    const bStart = block.startTime ? timeToMinutes(block.startTime) : settings.dayStartMinutes;
    const bEnd = block.endTime ? timeToMinutes(block.endTime) : settings.hardCloseMinutes;
    if (overlaps(startMinutes, startMinutes + durationMinutes, bStart, bEnd)) return true;
  }
  return false;
}

function bookingOccupies(booking: SpaBooking, date: string): { start: number; end: number } | null {
  if (booking.appointmentDate !== date || booking.status === "rejected" || booking.status === "cancelled") return null;
  const start = timeToMinutes(booking.appointmentTime);
  if (start < 0) return null;
  const end = start + booking.durationMinutes + 0;
  return { start, end };
}

export function listAvailableSlots(
  date: string,
  durationMinutes: number,
  settings: BookingSettings,
  existing: SpaBooking[],
  therapistSlug?: string,
): string[] {
  const slots: string[] = [];
  const { slotIntervalMinutes, dayStartMinutes, lastStartMinutes } = settings;

  for (let start = dayStartMinutes; start <= lastStartMinutes; start += slotIntervalMinutes) {
    if (!isSlotStartValid(start, durationMinutes, settings)) continue;
    if (isBlocked(date, start, durationMinutes, settings)) continue;

    const end = start + durationMinutes;
    let conflict = false;
    for (const booking of existing) {
      const occ = bookingOccupies(booking, date);
      if (!occ) continue;
      if (therapistSlug && booking.therapistSlug && booking.therapistSlug !== therapistSlug) continue;
      if (overlaps(start, end, occ.start, occ.end)) {
        conflict = true;
        break;
      }
    }
    if (!conflict) slots.push(minutesToTime24(start));
  }
  return slots;
}

export function parseDateYmd(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function isPastDate(dateYmd: string, timezone: string): boolean {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" });
  const today = formatter.format(now);
  return dateYmd < today;
}
