const SEQUENTIAL_RE = /^KAYA(\d{5})$/;

function bookingPdfFilename(ref) {
  return `${ref}-Booking-Confirmation.pdf`;
}

let fail = 0;
if (bookingPdfFilename("KAYA02001") !== "KAYA02001-Booking-Confirmation.pdf") fail++;
if (!SEQUENTIAL_RE.test("KAYA02001")) fail++;

if (fail) {
  console.error("booking-pdf-filename-selftest: FAIL");
  process.exit(1);
}
console.log("booking-pdf-filename-selftest: OK");
