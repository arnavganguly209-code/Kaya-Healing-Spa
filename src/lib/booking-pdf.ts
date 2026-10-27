import { formatNpr, site } from "@/lib/content";
import { minutesToTime12, timeToMinutes } from "@/lib/booking-scheduler";
import { displayBookingNumber } from "@/lib/booking-number";
import { bookingAmountDueNpr, bookingAmountPaidNpr, bookingGrandTotalNpr } from "@/lib/booking-pricing";
import type { SpaBooking } from "@/lib/booking-types";
import { smtpFromEmail, SPA_BOOKING_PHONE, SPA_BOOKING_WHATSAPP, spaPublicUrl } from "@/lib/spa-config";
import { readOrbitContent } from "@/lib/orbit-store";
import { embedBrandLogo } from "@/lib/pdf-brand";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

const GOLD = rgb(0.957, 0.482, 0.125);
const GOLD_SOFT = rgb(0.93, 0.78, 0.55);
const INK = rgb(0.09, 0.08, 0.07);
const MUTED = rgb(0.42, 0.39, 0.35);
const CREAM = rgb(0.992, 0.976, 0.96);
const CARD = rgb(1, 0.997, 0.992);
const RULE = rgb(0.89, 0.84, 0.78);
const IVORY = rgb(0.98, 0.95, 0.91);

function endTimeLabel(booking: SpaBooking): string {
  const start = timeToMinutes(booking.appointmentTime);
  if (start < 0) return "—";
  return minutesToTime12(start + booking.durationMinutes);
}

function money(amount: number | null | undefined): string {
  if (amount == null || amount <= 0) return "To be confirmed";
  return formatNpr(amount);
}

/** Helvetica/WinAnsi: keep ASCII punctuation. Never insert "?" for unknown glyphs. */
function pdfText(value: string, max = 96): string {
  return value
    .replace(/[–—−]/g, "-")
    .replace(/[·•∙]/g, " | ")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\u00a0/g, " ")
    .replace(/[^\t\n\r\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function formatPdfDate(ymd: string): string {
  const match = ymd.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return ymd;
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months[Number(match[2]) - 1];
  if (!month) return ymd;
  return `${Number(match[3])} ${month} ${match[1]}`;
}

function pdfStatusLabel(status: string): string {
  if (status === "confirmed") return "Confirmed";
  if (status === "pending") return "Pending confirmation";
  if (status === "completed") return "Completed";
  if (status === "cancelled") return "Cancelled";
  if (status === "rejected") return "Declined";
  if (status === "no_show") return "No show";
  return status.replace(/_/g, " ");
}

function centerX(pageWidth: number, text: string, size: number, font: PDFFont): number {
  return (pageWidth - font.widthOfTextAtSize(text, size)) / 2;
}

function drawCentered(
  page: PDFPage,
  text: string,
  y: number,
  size: number,
  font: PDFFont,
  color: ReturnType<typeof rgb>,
  pageWidth: number,
) {
  const safe = pdfText(text, 90);
  page.drawText(safe, { x: centerX(pageWidth, safe, size, font), y, size, font, color });
}

export async function generateBookingPdf(booking: SpaBooking): Promise<Uint8Array> {
  const orbit = readOrbitContent();
  const pdfPhone = orbit.phone || SPA_BOOKING_PHONE;
  const pdfWhatsapp = orbit.whatsapp || SPA_BOOKING_WHATSAPP;
  const pdfAddress = orbit.addressLine || site.addressLine;
  const pdfMail = orbit.email || smtpFromEmail() || "booking@kayahealingspa.com.np";
  const doc = await PDFDocument.create();
  const number = displayBookingNumber(booking);
  doc.setTitle(`Kaya Healing Spa Booking ${number}`);
  doc.setSubject(number);
  doc.setCreator("Kaya Healing Spa");

  const page = doc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();
  const margin = 40;
  const contentWidth = width - margin * 2;
  const times = await doc.embedFont(StandardFonts.TimesRoman);
  const timesBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const timesItalic = await doc.embedFont(StandardFonts.TimesRomanItalic);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  page.drawRectangle({ x: 0, y: 0, width, height, color: CREAM });
  page.drawRectangle({ x: 0, y: height - 10, width, height: 10, color: GOLD });
  page.drawRectangle({ x: 0, y: 0, width, height: 10, color: GOLD });
  page.drawRectangle({
    x: 18,
    y: 18,
    width: width - 36,
    height: height - 36,
    borderColor: GOLD_SOFT,
    borderWidth: 0.8,
    color: CREAM,
  });

  let y = height - 42;
  const logo = await embedBrandLogo(doc);
  if (logo) {
    const logoW = 132;
    const logoH = (logo.height / logo.width) * logoW;
    page.drawImage(logo, {
      x: (width - logoW) / 2,
      y: y - logoH,
      width: logoW,
      height: logoH,
    });
    y -= logoH + 22;
  }

  drawCentered(page, "KAYA HEALING SPA", y, 17, timesBold, INK, width);
  y -= 15;
  drawCentered(page, site.tagline, y, 10, timesItalic, GOLD, width);
  y -= 14;
  drawCentered(page, pdfAddress, y, 8, font, MUTED, width);
  y -= 13;
  drawCentered(page, `Phone: ${pdfPhone}    WhatsApp: ${pdfWhatsapp}`, y, 9, fontBold, INK, width);
  y -= 12;
  drawCentered(page, `${pdfMail}  |  www.kayahealingspa.com.np`, y, 8, font, MUTED, width);
  y -= 16;

  page.drawLine({
    start: { x: margin + 48, y },
    end: { x: width - margin - 48, y },
    thickness: 0.7,
    color: GOLD,
  });
  y -= 22;

  drawCentered(page, "BOOKING CONFIRMATION", y, 13, timesBold, GOLD, width);
  y -= 28;

  const badgeW = 250;
  const badgeH = 36;
  page.drawRectangle({
    x: (width - badgeW) / 2,
    y: y - 10,
    width: badgeW,
    height: badgeH,
    color: IVORY,
    borderColor: GOLD,
    borderWidth: 1.1,
  });
  drawCentered(page, number, y + 4, 16, timesBold, GOLD, width);
  y -= 32;
  drawCentered(page, "Please present this confirmation at reception", y, 8, timesItalic, MUTED, width);
  y -= 22;

  const cardGap = 12;
  const cardW = (contentWidth - cardGap) / 2;
  const cardH = 132;
  const leftX = margin;
  const rightX = margin + cardW + cardGap;
  const cardTop = y;

  const drawCard = (x: number, title: string) => {
    page.drawRectangle({
      x,
      y: cardTop - cardH,
      width: cardW,
      height: cardH,
      color: CARD,
      borderColor: RULE,
      borderWidth: 0.8,
    });
    page.drawRectangle({ x, y: cardTop - 18, width: cardW, height: 18, color: INK });
    page.drawText(pdfText(title, 28), {
      x: x + 10,
      y: cardTop - 13,
      size: 8,
      font: fontBold,
      color: rgb(1, 1, 1),
    });
  };

  drawCard(leftX, "GUEST");
  drawCard(rightX, "APPOINTMENT");

  const row = (x: number, rowY: number, label: string, value: string, valueSize = 9) => {
    page.drawText(pdfText(label, 18), { x: x + 10, y: rowY, size: 7.5, font, color: MUTED });
    page.drawText(pdfText(value, 36), { x: x + 10, y: rowY - 13, size: valueSize, font: fontBold, color: INK });
  };

  let ly = cardTop - 32;
  row(leftX, ly, "Name", booking.name);
  ly -= 30;
  row(leftX, ly, "Email", booking.email);
  ly -= 30;
  row(leftX, ly, "Guest phone", booking.whatsapp || booking.phone);

  const startLabel = minutesToTime12(timeToMinutes(booking.appointmentTime));
  const endLabel = endTimeLabel(booking);
  let ry = cardTop - 32;
  row(rightX, ry, "Date", formatPdfDate(booking.appointmentDate), 10);
  ry -= 30;
  row(rightX, ry, "Time", `${startLabel} to ${endLabel}`, 10);
  ry -= 30;
  row(rightX, ry, "Duration / guests", `${booking.durationMinutes} min  |  ${booking.guests ?? 1} guest(s)`);

  y = cardTop - cardH - 16;

  page.drawRectangle({
    x: margin,
    y: y - 52,
    width: contentWidth,
    height: 52,
    color: CARD,
    borderColor: RULE,
    borderWidth: 0.8,
  });
  page.drawRectangle({ x: margin, y: y - 18, width: contentWidth, height: 18, color: INK });
  page.drawText("TREATMENT", { x: margin + 10, y: y - 13, size: 8, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText(pdfText(booking.serviceName || booking.packageName || "Treatment", 56), {
    x: margin + 10,
    y: y - 36,
    size: 11,
    font: timesBold,
    color: INK,
  });
  if (booking.therapistName) {
    page.drawText(pdfText(`Therapist: ${booking.therapistName}`, 48), {
      x: margin + 10,
      y: y - 48,
      size: 8,
      font,
      color: MUTED,
    });
  }
  y -= 68;

  const total = bookingGrandTotalNpr(booking);
  const paid = bookingAmountPaidNpr(booking);
  const due = bookingAmountDueNpr(booking);
  const priceH = 92;
  page.drawRectangle({
    x: margin,
    y: y - priceH,
    width: contentWidth,
    height: priceH,
    color: CARD,
    borderColor: RULE,
    borderWidth: 0.8,
  });
  page.drawRectangle({ x: margin, y: y - 18, width: contentWidth, height: 18, color: GOLD });
  page.drawText("INVESTMENT  |  PAY AT SPA", {
    x: margin + 10,
    y: y - 13,
    size: 8,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  const col = (label: string, value: string, cx: number) => {
    page.drawText(pdfText(label, 18), { x: cx, y: y - 36, size: 7.5, font, color: MUTED });
    page.drawText(pdfText(value, 22), { x: cx, y: y - 50, size: 10, font: fontBold, color: INK });
  };
  col("Subtotal", money(total), margin + 12);
  col("Paid", money(paid), margin + 150);
  col("Due at spa", total > 0 ? money(due) : "-", margin + 280);
  page.drawText(pdfText(`Status: ${pdfStatusLabel(booking.status)}  |  ${(booking.paymentStatus ?? "unpaid").replace(/_/g, " ")}`, 56), {
    x: margin + 12,
    y: y - 72,
    size: 8,
    font,
    color: MUTED,
  });
  y -= priceH + 14;

  if (booking.notes) {
    page.drawText("Special requests", { x: margin, y, size: 8, font: fontBold, color: INK });
    y -= 12;
    page.drawText(pdfText(booking.notes, 92), { x: margin, y, size: 8, font, color: MUTED, maxWidth: contentWidth });
    y -= 16;
  }

  page.drawRectangle({
    x: margin,
    y: y - 36,
    width: contentWidth,
    height: 36,
    color: IVORY,
    borderColor: GOLD,
    borderWidth: 0.7,
  });
  page.drawText("No online payment has been collected. The remaining balance is due at the spa.", {
    x: margin + 10,
    y: y - 16,
    size: 8,
    font: fontBold,
    color: INK,
    maxWidth: contentWidth - 20,
  });
  page.drawText("Cancellation and rescheduling: kayahealingspa.com.np/terms", {
    x: margin + 10,
    y: y - 28,
    size: 7.5,
    font,
    color: MUTED,
  });
  y -= 52;

  drawCentered(
    page,
    "Thank you for choosing Kaya Healing Spa. We look forward to welcoming you.",
    y,
    9,
    timesItalic,
    INK,
    width,
  );

  const footerY = 28;
  page.drawText(pdfText(`Reference ${number}`, 28), { x: margin, y: footerY, size: 7.5, font, color: MUTED });
  page.drawText(`Phone ${pdfPhone}`, {
    x: centerX(width, `Phone ${pdfPhone}`, 7.5, font),
    y: footerY,
    size: 7.5,
    font,
    color: MUTED,
  });
  page.drawText(`WhatsApp ${pdfWhatsapp}`, {
    x: width - margin - font.widthOfTextAtSize(`WhatsApp ${pdfWhatsapp}`, 7.5),
    y: footerY,
    size: 7.5,
    font,
    color: MUTED,
  });

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
