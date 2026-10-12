import { readFileSync } from "fs";
import path from "path";

const SEQUENTIAL_RE = /^KAYA(\d{5})$/;

function parse(value) {
  const m = String(value || "").trim().match(SEQUENTIAL_RE);
  return m ? Number(m[1]) : null;
}

function format(n) {
  return `KAYA${String(n).padStart(5, "0")}`;
}

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    failed++;
  }
}

assert(parse("KAYA02001") === 2001, "parse 02001");
assert(format(2001) === "KAYA02001", "format 2001");
assert(format(2002) === "KAYA02002", "format 2002");
assert(parse("KAYA-abc") === null, "legacy ref not sequential");

function maxFromBookings(bookings, floor = 2000) {
  let max = floor;
  for (const b of bookings) {
    const n = parse(b.bookingNumber || b.reference);
    if (n != null && n > max) max = n;
  }
  return max;
}
assert(maxFromBookings([{ reference: "KAYA02005" }]) === 2005, "preserve existing max");
assert(maxFromBookings([]) + 1 === 2001, "fresh sequence next is 2001");

const seqPath = path.join(process.cwd(), "data", "booking-sequence.json");
try {
  const state = JSON.parse(readFileSync(seqPath, "utf8"));
  assert(state.lastAssigned >= 2000, "sequence floor");
} catch {
  /* no file yet is ok */
}

if (failed) process.exit(1);
console.log("booking-number-selftest: OK");
