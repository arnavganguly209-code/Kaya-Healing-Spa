/**
 * DNS diagnosis (no secrets). Compares .np domain to working globalorbit host.
 */
import { promises as dns } from "dns";

const PRIMARY = "kaya.theglobalorbit.com";
const TARGET = "kayahealingspa.com.np";
const WWW = `www.${TARGET}`;

async function resolve4(host) {
  try {
    return { host, ok: true, addresses: await dns.resolve4(host) };
  } catch (e) {
    return { host, ok: false, code: e.code || "ERROR" };
  }
}

async function resolveNs(host) {
  try {
    return await dns.resolveNs(host);
  } catch {
    return [];
  }
}

const primary = await resolve4(PRIMARY);
const target = await resolve4(TARGET);
const www = await resolve4(WWW);
const ns = await resolveNs(TARGET);

console.log("dns-diagnose: primary", PRIMARY, primary.ok ? primary.addresses.join(",") : primary.code);
console.log("dns-diagnose: target", TARGET, target.ok ? target.addresses.join(",") : target.code);
console.log("dns-diagnose: www", WWW, www.ok ? www.addresses.join(",") : www.code);
if (ns.length) console.log("dns-diagnose: nameservers", ns.join(", "));

if (!primary.ok) {
  console.log("dns-diagnose: BLOCKED could not resolve", PRIMARY, primary.code);
  process.exit(2);
}

if (primary.ok && !target.ok) {
  console.log(
    "dns-diagnose: ACTION in Cloudflare (or DNS host): add A record",
    TARGET,
    "and",
    WWW,
    "→",
    primary.addresses[0],
    "(same as",
    PRIMARY + ")",
  );
  process.exit(1);
}
if (primary.ok && target.ok && primary.addresses[0] !== target.addresses[0]) {
  console.log("dns-diagnose: WARN target IP differs from primary");
  process.exit(1);
}
console.log("dns-diagnose: OK");
process.exit(0);
