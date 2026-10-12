import { spawnSync } from "child_process";

const result = spawnSync("npx", ["--yes", "tsx", "scripts/booking-email-isolated-runner.ts"], {
  cwd: process.cwd(),
  shell: true,
  encoding: "utf8",
  env: {
    ...process.env,
    NODE_OPTIONS: [process.env.NODE_OPTIONS, "--use-system-ca"].filter(Boolean).join(" "),
  },
});

if (result.status !== 0) {
  console.error("booking-email-isolated-selftest: FAIL");
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  process.exit(1);
}
console.log(String(result.stdout || "").trim() || "booking-email-isolated-selftest: PASS");
