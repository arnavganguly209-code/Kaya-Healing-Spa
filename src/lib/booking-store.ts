import { dataFilePath, readJsonFile, writeJsonFileAtomic } from "@/lib/json-file";
import { displayBookingNumber } from "@/lib/booking-number";
import { allocateBookingNumber } from "@/lib/booking-sequence";
import type { BookingEmailDelivery, BookingStatus, SpaBooking } from "@/lib/booking-types";
import { randomBytes } from "crypto";

const path = dataFilePath("spa-bookings.json");

export function readBookings(): SpaBooking[] {
  return readJsonFile(path, () => []);
}

function writeBookings(list: SpaBooking[]) {
  writeJsonFileAtomic(path, list.slice(0, 5000));
}

export function newPdfAccessToken(): string {
  return randomBytes(24).toString("base64url");
}

export function findBookingByReference(reference: string) {
  const key = reference.trim();
  return readBookings().find((b) => b.reference === key || b.bookingNumber === key);
}

export function findBookingByIdempotencyKey(key: string) {
  return readBookings().find((b) => b.idempotencyKey === key);
}

export function findBookingById(id: string) {
  return readBookings().find((b) => b.id === id);
}

export function createBooking(
  input: Omit<SpaBooking, "id" | "reference" | "bookingNumber" | "createdAt" | "updatedAt" | "audit" | "pdfAccessToken"> & {
    status?: BookingStatus;
    idempotencyKey?: string;
  },
): { booking: SpaBooking; created: boolean } {
  if (input.idempotencyKey) {
    const existing = findBookingByIdempotencyKey(input.idempotencyKey);
    if (existing) return { booking: existing, created: false };
  }

  const list = readBookings();
  const bookingNumber = allocateBookingNumber(list);
  const now = new Date().toISOString();
  const total = input.priceNpr ?? 0;
  const booking: SpaBooking = {
    ...input,
    id: `bk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    bookingNumber,
    reference: bookingNumber,
    status: input.status ?? "confirmed",
    guests: input.guests ?? 1,
    amountPaidNpr: input.amountPaidNpr ?? 0,
    paymentStatus: input.paymentStatus ?? "unpaid",
    paymentMethod: input.paymentMethod ?? "pay_at_spa",
    pdfAccessToken: newPdfAccessToken(),
    emailDelivery: input.emailDelivery ?? { status: "pending", attempts: 0 },
    createdAt: now,
    updatedAt: now,
    audit: [{ at: now, status: input.status ?? "confirmed", by: "system" }],
  };

  if (booking.amountPaidNpr && booking.amountPaidNpr > 0 && total > booking.amountPaidNpr) {
    booking.paymentStatus = "partial";
  } else if (booking.amountPaidNpr && total > 0 && booking.amountPaidNpr >= total) {
    booking.paymentStatus = "paid";
  }

  list.unshift(booking);
  writeBookings(list);
  return { booking, created: true };
}

export function updateBookingStatus(id: string, status: BookingStatus, note?: string) {
  const list = readBookings();
  const index = list.findIndex((b) => b.id === id);
  if (index < 0) return null;
  const now = new Date().toISOString();
  const next = {
    ...list[index],
    status,
    updatedAt: now,
    audit: [...list[index].audit, { at: now, status, note, by: "admin" as const }],
  };
  list[index] = next;
  writeBookings(list);
  return next;
}

export function updateBookingEmailDelivery(id: string, patch: Partial<BookingEmailDelivery>) {
  const list = readBookings();
  const index = list.findIndex((b) => b.id === id);
  if (index < 0) return null;
  const current = list[index].emailDelivery ?? { status: "pending", attempts: 0 };
  const nextDelivery: BookingEmailDelivery = {
    ...current,
    ...patch,
    attempts: patch.attempts ?? current.attempts,
  };
  const next = {
    ...list[index],
    emailDelivery: nextDelivery,
    updatedAt: new Date().toISOString(),
  };
  list[index] = next;
  writeBookings(list);
  return next;
}

export function verifyPdfAccess(booking: SpaBooking, token: string): boolean {
  return Boolean(booking.pdfAccessToken && token && booking.pdfAccessToken === token);
}

export { displayBookingNumber };
