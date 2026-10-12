import { formatNpr, site } from "@/lib/content";
import { minutesToTime12, timeToMinutes } from "@/lib/booking-scheduler";
import { displayBookingNumber } from "@/lib/booking-number";
import { bookingAmountDueNpr, bookingAmountPaidNpr, bookingGrandTotalNpr } from "@/lib/booking-pricing";
import type { SpaBooking } from "@/lib/booking-types";
import { smtpFromEmail, SPA_BOOKING_PHONE, spaPublicUrl } from "@/lib/spa-config";
import { readOrbitContent } from "@/lib/orbit-store";
import { embedBrandLogo } from "@/lib/pdf-brand";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const ORANGE = rgb(0.957, 0.482, 0.125);
const DARK = rgb(0.08, 0.07, 0.06);
const MUTED = rgb(0.42, 0.4, 0.37);

function endTimeLabel(booking: SpaBooking): string {
  const start = timeToMinutes(booking.appointmentTime);
  if (start < 0) return "—";
  return minutesToTime12(start + booking.durationMinutes);
}

function money(amount: number | null | undefined): string {
  if (amount == null || amount <= 0) return "To be confirmed";
  return formatNpr(amount);
}

/** Helvetica/WinAnsi cannot encode Devanagari; never throw while drawing. */
function pdfText(value: string, max = 96): string {
  return value
    .replace(/[^\t\n\r\x20-\x7E]/g, "?")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export async function generateBookingPdf(booking: SpaBooking): Promise<Uint8Array> {
  const orbit = readOrbitContent();
  const phone = orbit.phone || SPA_BOOKING_PHONE;
  const doc = await PDFDocument.create();
  const number = displayBookingNumber(booking);
  doc.setTitle(`Kaya Healing Spa Booking ${number}`);
  doc.setSubject(number);
  doc.setCreator("Kaya Healing Spa");
  const page = doc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();
  const margin = 42;
  const contentWidth = width - margin * 2;
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  let y = height - margin;
  const logo = await embedBrandLogo(doc);
  if (logo) {
    const logoW = 120;
    const logoH = (logo.height / logo.width) * logoW;
    page.drawImage(logo, { x: margin, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 12;
  }

  page.drawText(pdfText("Kaya Healing Spa"), { x: margin, y, size: 18, font: fontBold, color: DARK });
  y -= 14;
  const address = site.addressLine;
  const addressLines = address.length > 52 ? [address.slice(0, 52), address.slice(52).trim()] : [address];
  for (const line of addressLines.filter(Boolean)) {
    page.drawText(pdfText(line, 80), { x: margin, y, size: 8, font, color: MUTED });
    y -= 11;
  }
  page.drawText(pdfText(phone, 48), { x: margin, y, size: 9, font, color: MUTED });
  y -= 12;
  const contactEmail = smtpFromEmail();
  page.drawText(pdfText(contactEmail, 64), { x: margin, y, size: 9, font, color: MUTED });
  y -= 12;
  page.drawText(pdfText(spaPublicUrl(), 72), { x: margin, y, size: 9, font, color: MUTED });

  const title = "BOOKING CONFIRMATION";
  page.drawText(title, { x: margin, y: y - 28, size: 14, font: fontBold, color: ORANGE });
  y -= 52;

  page.drawText(pdfText(`Booking No. ${number}`, 40), { x: margin, y, size: 16, font: fontBold, color: DARK });
  y -= 28;

  const drawSection = (label: string) => {
    page.drawText(pdfText(label, 40), { x: margin, y, size: 11, font: fontBold, color: DARK });
    y -= 16;
  };

  const drawRow = (label: string, value: string) => {
    page.drawText(pdfText(label, 28), { x: margin, y, size: 9, font, color: MUTED });
    page.drawText(pdfText(value, 70), { x: margin + 140, y, size: 9, font: fontBold, color: DARK });
    y -= 14;
  };

  drawSection("Customer");
  drawRow("Name", booking.name);
  drawRow("Email", booking.email);
  drawRow("Phone / WhatsApp", booking.whatsapp || booking.phone);
  y -= 8;

  drawSection("Appointment");
  drawRow("Booking created", new Date(booking.createdAt).toLocaleString("en-NP", { timeZone: "Asia/Kathmandu" }));
  drawRow("Appointment date", booking.appointmentDate);
  drawRow("Start time", minutesToTime12(timeToMinutes(booking.appointmentTime)));
  drawRow("End time", endTimeLabel(booking));
  drawRow("Guests", String(booking.guests ?? 1));
  drawRow("Service", booking.serviceName || booking.packageName || "—");
  drawRow("Duration", `${booking.durationMinutes} minutes`);
  if (booking.therapistName) drawRow("Therapist", booking.therapistName);
  if (booking.notes) drawRow("Requests", booking.notes.slice(0, 80));
  y -= 8;

  drawSection("Pricing");
  const total = bookingGrandTotalNpr(booking);
  const paid = bookingAmountPaidNpr(booking);
  const due = bookingAmountDueNpr(booking);
  const guests = booking.guests ?? 1;

  page.drawRectangle({
    x: margin,
    y: y - 72,
    width: contentWidth,
    height: 76,
    borderColor: rgb(0.9, 0.9, 0.88),
    borderWidth: 1,
    color: rgb(0.99, 0.99, 0.98),
  });

  const tableY = y - 18;
  page.drawText("Description", { x: margin + 8, y: tableY, size: 8, font: fontBold, color: MUTED });
  page.drawText("Qty / duration", { x: margin + 200, y: tableY, size: 8, font: fontBold, color: MUTED });
  page.drawText("Line total", { x: margin + 320, y: tableY, size: 8, font: fontBold, color: MUTED });
  page.drawText(pdfText(booking.serviceName || booking.packageName || "Treatment", 42), {
    x: margin + 8,
    y: tableY - 16,
    size: 9,
    font,
    color: DARK,
  });
  page.drawText(pdfText(`${guests} guest(s) · ${booking.durationMinutes} min`, 28), { x: margin + 200, y: tableY - 16, size: 9, font, color: DARK });
  page.drawText(pdfText(money(total), 24), { x: margin + 320, y: tableY - 16, size: 9, font: fontBold, color: DARK });
  y -= 96;

  drawRow("Subtotal", money(total));
  drawRow("Amount paid", money(paid));
  drawRow("Remaining due", total > 0 ? money(due) : "—");
  drawRow("Payment status", booking.paymentStatus ?? "unpaid");
  drawRow("Payment method", "Pay at Spa");
  drawRow("Booking status", booking.status);

  y -= 6;
  const notice =
    "Payment is due at the spa. No online payment has been collected for this booking.";
  page.drawText(notice, { x: margin, y, size: 9, font: fontBold, color: DARK, maxWidth: contentWidth });
  y -= 24;
  page.drawText("Cancellation and rescheduling: see kayahealingspa.com.np/terms or contact reception.", {
    x: margin,
    y,
    size: 8,
    font,
    color: MUTED,
    maxWidth: contentWidth,
  });
  y -= 20;

  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: rgb(0.85, 0.83, 0.8) });
  y -= 16;
  page.drawText("Thank you for choosing Kaya Healing Spa. Please present this confirmation at reception.", {
    x: margin,
    y,
    size: 9,
    font,
    color: MUTED,
    maxWidth: contentWidth,
  });

  const footerY = margin + 8;
  page.drawText(pdfText(`Reference: ${number}`, 40), { x: margin, y: footerY, size: 8, font, color: MUTED });
  page.drawText("Page 1 of 1", { x: width - margin - 52, y: footerY, size: 8, font, color: MUTED });

  return doc.save();
}

export function bookingPdfFilename(booking: SpaBooking): string {
  return `${displayBookingNumber(booking)}-Booking-Confirmation.pdf`;
}

export function signedBookingPdfUrl(booking: SpaBooking): string {
  const ref = displayBookingNumber(booking);
  const token = booking.pdfAccessToken;
  if (!token) return "";
  return `${spaPublicUrl()}/api/bookings/pdf?ref=${encodeURIComponent(ref)}&token=${encodeURIComponent(token)}`;
}
