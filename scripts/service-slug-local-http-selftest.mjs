/**
 * Starts production server briefly and checks middleware 404 (local only).
 */
import { spawn, spawnSync } from "child_process";
import { setTimeout as delay } from "timers/promises";

const port = Number(process.env.VERIFY_LOCAL_PORT || 3099);
const base = `http://127.0.0.1:${port}`;
const curl = process.platform === "win32" ? "curl.exe" : "curl";

function httpStatus(path) {
  const result = spawnSync(
    curl,
    ["-sS", "-o", process.platform === "win32" ? "NUL" : "/dev/null", "-w", "%{http_code}", "--max-time", "15", `${base}${path}`],
    { encoding: "utf8" },
  );
  return Number(String(result.stdout).trim()) || 0;
}

const child = spawn("npm", ["run", "start", "--", "-p", String(port)], {
  cwd: process.cwd(),
  shell: true,
  stdio: "ignore",
  env: { ...process.env, PORT: String(port) },
});

let ready = false;
for (let i = 0; i < 40; i++) {
  await delay(500);
  const code = httpStatus("/services/deep-tissue-massage");
  if (code === 200) {
    ready = true;
    break;
  }
}

if (!ready) {
  child.kill("SIGTERM");
  console.error("service-slug-local-http-selftest: server did not become ready");
  process.exit(1);
}

const valid = httpStatus("/services/deep-tissue-massage");
const invalid = httpStatus("/services/not-a-real-slug-audit-xyz");
child.kill("SIGTERM");

console.log("service-slug-local-http-selftest: valid", valid, "invalid", invalid);
if (valid !== 200 || invalid !== 404) {
  console.error("service-slug-local-http-selftest: FAIL");
  process.exit(1);
}
console.log("service-slug-local-http-selftest: PASS");
