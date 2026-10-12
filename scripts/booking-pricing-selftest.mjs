function due(total, paid) {
  if (total <= 0) return 0;
  return Math.max(0, total - paid);
}

let fail = 0;
if (due(5000, 0) !== 5000) fail++;
if (due(5000, 2000) !== 3000) fail++;
if (due(5000, 5000) !== 0) fail++;
if (due(0, 0) !== 0) fail++;

if (fail) {
  console.error("booking-pricing-selftest: FAIL");
  process.exit(1);
}
console.log("booking-pricing-selftest: OK");
