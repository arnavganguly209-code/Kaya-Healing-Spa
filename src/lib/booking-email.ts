import { formatNpr, site } from "@/lib/content";
import { minutesToTime12, timeToMinutes } from "@/lib/booking-scheduler";
import { displayBookingNumber } from "@/lib/booking-number";
import { sendBookingMail, type BookingMailResult } from "@/lib/booking-mail-provider";
import { bookingAmountDueNpr, bookingAmountPaidNpr, bookingGrandTotalNpr } from "@/lib/booking-pricing";
import { bookingPdfFilename, generateBookingPdf, signedBookingPdfUrl } from "@/lib/booking-pdf";
import type { SpaBooking } from "@/lib/booking-types";
import { bookingFromEmail, spaPublicUrl } from "@/lib/spa-config";
import { readOrbitContent } from "@/lib/orbit-store";

function endTimeLabel(booking: SpaBooking): string {
  const start = timeToMinutes(booking.appointmentTime);
  if (start < 0) return "—";
  return minutesToTime12(start + booking.durationMinutes);
}

function statusHeadline(booking: SpaBooking): string {
  if (booking.status === "pending") return "Your reservation request has been received";
  if (booking.status === "confirmed") return "Your booking is confirmed";
  return `Booking update — ${booking.status.replace(/_/g, " ")}`;
}

export function buildBookingConfirmationHtml(booking: SpaBooking): string {
  const orbit = readOrbitContent();
  const phone = orbit.phone || site.phone;
  const address = site.addressLine;
  const contactEmail = bookingFromEmail() || orbit.email || "booking@kayahealingspa.com.np";
  const number = displayBookingNumber(booking);
  const total = bookingGrandTotalNpr(booking);
  const paid = bookingAmountPaidNpr(booking);
  const due = bookingAmountDueNpr(booking);
  const logoUrl = `${spaPublicUrl()}/brand/kaya-logo-hd.png`;
  const pdfLink = booking.pdfAccessToken ? signedBookingPdfUrl(booking) : null;
  const policyUrl = `${spaPublicUrl()}/terms`;

  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px 12px;color:#8a8175;font-size:13px;border-bottom:1px solid #efe8e0;width:38%">${label}</td><td style="padding:8px 12px;color:#141210;font-size:13px;font-weight:600;border-bottom:1px solid #efe8e0">${value}</td></tr>`;

  const greeting = `Dear ${booking.name},`;

  const bodyText = `
Thank you for choosing Kaya Healing Spa. We appreciate your reservation and look forward to welcoming you.

Your booking reference is ${number}. Please review the attached booking confirmation for your selected treatment, appointment details, and complete price breakdown.

Payment is due at the spa. No online payment has been collected for this booking.

Please retain your booking reference and present it when you arrive. If you need assistance with your reservation, contact our team using the details below.

Thank you for choosing Kaya Healing Spa. We look forward to making your visit relaxing and memorable.

Warm regards,
Kaya Healing Spa
${contactEmail}`;

  return `<!DOCTYPE html><html><body style="margin:0;background:#f6f1e8;font-family:Georgia,serif">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
  <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e6dfd4">
  <tr><td style="padding:28px 32px 12px;text-align:center;background:#fffdfb">
  <img src="${logoUrl}" alt="Kaya Healing Spa" width="140" style="max-width:140px;height:auto" />
  </td></tr>
  <tr><td style="padding:8px 32px 0;text-align:center">
  <h1 style="margin:0;font-size:22px;color:#141210">${statusHeadline(booking)}</h1>
  <p style="margin:12px 0 0;font-size:15px;color:#4a453e">${greeting}</p>
  <p style="margin:20px 0 0;display:inline-block;padding:12px 20px;background:#fff7f0;border:2px solid #F47B20;border-radius:12px;font-size:20px;font-weight:bold;color:#F47B20">${number}</p>
  </td></tr>
  <tr><td style="padding:20px 32px 0;font-size:14px;line-height:1.65;color:#4a453e;white-space:pre-line">${bodyText.trim()}</td></tr>
  <tr><td style="padding:24px 32px">
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #efe8e0;border-radius:12px">
  ${row("Service / package", booking.serviceName || booking.packageName || "—")}
  ${row("Appointment", `${booking.appointmentDate} · ${minutesToTime12(timeToMinutes(booking.appointmentTime))} – ${endTimeLabel(booking)}`)}
  ${row("Duration", `${booking.durationMinutes} minutes`)}
  ${row("Guests", String(booking.guests ?? 1))}
  ${booking.therapistName ? row("Therapist preference", booking.therapistName) : ""}
  ${row("Grand total", total > 0 ? formatNpr(total) : "To be confirmed")}
  ${row("Amount paid", formatNpr(paid))}
  ${row("Amount due", total > 0 ? formatNpr(due) : "—")}
  ${row("Payment method", "Pay at Spa")}
  ${row("Payment status", booking.paymentStatus ?? "unpaid")}
  ${row("Booking status", booking.status)}
  </table>
  <p style="margin:16px 0 0;padding:12px;background:#fff7f0;border-left:4px solid #F47B20;font-size:13px;color:#141210"><strong>Payment is due at the spa.</strong> No online payment has been collected for this booking.</p>
  ${pdfLink ? `<p style="margin:12px 0 0;font-size:13px"><a href="${pdfLink}" style="color:#F47B20">Download your booking confirmation (secure link)</a></p>` : ""}
  <p style="margin:12px 0 0;font-size:12px;color:#8a8175"><a href="${policyUrl}" style="color:#F47B20">Cancellation &amp; rescheduling policy</a></p>
  </td></tr>
  <tr><td style="padding:20px 32px 28px;background:#f6f1e8;font-size:12px;color:#6B6B6B;text-align:center">
  ${address}<br/>
  ${phone} · ${contactEmail}<br/>
  <a href="${spaPublicUrl()}" style="color:#F47B20">${spaPublicUrl()}</a>
  </td></tr>
  </table></td></tr></table></body></html>`;
}

export type SendBookingEmailResult = BookingMailResult;

export async function sendBookingConfirmationEmail(booking: SpaBooking): Promise<SendBookingEmailResult> {
  const number = displayBookingNumber(booking);
  const pdfBytes = await generateBookingPdf(booking);
  const plain = buildBookingConfirmationHtml(booking)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return sendBookingMail({
    to: booking.email,
    subject: `Your Kaya Healing Spa Booking Confirmation — ${number}`,
    html: buildBookingConfirmationHtml(booking),
    text: plain,
    attachments: [{ filename: bookingPdfFilename(booking), content: Buffer.from(pdfBytes) }],
  });
}
