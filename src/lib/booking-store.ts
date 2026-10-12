import { dataFilePath, readJsonFile, writeJsonFileAtomic } from "@/lib/json-file";
import type { BookingStatus, SpaBooking } from "@/lib/booking-types";

const path = dataFilePath("spa-bookings.json");

export function readBookings(): SpaBooking[] {
  return readJsonFile(path, () => []);
}

function makeReference() {
  return `KAYA-${Date.now().toString(36).toUpperCase().slice(-8)}`;
}

export function createBooking(input: Omit<SpaBooking, "id" | "reference" | "createdAt" | "updatedAt" | "audit"> & { status?: BookingStatus }) {
  const now = new Date().toISOString();
  const booking: SpaBooking = {
    ...input,
    id: `bk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    reference: makeReference(),
    status: input.status ?? "pending",
    createdAt: now,
    updatedAt: now,
    audit: [{ at: now, status: input.status ?? "pending", by: "system" }],
  };
  const list = readBookings();
  list.unshift(booking);
  writeJsonFileAtomic(path, list.slice(0, 2000));
  return booking;
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
  writeJsonFileAtomic(path, list);
  return next;
}

export function findBookingByReference(reference: string) {
  return readBookings().find((b) => b.reference === reference);
}
