import { dataFilePath, readJsonFile, writeJsonFileAtomic } from "@/lib/json-file";
import { formatSequentialBookingNumber, maxSequentialFromBookings } from "@/lib/booking-number";
import type { SpaBooking } from "@/lib/booking-types";

const seqPath = dataFilePath("booking-sequence.json");

type SequenceState = { lastAssigned: number };

function readSequenceState(): SequenceState {
  return readJsonFile(seqPath, () => ({ lastAssigned: 2000 }));
}

/** Retries on collision; pass current bookings snapshot. */
export function allocateBookingNumber(existingBookings: SpaBooking[]): string {
  const scannedMax = maxSequentialFromBookings(existingBookings, 2000);

  for (let attempt = 0; attempt < 8; attempt++) {
    const state = readSequenceState();
    const nextSeq = Math.max(state.lastAssigned, scannedMax) + 1;
    const number = formatSequentialBookingNumber(nextSeq);

    const taken = existingBookings.some((b) => (b.bookingNumber || b.reference) === number);
    if (!taken) {
      writeJsonFileAtomic(seqPath, { lastAssigned: nextSeq });
      return number;
    }
    writeJsonFileAtomic(seqPath, { lastAssigned: nextSeq });
  }

  throw new Error("Unable to allocate booking number");
}
