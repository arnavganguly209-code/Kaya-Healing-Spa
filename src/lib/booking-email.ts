import { formatNpr, site } from "@/lib/content";
import { minutesToTime12, timeToMinutes } from "@/lib/booking-scheduler";
import { displayBookingNumber } from "@/lib/booking-number";
import { bookingAmountDueNpr, bookingAmountPaidNpr, bookingGrandTotalNpr } from "@/lib/booking-pricing";
import { bookingPdfFilename, generateBookingPdf, signedBookingPdfUrl } from "@/lib/booking-pdf";
import type { SpaBooking } from "@/lib/booking-types";
import { bookingNotificationEmail, smtpFromEmail, spaPublicUrl } from "@/lib/spa-config";
import { readOrbitContent } from "@/lib/orbit-store";
import { sendSmtpMail, type SmtpSendResult } from "@/lib/smtp-mail";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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
  const address = orbit.addressLine || site.addressLine;
  const contactEmail = smtpFromEmail();
  const number = displayBookingNumber(booking);
  const total = bookingGrandTotalNpr(booking);
  const paid = bookingAmountPaidNpr(booking);
  const due = bookingAmountDueNpr(booking);
  const logoUrl = `${spaPublicUrl()}/brand/kaya-logo-hd.png`;
  const pdfLink = booking.pdfAccessToken ? signedBookingPdfUrl(booking) : null;
  const policyUrl = `${spaPublicUrl()}/terms`;
  const mapUrl = orbit.externalReviewLinks.googleReviewsUrl || orbit.mapEmbedQuery || site.social.google;

  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px 12px;color:#8a8175;font-size:13px;border-bottom:1px solid #efe8e0;width:38%">${escapeHtml(label)}</td><td style="padding:8px 12px;color:#141210;font-size:13px;font-weight:600;border-bottom:1px solid #efe8e0">${escapeHtml(value)}</td></tr>`;

  const greeting = `Dear ${escapeHtml(booking.name)},`;

  const bodyText = `
Thank you for choosing Kaya Healing Spa. We appreciate your reservation and look forward to welcoming you.

Your booking reference is ${number}. Please review the attached booking confirmation for your selected treatment, appointment details, and complete price breakdown.

Payment is due at the spa. No online payment has been collected for this booking. This email is a booking confirmation, not proof of payment.

Please retain your booking reference and present it when you arrive.`;

  return `<!DOCTYPE html><html><body style="margin:0;background:#f6f1e8;font-family:Georgia,serif">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
  <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e6dfd4">
  <tr><td style="padding:28px 32px 12px;text-align:center;background:#fffdfb">
  <img src="${logoUrl}" alt="Kaya Healing Spa" width="140" style="max-width:140px;height:auto" />
  </td></tr>
  <tr><td style="padding:8px 32px 0;text-align:center">
  <h1 style="margin:0;font-size:22px;color:#141210">${statusHeadline(booking)}</h1>
  <p style="margin:12px 0 0;font-size:15px;color:#4a453e">${greeting}</p>
  <p style="margin:20px 0 0;display:inline-block;padding:12px 20px;background:#fff7f0;border:2px solid #F47B20;border-radius:12px;font-size:20px;font-weight:bold;color:#F47B20">${escapeHtml(number)}</p>
  </td></tr>
  <tr><td style="padding:20px 32px 0;font-size:14px;line-height:1.65;color:#4a453e;white-space:pre-line">${bodyText.trim()}</td></tr>
  <tr><td style="padding:24px 32px">
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #efe8e0;border-radius:12px">
  ${row("Guest name", booking.name)}
  ${row("Email", booking.email)}
  ${row("Phone", booking.whatsapp || booking.phone)}
  ${row("Service / package", booking.serviceName || booking.packageName || "—")}
  ${row("Duration", `${booking.durationMinutes} minutes`)}
  ${row("Appointment", `${booking.appointmentDate} · ${minutesToTime12(timeToMinutes(booking.appointmentTime))} – ${endTimeLabel(booking)} (Asia/Kathmandu)`)}
  ${row("Guests", String(booking.guests ?? 1))}
  ${booking.therapistName ? row("Therapist preference", booking.therapistName) : ""}
  ${row("Grand total", total > 0 ? formatNpr(total) : "To be confirmed")}
  ${row("Amount paid", formatNpr(paid))}
  ${row("Amount due at spa", total > 0 ? formatNpr(due) : "—")}
  ${row("Payment method", "Pay at Spa")}
  ${row("Payment status", booking.paymentStatus ?? "unpaid")}
  ${row("Booking status", booking.status)}
  </table>
  <p style="margin:16px 0 0;padding:12px;background:#fff7f0;border-left:4px solid #F47B20;font-size:13px;color:#141210"><strong>Payment is due at the spa.</strong> No online payment has been collected for this booking.</p>
  ${pdfLink ? `<p style="margin:12px 0 0;font-size:13px"><a href="${pdfLink}" style="color:#F47B20">Download your booking confirmation (secure link)</a></p>` : ""}
  <p style="margin:12px 0 0;font-size:12px;color:#8a8175"><a href="${policyUrl}" style="color:#F47B20">Cancellation &amp; rescheduling policy</a>${mapUrl ? ` · <a href="${mapUrl}" style="color:#F47B20">Directions</a>` : ""}</p>
  </td></tr>
  <tr><td style="padding:20px 32px 28px;background:#f6f1e8;font-size:12px;color:#6B6B6B;text-align:center">
  ${address}<br/>
  ${phone} · ${contactEmail}<br/>
  <a href="${spaPublicUrl()}" style="color:#F47B20">${spaPublicUrl()}</a>
  </td></tr>
  </table></td></tr></table></body></html>`;
}

export function buildAdminBookingNotificationHtml(booking: SpaBooking): string {
  const number = displayBookingNumber(booking);
  const total = bookingGrandTotalNpr(booking);
  const paid = bookingAmountPaidNpr(booking);
  const due = bookingAmountDueNpr(booking);
  const adminUrl = `${spaPublicUrl()}/admin`;
  const created = new Date(booking.createdAt).toLocaleString("en-NP", { timeZone: "Asia/Kathmandu" });

  return `<!DOCTYPE html><html><body style="font-family:Georgia,serif;color:#141210;padding:24px">
  <h1 style="color:#F47B20;font-size:20px">New spa booking — ${escapeHtml(number)}</h1>
  <p><strong>Status:</strong> ${escapeHtml(booking.status)} · <strong>Payment:</strong> ${escapeHtml(booking.paymentStatus ?? "unpaid")}</p>
  <table cellpadding="6" style="border-collapse:collapse;font-size:14px">
  <tr><td>Customer</td><td><strong>${escapeHtml(booking.name)}</strong></td></tr>
  <tr><td>Email</td><td>${escapeHtml(booking.email)}</td></tr>
  <tr><td>Phone</td><td>${escapeHtml(booking.phone)}</td></tr>
  <tr><td>Service</td><td>${escapeHtml(booking.serviceName || booking.packageName || "—")}</td></tr>
  <tr><td>When</td><td>${escapeHtml(`${booking.appointmentDate} ${booking.appointmentTime} · ${booking.durationMinutes} min · ${booking.guests ?? 1} guest(s)`)}</td></tr>
  <tr><td>Total</td><td>${total > 0 ? formatNpr(total) : "TBC"}</td></tr>
  <tr><td>Paid / due</td><td>${formatNpr(paid)} / ${total > 0 ? formatNpr(due) : "—"}</td></tr>
  <tr><td>Created</td><td>${created}</td></tr>
  ${booking.notes ? `<tr><td>Notes</td><td>${escapeHtml(booking.notes)}</td></tr>` : ""}
  </table>
  <p style="margin-top:20px"><a href="${adminUrl}" style="color:#F47B20">Open admin dashboard</a> (sign in required) and locate booking <strong>${escapeHtml(number)}</strong>.</p>
  </body></html>`;
}

export type SendBookingEmailResult = SmtpSendResult;

export async function sendCustomerBookingConfirmationEmail(booking: SpaBooking): Promise<SendBookingEmailResult> {
  const number = displayBookingNumber(booking);
  const pdfBytes = await generateBookingPdf(booking);
  const html = buildBookingConfirmationHtml(booking);
  const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  return sendSmtpMail({
    to: booking.email.trim().toLowerCase(),
    subject: `Booking Confirmation – Kaya Healing Spa | ${number}`,
    html,
    text: plain,
    attachments: [{ filename: bookingPdfFilename(booking), content: Buffer.from(pdfBytes) }],
  });
}

export async function sendAdminBookingNotificationEmail(booking: SpaBooking): Promise<SendBookingEmailResult> {
  const number = displayBookingNumber(booking);
  const recipient = bookingNotificationEmail();
  const pdfBytes = await generateBookingPdf(booking);
  const html = buildAdminBookingNotificationHtml(booking);

  return sendSmtpMail({
    to: recipient,
    subject: `New Spa Booking – ${number} – ${booking.name}`,
    html,
    text: html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    attachments: [{ filename: bookingPdfFilename(booking), content: Buffer.from(pdfBytes) }],
  });
}
