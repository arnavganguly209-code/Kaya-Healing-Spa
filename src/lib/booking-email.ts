import { formatNpr } from "@/lib/content";
import { minutesToTime12, timeToMinutes } from "@/lib/booking-scheduler";
import { displayBookingNumber } from "@/lib/booking-number";
import { bookingPdfFilename, generateBookingPdf } from "@/lib/booking-pdf";
import type { SpaBooking } from "@/lib/booking-types";
import { smtpFromEmail, spaPublicUrl } from "@/lib/spa-config";
import { readOrbitContent } from "@/lib/orbit-store";
import { sendSmtpMail, type SmtpSendResult } from "@/lib/smtp-mail";

function endTimeLabel(booking: SpaBooking): string {
  const start = timeToMinutes(booking.appointmentTime);
  if (start < 0) return "—";
  return minutesToTime12(start + booking.durationMinutes);
}

function buildHtml(booking: SpaBooking): string {
  const orbit = readOrbitContent();
  const phone = orbit.phone || "01-5355882";
  const contactEmail = smtpFromEmail() || orbit.email;
  const number = displayBookingNumber(booking);
  const total = booking.priceNpr ?? 0;
  const paid = booking.amountPaidNpr ?? 0;
  const due = total > 0 ? Math.max(0, total - paid) : 0;
  const logoUrl = `${spaPublicUrl()}/brand/kaya-logo-hd.png`;
  const payNote =
    paid > 0
      ? `Amount paid: ${formatNpr(paid)}. Balance due: ${formatNpr(due)}.`
      : "Payment is due at Kaya Healing Spa unless you completed an online payment separately.";

  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px 12px;color:#8a8175;font-size:13px;border-bottom:1px solid #efe8e0">${label}</td><td style="padding:8px 12px;color:#141210;font-size:13px;font-weight:600;border-bottom:1px solid #efe8e0">${value}</td></tr>`;

  return `<!DOCTYPE html><html><body style="margin:0;background:#f6f1e8;font-family:Georgia,serif">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
  <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e6dfd4">
  <tr><td style="padding:28px 32px 12px;text-align:center;background:#fffdfb">
  <img src="${logoUrl}" alt="Kaya Healing Spa" width="140" style="max-width:140px;height:auto" />
  </td></tr>
  <tr><td style="padding:8px 32px 0;text-align:center">
  <h1 style="margin:0;font-size:26px;color:#141210">Your Booking Is Confirmed</h1>
  <p style="margin:12px 0 0;font-size:15px;color:#4a453e">Thank you for choosing Kaya Healing Spa.</p>
  <p style="margin:20px 0 0;display:inline-block;padding:12px 20px;background:#fff7f0;border:2px solid #F47B20;border-radius:12px;font-size:20px;font-weight:bold;color:#F47B20">${number}</p>
  </td></tr>
  <tr><td style="padding:24px 32px">
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #efe8e0;border-radius:12px">
  ${row("Guest name", booking.name)}
  ${row("Email", booking.email)}
  ${row("Phone / WhatsApp", booking.whatsapp || booking.phone)}
  ${row("Service", booking.serviceName || booking.packageName || "—")}
  ${row("Duration", `${booking.durationMinutes} minutes`)}
  ${row("Appointment", `${booking.appointmentDate} · ${minutesToTime12(timeToMinutes(booking.appointmentTime))} – ${endTimeLabel(booking)}`)}
  ${row("Guests", String(booking.guests ?? 1))}
  ${booking.therapistName ? row("Therapist", booking.therapistName) : ""}
  ${row("Total", total > 0 ? formatNpr(total) : "To be confirmed")}
  ${row("Amount paid", formatNpr(paid))}
  ${row("Balance due", total > 0 ? formatNpr(due) : "—")}
  ${row("Payment", payNote)}
  ${row("Booking status", booking.status)}
  </table>
  <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#4a453e">Please present your booking number at reception. Your PDF confirmation is attached.</p>
  </td></tr>
  <tr><td style="padding:20px 32px 28px;background:#f6f1e8;font-size:12px;color:#6B6B6B;text-align:center">
  ${phone}${contactEmail ? ` · ${contactEmail}` : ""}<br/>
  <a href="${spaPublicUrl()}" style="color:#F47B20">${spaPublicUrl()}</a>
  </td></tr>
  </table></td></tr></table></body></html>`;
}

export type SendBookingEmailResult = SmtpSendResult;

export async function sendBookingConfirmationEmail(booking: SpaBooking): Promise<SendBookingEmailResult> {
  const number = displayBookingNumber(booking);
  const pdfBytes = await generateBookingPdf(booking);
  return sendSmtpMail({
    to: booking.email,
    subject: `Booking Confirmed — ${number} | Kaya Healing Spa`,
    html: buildHtml(booking),
    attachments: [{ filename: bookingPdfFilename(booking), content: Buffer.from(pdfBytes) }],
  });
}
