/**
 * Live domain checks (no secrets). Verifies demo + .np hostnames serve Kaya.
 */
import { promises as dns } from "dns";
import https from "https";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const HOSTS = [
  "https://kaya.theglobalorbit.com",
  "https://kayahealingspa.com.np",
  "https://www.kayahealingspa.com.np",
];

async function resolve4(host) {
  try {
    return { ok: true, addresses: await dns.resolve4(host) };
  } catch (e) {
    return { ok: false, code: e.code || "ERROR" };
  }
}

function fetchText(url, timeoutMs = 20000) {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: timeoutMs }, (res) => {
      let body = "";
      res.on("data", (c) => {
        body += c;
        if (body.length > 500_000) req.destroy();
      });
      res.on("end", () => resolve({ status: res.statusCode || 0, body }));
    });
    req.on("error", (e) => resolve({ status: 0, error: e.message }));
    req.on("timeout", () => {
      req.destroy();
      resolve({ status: 0, error: "timeout" });
    });
  });
}

const primary = await resolve4("kaya.theglobalorbit.com");
const apex = await resolve4("kayahealingspa.com.np");
const www = await resolve4("www.kayahealingspa.com.np");

console.log(
  "verify-domains: origin A",
  primary.ok ? primary.addresses.join(",") : primary.code,
);
console.log(
  "verify-domains: apex A",
  apex.ok ? apex.addresses.join(",") : apex.code,
  apex.ok && primary.ok && !apex.addresses.includes(primary.addresses[0])
    ? "(Cloudflare proxy or different A — OK if HTTPS serves Kaya)"
    : "",
);
console.log("verify-domains: www A", www.ok ? www.addresses.join(",") : www.code);

let failed = 0;
for (const base of HOSTS) {
  const home = await fetchText(`${base}/`);
  const ok =
    home.status === 200 &&
    /Kaya Healing Spa/i.test(home.body || "") &&
    !/Ambition Holiday/i.test(home.body || "");
  console.log(`verify-domains: ${base}/ HTTP ${home.status} kaya=${ok ? "yes" : "no"}`);
  if (!ok) failed += 1;

  const about = await fetchText(`${base}/about`);
  const aboutOk = about.status === 200 && /Brand values/i.test(about.body || "");
  console.log(`verify-domains: ${base}/about HTTP ${about.status} content=${aboutOk ? "ok" : "bad"}`);
  if (!aboutOk) failed += 1;
}

if (!primary.ok) {
  console.log("verify-domains: FAIL could not resolve demo origin");
  process.exit(2);
}
if (failed) {
  console.log("verify-domains: FAIL", failed, "check(s)");
  process.exit(1);
}
console.log("verify-domains: PASS");
process.exit(0);
