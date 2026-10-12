/**
 * Ensures generated route slug manifest matches catalog sources (no HTTP).
 */
import { readFileSync } from "fs";
import path from "path";
import { spawnSync } from "child_process";

const root = process.cwd();
spawnSync("node", ["scripts/write-route-slug-manifest.mjs"], { cwd: root, stdio: "inherit" });

const manifestPath = path.join(root, "src", "lib", "route-slugs.ts");
const manifest = readFileSync(manifestPath, "utf8");

function extractSet(name) {
  const re = new RegExp(`export const ${name} = new Set\\(\\[([\\s\\S]*?)\\]\\);`);
  const m = manifest.match(re);
  if (!m) throw new Error(`missing ${name} in route-slugs.ts`);
  const slugs = [];
  const itemRe = /"([^"]+)"/g;
  let item;
  while ((item = itemRe.exec(m[1]))) slugs.push(item[1]);
  return new Set(slugs);
}

const services = extractSet("knownServiceSlugs");
const packages = extractSet("knownPackageSlugs");

let fail = 0;
if (!services.has("deep-tissue-massage")) {
  console.error("route-slug-manifest-selftest: missing deep-tissue-massage");
  fail++;
}
if (services.has("not-a-real-slug-audit-xyz")) {
  console.error("route-slug-manifest-selftest: bogus slug present");
  fail++;
}
if (packages.size < 1) {
  console.error("route-slug-manifest-selftest: no package slugs");
  fail++;
}

if (fail) {
  console.error("route-slug-manifest-selftest: FAIL");
  process.exit(1);
}
console.log(
  "route-slug-manifest-selftest: PASS",
  services.size,
  "services,",
  packages.size,
  "packages",
);
