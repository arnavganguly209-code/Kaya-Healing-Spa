/**
 * Verifies Resend API auth and lists domains (no secrets printed).
 */
import { loadEnvLocal } from "./load-env-local.mjs";

loadEnvLocal();
const key = process.env.RESEND_API_KEY?.trim();
if (!key) {
  console.log("resend-verify: BLOCKED (RESEND_API_KEY not set)");
  process.exit(0);
}

const from = process.env.RESEND_FROM_EMAIL?.trim() || "booking@kayahealingspa.com.np";
const probe = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: `Kaya Healing Spa <${from}>`,
    to: [from],
    subject: "Resend auth probe (no delivery expected if blocked)",
    html: "<p>Configuration probe — ignore if received during go-live check.</p>",
  }),
});

if (probe.ok) {
  const sent = await probe.json();
  console.log("resend-verify: PASS send API accepted, id:", sent.id || "n/a");
} else {
  const err = await probe.json().catch(() => ({}));
  const msg = err.message || err.name || probe.status;
  if (probe.status === 401 || probe.status === 403) {
    console.error("resend-verify: FAIL auth", probe.status);
    process.exit(1);
  }
  console.log("resend-verify: WARN send rejected (check domain/sender):", msg);
}

const domainsRes = await fetch("https://api.resend.com/domains", {
  headers: { Authorization: `Bearer ${key}` },
});
if (domainsRes.ok) {
  const body = await domainsRes.json();
  const domains = Array.isArray(body.data) ? body.data : [];
  const target = domains.find((d) => d.name === "kayahealingspa.com.np");
  if (target) console.log("resend-verify: domain kayahealingspa.com.np status:", target.status || "unknown");
  else console.log("resend-verify: WARN domain kayahealingspa.com.np not listed");
} else {
  console.log("resend-verify: WARN domains API", domainsRes.status, "(send test is authoritative)");
}
