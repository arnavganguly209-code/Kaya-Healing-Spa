import { PDFDocument, StandardFonts } from "pdf-lib";

const doc = await PDFDocument.create();
const page = doc.addPage();
const font = await doc.embedFont(StandardFonts.Helvetica);
page.drawText("Kaya Healing Spa PDF self-test", { x: 50, y: 750, size: 14, font });
const bytes = await doc.save();
const header = Buffer.from(bytes.subarray(0, 5)).toString("ascii");
if (header !== "%PDF-") {
  console.error("FAIL: invalid PDF header", header);
  process.exit(1);
}
console.log("booking-pdf-selftest: OK", bytes.length, "bytes");
