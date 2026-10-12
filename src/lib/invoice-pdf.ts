import { formatNpr, site } from "@/lib/content";
import type { SpaInvoice } from "@/lib/billing-types";
import type { SpaBooking } from "@/lib/booking-types";
import { smtpFromEmail, spaPublicUrl } from "@/lib/spa-config";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { embedBrandLogo } from "@/lib/pdf-brand";

const ORANGE = rgb(0.957, 0.482, 0.125);
const DARK = rgb(0.08, 0.07, 0.06);
const MUTED = rgb(0.42, 0.4, 0.37);

export async function generateInvoicePdf(booking: SpaBooking, invoice: SpaInvoice): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();
  const margin = 42;
  const contentWidth = width - margin * 2;
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  let y = height - margin;
  const logo = await embedBrandLogo(doc);
  if (logo) {
    const logoW = 110;
    const logoH = (logo.height / logo.width) * logoW;
    page.drawImage(logo, { x: margin, y: y - logoH, width: logoW, height: logoH });
    y -= logoH + 10;
  }

  page.drawText("Kaya Healing Spa", { x: margin, y, size: 16, font: fontBold, color: DARK });
  y -= 12;
  page.drawText(site.addressLine, { x: margin, y, size: 8, font, color: MUTED, maxWidth: contentWidth });
  y -= 22;
  page.drawText(`${site.phone} · ${smtpFromEmail()}`, { x: margin, y, size: 9, font, color: MUTED });
  y -= 12;
  page.drawText(spaPublicUrl(), { x: margin, y, size: 9, font, color: MUTED });

  page.drawText("INVOICE", { x: margin, y: y - 26, size: 14, font: fontBold, color: ORANGE });
  y -= 48;
  page.drawText(`Invoice ${invoice.invoiceNumber}`, { x: margin, y, size: 14, font: fontBold, color: DARK });
  y -= 16;
  page.drawText(`Booking reference: ${invoice.bookingNumber}`, { x: margin, y, size: 10, font, color: MUTED });
  y -= 14;
  page.drawText(`Status: ${invoice.status.replace(/_/g, " ")}`, { x: margin, y, size: 10, font, color: MUTED });
  y -= 22;

  const drawRow = (label: string, value: string) => {
    page.drawText(label, { x: margin, y, size: 9, font, color: MUTED });
    page.drawText(value, { x: margin + 150, y, size: 9, font: fontBold, color: DARK });
    y -= 14;
  };

  page.drawText("Bill to", { x: margin, y, size: 11, font: fontBold, color: DARK });
  y -= 16;
  drawRow("Name", invoice.customerName);
  drawRow("Email", invoice.customerEmail);
  drawRow("Phone", invoice.customerPhone);
  y -= 8;

  page.drawText("Line items", { x: margin, y, size: 11, font: fontBold, color: DARK });
  y -= 14;
  for (const line of invoice.lineItems) {
    const desc = `${line.description} (${line.durationMinutes ?? booking.durationMinutes} min)`;
    page.drawText(desc.slice(0, 48), { x: margin, y, size: 9, font, color: DARK });
    page.drawText(`×${line.quantity}`, { x: margin + 280, y, size: 9, font, color: DARK });
    page.drawText(formatNpr(line.lineTotalNpr), { x: margin + 360, y, size: 9, font: fontBold, color: DARK });
    y -= 14;
  }
  y -= 6;

  drawRow("Subtotal", formatNpr(invoice.subtotalNpr));
  if (invoice.discountNpr > 0) drawRow("Discount", formatNpr(invoice.discountNpr));
  if (invoice.taxNpr > 0) drawRow(`Tax (${invoice.taxRatePercent}%)`, formatNpr(invoice.taxNpr));
  drawRow("Grand total", formatNpr(invoice.totalNpr));
  drawRow("Amount paid", formatNpr(invoice.amountPaidNpr));
  drawRow("Balance due", formatNpr(invoice.balanceDueNpr));
  drawRow("Payment method", "Pay at Spa");

  y -= 8;
  page.drawText("Payment is due at the spa unless staff have recorded a payment on this invoice.", {
    x: margin,
    y,
    size: 8,
    font,
    color: DARK,
    maxWidth: contentWidth,
  });

  page.drawText(`Invoice ${invoice.invoiceNumber} · Page 1 of 1`, {
    x: margin,
    y: margin + 6,
    size: 8,
    font,
    color: MUTED,
  });

  return doc.save();
}

export function invoicePdfFilename(invoice: SpaInvoice): string {
  return `${invoice.invoiceNumber}-Invoice.pdf`;
}
