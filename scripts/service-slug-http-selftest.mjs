/**
 * HTTP status checks for service detail routes (uses system curl + TLS verification).
 * Set VERIFY_BASE_URL to test production; defaults to local dev server URL if set.
 */
import { spawnSync } from "child_process";

const base = (process.env.VERIFY_BASE_URL || process.env.SPA_PUBLIC_URL || "https://kaya.theglobalorbit.com").replace(
  /\/$/,
  "",
);
const curl = process.platform === "win32" ? "curl.exe" : "curl";

function httpStatus(path) {
  const url = `${base}${path}`;
  const result = spawnSync(
    curl,
    ["-sS", "-o", process.platform === "win32" ? "NUL" : "/dev/null", "-w", "%{http_code}", "--max-time", "25", url],
    { encoding: "utf8" },
  );
  if (result.error) {
    console.error("service-slug-http-selftest: FAIL curl", result.error.message);
    process.exit(2);
  }
  const code = Number(String(result.stdout).trim()) || 0;
  return { url, code };
}

const valid = httpStatus("/services/deep-tissue-massage");
const invalid = httpStatus("/services/not-a-real-slug-audit-xyz");

console.log("service-slug-http-selftest: valid", valid.url, valid.code);
console.log("service-slug-http-selftest: invalid", invalid.url, invalid.code);

let fail = 0;
if (valid.code !== 200) fail++;
if (invalid.code !== 404) fail++;

if (fail) {
  console.error("service-slug-http-selftest: FAIL");
  process.exit(1);
}
console.log("service-slug-http-selftest: PASS");
process.exit(0);
