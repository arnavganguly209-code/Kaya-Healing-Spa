import { spawnSync } from "child_process";

const result = spawnSync("npx", ["--yes", "tsx", "scripts/booking-smtp-runtime-runner.ts"], {
  cwd: process.cwd(),
  shell: true,
  encoding: "utf8",
  env: { ...process.env, KAYA_SKIP_ENV_FILE_LOAD: "1" },
});

if (result.status !== 0) {
  console.error("booking-smtp-runtime-selftest: FAIL");
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  process.exit(1);
}
console.log(String(result.stdout || "").trim() || "booking-smtp-runtime-selftest: PASS");
