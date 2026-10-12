/**
 * Isolated persist → mock SMTP → PDF attachment → idempotency.
 * Uses KAYA_DATA_DIR temp storage. Never writes production spa-bookings.json.
 */
import { mkdtempSync, rmSync } from "fs";
import os from "os";
import path from "path";

const tmp = mkdtempSync(path.join(os.tmpdir(), "kaya-booking-"));
process.env.KAYA_DATA_DIR = tmp;
process.env.KAYA_SKIP_ENV_FILE_LOAD = "1";
process.env.SMTP_MOCK = "1";
delete process.env.SMTP_MOCK_FAIL;
process.env.SMTP_HOST = "mail.globalorbitmail.cloud";
process.env.SMTP_PORT = "587";
process.env.SMTP_SECURE = "false";
process.env.SMTP_USER = "booking@kayahealingspa.com.np";
process.env.SMTP_PASSWORD = "mock-only-not-used";
process.env.SMTP_FROM_EMAIL = "booking@kayahealingspa.com.np";
process.env.BOOKING_NOTIFICATION_EMAIL = "staff-isolated@example.invalid";
process.env.BOOKING_PDF_SECRET = "isolated-pdf-secret";

function fail(message: string): never {
  throw new Error(message);
}

const bookingInput = {
  status: "confirmed" as const,
  name: "Journey Test Guest",
  email: "journey-test@example.invalid",
  phone: "+9779800000099",
  country: "Nepal",
  serviceSlug: "deep-tissue-massage",
  serviceName: "Deep Tissue Massage",
  durationMinutes: 60,
  priceNpr: 4500,
  priceConfirmed: true,
  appointmentDate: "2026-12-15",
  appointmentTime: "11:00",
  guests: 1,
  amountPaidNpr: 0,
  paymentStatus: "unpaid" as const,
  paymentMethod: "pay_at_spa",
  privacyAccepted: true,
  idempotencyKey: "idem-isolated-journey-1",
};

async function main(): Promise<void> {
  try {
    const { createBooking, findBookingById, readBookings } = await import("../src/lib/booking-store");
    const { deliverBookingConfirmation } = await import("../src/lib/booking-confirm");
    const { getMockSmtpSends, resetMockSmtpSends } = await import("../src/lib/smtp-mail");
    const { bookingPdfFilename } = await import("../src/lib/booking-pdf");

    resetMockSmtpSends();
    process.env.SMTP_MOCK_FAIL = "1";
    const first = createBooking(bookingInput);
    if (!first.created) fail("first booking should be created");
    const ref = first.booking.bookingNumber || first.booking.reference;
    if (!/^KAYA\d{5}$/.test(ref)) fail("invalid booking reference");

    const failedDelivery = await deliverBookingConfirmation(first.booking);
    if (failedDelivery.emailSent) fail("mock SMTP fail must not mark customer sent");
    const afterFail = findBookingById(first.booking.id);
    if (!afterFail) fail("booking missing after SMTP failure");
    if (afterFail.emailDelivery?.status === "sent") fail("customer status wrongly sent");
    if (readBookings().length !== 1) fail("SMTP failure created extra booking");

    delete process.env.SMTP_MOCK_FAIL;
    resetMockSmtpSends();
    const replay = createBooking(bookingInput);
    if (replay.created) fail("idempotent repeat must not create a second booking");
    if (replay.booking.id !== first.booking.id) fail("idempotent replay returned a different booking");
    if (readBookings().length !== 1) fail("duplicate booking on idempotent POST");

    const ok = await deliverBookingConfirmation(afterFail, {
      forceCustomer: true,
      forceAdmin: true,
      sendCustomer: true,
      sendAdmin: true,
    });
    if (!ok.emailSent || !ok.adminEmailSent) fail("retry after mock success should send both");

    const saved = findBookingById(first.booking.id);
    if (saved?.emailDelivery?.status !== "sent") fail("customer delivery not sent");
    if (saved?.adminEmailDelivery?.status !== "sent") fail("admin delivery not sent");
    if (saved?.emailDelivery?.recipient !== bookingInput.email) fail("customer recipient mismatch");
    if (saved?.adminEmailDelivery?.recipient !== "staff-isolated@example.invalid") fail("admin recipient mismatch");

    const sends = getMockSmtpSends();
    if (sends.length !== 2) fail(`expected 2 mock emails, got ${sends.length}`);
    const customer = sends.find((s) => s.to === bookingInput.email);
    const admin = sends.find((s) => s.to === "staff-isolated@example.invalid");
    if (!customer || !admin) fail("missing customer or admin mock send");
    if (!customer.subject.includes(ref)) fail("customer subject missing reference");
    if (!admin.subject.includes(ref)) fail("admin subject missing reference");
    if (!customer.html.includes(ref) || !customer.text) fail("customer HTML/text incomplete");

    const attachment = customer.attachments?.[0];
    if (!attachment) fail("customer PDF attachment missing");
    if (attachment.filename !== bookingPdfFilename(saved!)) fail("attachment filename mismatch");
    const header = Buffer.from(attachment.content.subarray(0, 5)).toString("ascii");
    if (header !== "%PDF-") fail("attachment is not a PDF");

    const customerOnly = await deliverBookingConfirmation(saved!, {
      sendCustomer: true,
      sendAdmin: false,
      forceCustomer: true,
      forceAdmin: false,
    });
    if (!customerOnly.emailSent) fail("customer-only retry failed");
    const afterCustomerOnly = findBookingById(first.booking.id);
    if (getMockSmtpSends().length !== 3) fail("customer-only retry must not also send admin");
    if (afterCustomerOnly?.adminEmailDelivery?.status !== "sent") fail("admin status lost on customer retry");

    console.log("booking-journey-isolated-runner: PASS", ref, "count", readBookings().length);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
