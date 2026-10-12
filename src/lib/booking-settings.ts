import { dataFilePath, readJsonFile, writeJsonFileAtomic } from "@/lib/json-file";
import type { BookingSettings } from "@/lib/booking-types";

const path = dataFilePath("booking-settings.json");

export function defaultBookingSettings(): BookingSettings {
  return {
    timezone: "Asia/Kathmandu",
    dayStartMinutes: 8 * 60,
    lastStartMinutes: 23 * 60 + 45,
    hardCloseMinutes: 24 * 60,
    slotIntervalMinutes: 15,
    defaultDurationMinutes: 60,
    bufferMinutes: 0,
    advanceBookingDays: 90,
    blocks: [],
  };
}

export function readBookingSettings(): BookingSettings {
  const raw = readJsonFile(path, () => null as Partial<BookingSettings> | null);
  const d = defaultBookingSettings();
  if (!raw) return d;
  return {
    ...d,
    ...raw,
    blocks: Array.isArray(raw.blocks) ? raw.blocks : d.blocks,
  };
}

export function writeBookingSettings(settings: BookingSettings) {
  writeJsonFileAtomic(path, settings);
}
