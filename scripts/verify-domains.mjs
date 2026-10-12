/**
 * Live domain checks (no secrets). Uses system curl with default TLS verification.
 */
import { spawnSync } from "child_process";
import { promises as dns } from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const HOSTS = [
  "https://kaya.theglobalorbit.com",
  "https://kayahealingspa.com.np",
  "https://www.kayahealingspa.com.np",
];

const curl = process.platform === "win32" ? "curl.exe" : "curl";
const nullDevice = process.platform === "win32" ? "NUL" : "/dev/null";

function curlFetch(url) {
  const bodyResult = spawnSync(curl, ["-sS", "--max-time", "25", url], {
    encoding: "utf8",
    maxBuffer: 2_000_000,
  });
  const statusResult = spawnSync(
    curl,
    ["-sS", "-o", nullDevice, "-w", "%{http_code}", "--max-time", "25", url],
    { encoding: "utf8" },
  );
  if (bodyResult.error || statusResult.error) {
    return { status: 0, body: "", error: bodyResult.error?.message || statusResult.error?.message };
  }
  return { status: Number(String(statusResult.stdout).trim()) || 0, body: bodyResult.stdout || "" };
}

async function resolve4(host) {
  try {
    return { ok: true, addresses: await dns.resolve4(host) };
  } catch (e) {
    return { ok: false, code: e.code || "ERROR" };
  }
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
    ? "(Cloudflare proxy — OK if HTTPS serves Kaya)"
    : "",
);
console.log("verify-domains: www A", www.ok ? www.addresses.join(",") : www.code);

let failed = 0;
for (const base of HOSTS) {
  const home = curlFetch(`${base}/`);
  const ok =
    home.status === 200 &&
    /Kaya Healing Spa/i.test(home.body || "") &&
    !/Ambition Holiday/i.test(home.body || "");
  console.log(`verify-domains: ${base}/ HTTP ${home.status} kaya=${ok ? "yes" : "no"}${home.error ? ` err=${home.error}` : ""}`);
  if (!ok) failed += 1;

  const about = curlFetch(`${base}/about`);
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
