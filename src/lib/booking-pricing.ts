import type { SpaBooking } from "@/lib/booking-types";

export function bookingGrandTotalNpr(booking: SpaBooking): number {
  return booking.priceNpr ?? 0;
}

export function bookingAmountPaidNpr(booking: SpaBooking): number {
  return booking.amountPaidNpr ?? 0;
}

export function bookingAmountDueNpr(booking: SpaBooking): number {
  const total = bookingGrandTotalNpr(booking);
  if (total <= 0) return 0;
  return Math.max(0, total - bookingAmountPaidNpr(booking));
}
