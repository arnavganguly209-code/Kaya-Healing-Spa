/**
 * Isolated booking email/PDF checks — no production data, no SMTP send.
 * Run: npx tsx scripts/booking-email-isolated-runner.ts
 */
import {
  buildAdminBookingNotificationHtml,
  buildBookingConfirmationHtml,
} from "../src/lib/booking-email";
import { bookingPdfFilename, generateBookingPdf } from "../src/lib/booking-pdf";
import type { SpaBooking } from "../src/lib/booking-types";

const booking: SpaBooking = {
  id: "bk-isolated-test-only",
  reference: "KAYA02099",
  bookingNumber: "KAYA02099",
  status: "confirmed",
  createdAt: "2026-10-12T10:00:00.000Z",
  updatedAt: "2026-10-12T10:00:00.000Z",
  name: "Isolated Test Guest",
  email: "isolated-test@example.invalid",
  phone: "+9779800000000",
  serviceName: "Deep Tissue Massage",
  durationMinutes: 60,
  priceNpr: 4500,
  priceConfirmed: true,
  appointmentDate: "2026-12-01",
  appointmentTime: "10:00",
  guests: 1,
  amountPaidNpr: 0,
  paymentStatus: "unpaid",
  paymentMethod: "pay_at_spa",
  privacyAccepted: true,
  pdfAccessToken: "isolated-test-token",
  audit: [{ at: "2026-10-12T10:00:00.000Z", status: "confirmed", by: "system" }],
};

const xssBooking: SpaBooking = { ...booking, name: '<img src=x onerror="alert(1)">' };
const customerHtml = buildBookingConfirmationHtml(booking);
if (!customerHtml.includes("KAYA02099")) throw new Error("customer HTML missing reference");
if (!customerHtml.includes("Pay at Spa")) throw new Error("customer HTML missing payment method");
const xssHtml = buildBookingConfirmationHtml(xssBooking);
if (xssHtml.includes('onerror="alert(1)"')) throw new Error("customer HTML did not escape name");

const adminHtml = buildAdminBookingNotificationHtml(booking);
if (!adminHtml.includes("KAYA02099") || !adminHtml.includes("Isolated Test Guest")) {
  throw new Error("admin HTML missing fields");
}

async function main(): Promise<void> {
  const pdf = await generateBookingPdf(booking);
  const header = Buffer.from(pdf.subarray(0, 5)).toString("ascii");
  if (header !== "%PDF-") throw new Error("invalid PDF header");

  const filename = bookingPdfFilename(booking);
  if (filename !== "KAYA02099-Booking-Confirmation.pdf") throw new Error("unexpected PDF filename");

  console.log("booking-email-isolated-runner: PASS", pdf.length, "bytes", filename);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
