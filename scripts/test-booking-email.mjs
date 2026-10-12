/**
 * One-off booking email test (uses .env.local). Does not print secrets.
 */
import { loadEnvLocal } from "./load-env-local.mjs";
import { readFileSync, existsSync } from "fs";
import path from "path";

loadEnvLocal();

const key = process.env.RESEND_API_KEY?.trim();
if (!key) {
  console.error("test-booking-email: FAIL no RESEND_API_KEY");
  process.exit(1);
}

const to = process.env.BOOKING_TEST_EMAIL?.trim() || process.env.RESEND_FROM_EMAIL?.trim();
if (!to) {
  console.error("test-booking-email: FAIL no recipient");
  process.exit(1);
}

const logoPath = path.join(process.cwd(), "public", "brand", "kaya-logo-hd.png");
let attachment = null;
if (existsSync(logoPath)) {
  const { PDFDocument, StandardFonts } = await import("pdf-lib");
  const doc = await PDFDocument.create();
  const page = doc.addPage();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  page.drawText("Kaya Healing Spa — booking email test", { x: 50, y: 750, size: 14, font });
  page.drawText("KAYA02001 (sample)", { x: 50, y: 720, size: 12, font });
  const pdfBytes = await doc.save();
  attachment = {
    filename: "KAYA02001-Booking-Confirmation.pdf",
    content: Buffer.from(pdfBytes),
  };
}

const from = `Kaya Healing Spa <${process.env.RESEND_FROM_EMAIL || "booking@kayahealingspa.com.np"}>`;
const body = {
  from,
  to: [to],
  subject: "Booking Confirmed — KAYA02001 | Kaya Healing Spa (test)",
  html: "<p>Test booking confirmation from Kaya Healing Spa deploy check. If you received this, Resend is working.</p>",
};
if (attachment) body.attachments = [attachment];

const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

const json = await res.json().catch(() => ({}));
if (!res.ok) {
  console.error("test-booking-email: FAIL", res.status, json.message || json.name || "unknown");
  process.exit(1);
}
console.log("test-booking-email: PASS messageId=", json.id || "(none)");
