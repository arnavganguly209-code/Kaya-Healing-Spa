/**
 * Non-destructive backup sanity checks (run on VPS after deploy backup step).
 * Does not read JSON contents or print secrets.
 */
import { existsSync, readdirSync, statSync } from "fs";

const backupRoot = process.env.KAYA_BACKUP_ROOT || "/var/backups/kaya-healing-spa";
const dataDir = process.env.KAYA_DATA_DIR || "/var/www/kaya-healing-spa/data";

const critical = ["spa-bookings.json", "booking-sequence.json", "orbit-content.json"];

let fail = 0;

if (!existsSync(backupRoot)) {
  console.error("backup-metadata-check: FAIL missing", backupRoot);
  process.exit(1);
}

const dirs = readdirSync(backupRoot)
  .filter((n) => /^\d{8}T\d{6}Z$/.test(n))
  .map((n) => ({ n, mtime: statSync(`${backupRoot}/${n}`).mtimeMs }))
  .sort((a, b) => b.mtime - a.mtime);

if (!dirs.length) {
  console.error("backup-metadata-check: FAIL no timestamped backup dirs");
  fail++;
} else {
  const latest = `${backupRoot}/${dirs[0].n}`;
  for (const file of critical) {
    const p = `${latest}/${file}`;
    if (!existsSync(p)) {
      console.warn("backup-metadata-check: WARN latest backup missing", file);
    } else {
      const st = statSync(p);
      console.log("backup-metadata-check: OK", file, "size", st.size);
    }
  }
}

if (existsSync(dataDir)) {
  for (const file of critical) {
    const p = `${dataDir}/${file}`;
    if (existsSync(p)) {
      const st = statSync(p);
      console.log("backup-metadata-check: live", file, "size", st.size, "mtime", st.mtime.toISOString());
    }
  }
}

process.exit(fail ? 1 : 0);
