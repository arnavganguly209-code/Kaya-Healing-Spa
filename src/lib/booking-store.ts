import { withDataFileLock } from "@/lib/data-file-lock";
import { dataFilePath, readJsonFile, writeJsonFileAtomic } from "@/lib/json-file";
import { displayBookingNumber } from "@/lib/booking-number";
import { allocateBookingNumber } from "@/lib/booking-sequence";
import type { BookingEmailDelivery, BookingStatus, SpaBooking } from "@/lib/booking-types";
import { randomBytes } from "crypto";

function bookingsFile() {
  return dataFilePath("spa-bookings.json");
}

export function readBookings(): SpaBooking[] {
  return readJsonFile(bookingsFile(), () => []);
}

function writeBookings(list: SpaBooking[]) {
  writeJsonFileAtomic(bookingsFile(), list.slice(0, 5000));
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
  return withDataFileLock("booking-data", () => {
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
      adminEmailDelivery: input.adminEmailDelivery ?? { status: "pending", attempts: 0 },
      createdAt: now,
      updatedAt: now,
      audit: [{ at: now, status: input.status ?? "confirmed", by: "system" }],
    };

    if (booking.amountPaidNpr && booking.amountPaidNpr > 0 && total > booking.amountPaidNpr) {
      booking.paymentStatus = "partial";
    } else if (booking.amountPaidNpr && total > 0 && booking.amountPaidNpr >= total) {
      booking.paymentStatus = "paid";
    }

    if (list.some((b) => (b.bookingNumber || b.reference) === bookingNumber)) {
      throw new Error("Booking number collision — retry request");
    }

    list.unshift(booking);
    writeBookings(list);
    return { booking, created: true };
  });
}

export function deleteBooking(id: string) {
  return withDataFileLock("booking-data", () => {
    const list = readBookings();
    const index = list.findIndex((b) => b.id === id);
    if (index < 0) return null;
    const [removed] = list.splice(index, 1);
    writeBookings(list);
    return removed;
  });
}

export function updateBookingStatus(id: string, status: BookingStatus, note?: string) {
  return withDataFileLock("booking-data", () => {
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
  });
}

export function attachInvoiceToBooking(bookingId: string, invoiceId: string, invoiceNumber: string) {
  return withDataFileLock("booking-data", () => {
    const list = readBookings();
    const index = list.findIndex((b) => b.id === bookingId);
    if (index < 0) return null;
    list[index] = {
      ...list[index],
      invoiceId,
      invoiceNumber,
      updatedAt: new Date().toISOString(),
    };
    writeBookings(list);
    return list[index];
  });
}

function patchEmailDelivery(
  list: SpaBooking[],
  index: number,
  field: "emailDelivery" | "adminEmailDelivery",
  patch: Partial<BookingEmailDelivery>,
) {
  const current = list[index][field] ?? { status: "pending", attempts: 0 };
  const nextDelivery: BookingEmailDelivery = {
    ...current,
    ...patch,
    attempts: patch.attempts ?? current.attempts,
  };
  list[index] = {
    ...list[index],
    [field]: nextDelivery,
    updatedAt: new Date().toISOString(),
  };
}

export function updateBookingEmailDelivery(id: string, patch: Partial<BookingEmailDelivery>) {
  return withDataFileLock("booking-data", () => {
    const list = readBookings();
    const index = list.findIndex((b) => b.id === id);
    if (index < 0) return null;
    patchEmailDelivery(list, index, "emailDelivery", patch);
    writeBookings(list);
    return list[index];
  });
}

export function updateBookingAdminEmailDelivery(id: string, patch: Partial<BookingEmailDelivery>) {
  return withDataFileLock("booking-data", () => {
    const list = readBookings();
    const index = list.findIndex((b) => b.id === id);
    if (index < 0) return null;
    patchEmailDelivery(list, index, "adminEmailDelivery", patch);
    writeBookings(list);
    return list[index];
  });
}

export function recordBookingPayment(id: string, amountNpr: number, note?: string) {
  return withDataFileLock("booking-data", () => {
    const list = readBookings();
    const index = list.findIndex((b) => b.id === id);
    if (index < 0) return null;
    const booking = list[index];
    const total = booking.priceNpr ?? 0;
    const paid = Math.max(0, (booking.amountPaidNpr ?? 0) + amountNpr);
    let paymentStatus = booking.paymentStatus ?? "unpaid";
    if (total > 0 && paid >= total) paymentStatus = "paid";
    else if (paid > 0) paymentStatus = "partial";

    const now = new Date().toISOString();
    const next = {
      ...booking,
      amountPaidNpr: paid,
      paymentStatus,
      updatedAt: now,
      audit: [...booking.audit, { at: now, status: booking.status, note: note || `Payment recorded: NPR ${amountNpr}`, by: "admin" as const }],
    };
    list[index] = next;
    writeBookings(list);
    return next;
  });
}

export function verifyPdfAccess(booking: SpaBooking, token: string): boolean {
  return Boolean(booking.pdfAccessToken && token && booking.pdfAccessToken === token);
}

export { displayBookingNumber };
