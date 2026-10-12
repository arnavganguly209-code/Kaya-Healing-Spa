import { withDataFileLock } from "@/lib/data-file-lock";
import { computeInvoiceTotals, defaultTaxRatePercent } from "@/lib/billing-calculations";
import type { SpaInvoice } from "@/lib/billing-types";
import { dataFilePath, readJsonFile, writeJsonFileAtomic } from "@/lib/json-file";
import { displayBookingNumber } from "@/lib/booking-number";
import type { SpaBooking } from "@/lib/booking-types";

const invoicesPath = dataFilePath("spa-invoices.json");
const seqPath = dataFilePath("invoice-sequence.json");

function readSequence(): number {
  return readJsonFile(seqPath, () => ({ lastAssigned: 0 })).lastAssigned;
}

function writeSequence(n: number) {
  writeJsonFileAtomic(seqPath, { lastAssigned: n });
}

export function formatInvoiceNumber(seq: number): string {
  return `KAYA-INV-${String(seq).padStart(5, "0")}`;
}

export function readInvoices(): SpaInvoice[] {
  return readJsonFile(invoicesPath, () => []);
}

export function findInvoiceByBookingId(bookingId: string) {
  return readInvoices().find((i) => i.bookingId === bookingId);
}

export function findInvoiceByNumber(invoiceNumber: string) {
  return readInvoices().find((i) => i.invoiceNumber === invoiceNumber);
}

export function createInvoiceForBooking(booking: SpaBooking): SpaInvoice {
  return withDataFileLock("invoice-data", () => {
    const existing = findInvoiceByBookingId(booking.id);
    if (existing) return existing;

    const list = readInvoices();
    const taxRate = defaultTaxRatePercent();
    const unit = booking.priceNpr ?? 0;
    const lineItems = [
      {
        description: booking.serviceName || booking.packageName || "Spa treatment",
        quantity: booking.guests ?? 1,
        unitPriceNpr: unit,
        durationMinutes: booking.durationMinutes,
        discountNpr: 0,
        taxRatePercent: taxRate,
        lineTotalNpr: unit * (booking.guests ?? 1),
      },
    ];
    const totals = computeInvoiceTotals(lineItems, taxRate, booking.amountPaidNpr ?? 0);
    const nextSeq = Math.max(readSequence(), ...list.map((i) => Number(i.invoiceNumber.replace(/\D/g, "")) || 0)) + 1;
    const invoiceNumber = formatInvoiceNumber(nextSeq);
    const now = new Date().toISOString();
    const status =
      totals.balanceDueNpr <= 0 && totals.totalNpr > 0
        ? "paid"
        : totals.amountPaidNpr > 0
          ? "partially_paid"
          : "pending";

    const invoice: SpaInvoice = {
      id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      invoiceNumber,
      bookingId: booking.id,
      bookingNumber: displayBookingNumber(booking),
      status,
      currency: "NPR",
      customerName: booking.name,
      customerEmail: booking.email,
      customerPhone: booking.phone,
      lineItems,
      subtotalNpr: totals.subtotalNpr,
      discountNpr: totals.discountNpr,
      taxNpr: totals.taxNpr,
      taxRatePercent: taxRate,
      totalNpr: totals.totalNpr,
      amountPaidNpr: totals.amountPaidNpr,
      balanceDueNpr: totals.balanceDueNpr,
      createdAt: now,
      updatedAt: now,
    };

    writeSequence(nextSeq);
    list.unshift(invoice);
    writeJsonFileAtomic(invoicesPath, list.slice(0, 5000));
    return invoice;
  });
}
