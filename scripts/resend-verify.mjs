/**
 * Verifies Resend API auth and lists domains (no secrets printed).
 * Run: RESEND_API_KEY=... node scripts/resend-verify.mjs
 */
const key = process.env.RESEND_API_KEY?.trim();
if (!key) {
  console.log("resend-verify: BLOCKED (RESEND_API_KEY not set)");
  process.exit(0);
}

const res = await fetch("https://api.resend.com/domains", {
  headers: { Authorization: `Bearer ${key}` },
});
if (!res.ok) {
  console.error("resend-verify: FAIL auth or API error", res.status);
  process.exit(1);
}
const body = await res.json();
const domains = Array.isArray(body.data) ? body.data : [];
const target = domains.find((d) => d.name === "kayahealingspa.com.np");
console.log("resend-verify: OK authenticated, domains:", domains.length);
if (target) {
  console.log("resend-verify: kayahealingspa.com.np status:", target.status || "unknown");
} else {
  console.log("resend-verify: WARN kayahealingspa.com.np not found in account");
}
