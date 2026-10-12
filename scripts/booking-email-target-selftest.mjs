function resolveTarget(raw) {
  const target = (raw || "both").toLowerCase();
  return {
    target,
    sendCustomer: target === "customer" || target === "both",
    sendAdmin: target === "admin" || target === "both",
  };
}

let fail = 0;
const c = resolveTarget("customer");
if (!c.sendCustomer || c.sendAdmin) fail++;
const a = resolveTarget("admin");
if (a.sendCustomer || !a.sendAdmin) fail++;
const b = resolveTarget("both");
if (!b.sendCustomer || !b.sendAdmin) fail++;

if (fail) {
  console.error("booking-email-target-selftest: FAIL");
  process.exit(1);
}
console.log("booking-email-target-selftest: OK");
