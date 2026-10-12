import { formatNpr } from "@/lib/content";
import { minutesToTime12, timeToMinutes } from "@/lib/booking-scheduler";
import { displayBookingNumber } from "@/lib/booking-number";
import type { SpaBooking } from "@/lib/booking-types";
import { SPA_BOOKING_EMAIL, SPA_BOOKING_PHONE, spaPublicUrl } from "@/lib/spa-config";
import { readOrbitContent } from "@/lib/orbit-store";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { existsSync, readFileSync } from "fs";
import path from "path";

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

async function embedLogo(doc: PDFDocument) {
  const candidates = [
    path.join(process.cwd(), "public", "brand", "kaya-logo-hd.png"),
    path.join(process.cwd(), "public", "brand", "kaya-logo-192.png"),
  ];
  for (const file of candidates) {
    if (!existsSync(file)) continue;
    const bytes = readFileSync(file);
    try {
      return await doc.embedPng(bytes);
    } catch {
      /* try next */
    }
  }
  return null;
}

export async function generateBookingPdf(booking: SpaBooking): Promise<Uint8Array> {
  const orbit = readOrbitContent();
  const phone = orbit.phone || SPA_BOOKING_PHONE;
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();
  const margin = 42;
  const contentWidth = width - margin * 2;
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  let y = height - margin;
  const logo = await embedLogo(doc);
  if (logo) {
    const logoW = 120;
    const logoH = (logo.height / logo.width) * logoW;
    page.drawImage(logo, { x: margin, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 12;
  }

  page.drawText("Kaya Healing Spa", { x: margin, y, size: 18, font: fontBold, color: DARK });
  y -= 16;
  page.drawText(phone, { x: margin, y, size: 9, font, color: MUTED });
  y -= 12;
  page.drawText(SPA_BOOKING_EMAIL, { x: margin, y, size: 9, font, color: MUTED });
  y -= 12;
  page.drawText(spaPublicUrl(), { x: margin, y, size: 9, font, color: MUTED });

  const title = "SPA BOOKING CONFIRMATION";
  page.drawText(title, { x: margin, y: y - 28, size: 14, font: fontBold, color: ORANGE });
  y -= 52;

  const number = displayBookingNumber(booking);
  page.drawText(`Booking No. ${number}`, { x: margin, y, size: 16, font: fontBold, color: DARK });
  y -= 28;

  const drawSection = (label: string) => {
    page.drawText(label, { x: margin, y, size: 11, font: fontBold, color: DARK });
    y -= 16;
  };

  const drawRow = (label: string, value: string) => {
    page.drawText(label, { x: margin, y, size: 9, font, color: MUTED });
    page.drawText(value, { x: margin + 140, y, size: 9, font: fontBold, color: DARK });
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
  const total = booking.priceNpr ?? 0;
  const paid = booking.amountPaidNpr ?? 0;
  const due = total > 0 ? Math.max(0, total - paid) : 0;

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
  page.drawText("Service", { x: margin + 8, y: tableY, size: 8, font: fontBold, color: MUTED });
  page.drawText("Duration", { x: margin + 200, y: tableY, size: 8, font: fontBold, color: MUTED });
  page.drawText("Total", { x: margin + 320, y: tableY, size: 8, font: fontBold, color: MUTED });
  page.drawText(booking.serviceName || booking.packageName || "Treatment", {
    x: margin + 8,
    y: tableY - 16,
    size: 9,
    font,
    color: DARK,
  });
  page.drawText(`${booking.durationMinutes} min`, { x: margin + 200, y: tableY - 16, size: 9, font, color: DARK });
  page.drawText(money(total), { x: margin + 320, y: tableY - 16, size: 9, font: fontBold, color: DARK });
  y -= 96;

  drawRow("Subtotal", money(total));
  drawRow("Amount paid", money(paid));
  drawRow("Remaining due", total > 0 ? money(due) : "—");
  drawRow("Payment status", booking.paymentStatus ?? "unpaid");
  drawRow("Payment method", "Pay at the Spa");
  drawRow("Booking status", booking.status);

  y -= 6;
  const notice =
    "Payment is due at Kaya Healing Spa. No online payment has been collected through this booking.";
  page.drawText(notice, { x: margin, y, size: 8, font, color: DARK });
  y -= 28;

  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: rgb(0.85, 0.83, 0.8) });
  y -= 16;
  page.drawText("Thank you for choosing Kaya Healing Spa. Please present this confirmation at reception.", {
    x: margin,
    y,
    size: 9,
    font,
    color: MUTED,
  });
  page.drawText(`Reference: ${number}`, { x: margin, y: margin - 4, size: 8, font, color: MUTED });

  return doc.save();
}

export function bookingPdfFilename(booking: SpaBooking): string {
  return `${displayBookingNumber(booking)}-Booking-Confirmation.pdf`;
}
