import { dataFilePath } from "@/lib/json-file";
import { closeSync, openSync, unlinkSync } from "fs";

const LOCK_MAX_ATTEMPTS = 60;
const LOCK_SLEEP_MS = 25;

function sleepMs(ms: number) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    /* busy wait — short critical sections only */
  }
}

/** Exclusive lock for JSON booking files (single-node VPS). */
export function withDataFileLock<T>(name: string, fn: () => T): T {
  const lockPath = dataFilePath(`${name}.lock`);
  let acquired = false;
  for (let attempt = 0; attempt < LOCK_MAX_ATTEMPTS; attempt++) {
    try {
      const fd = openSync(lockPath, "wx");
      closeSync(fd);
      acquired = true;
      break;
    } catch {
      sleepMs(LOCK_SLEEP_MS);
    }
  }
  if (!acquired) {
    throw new Error(`Could not acquire data lock: ${name}`);
  }
  try {
    return fn();
  } finally {
    try {
      unlinkSync(lockPath);
    } catch {
      /* stale lock cleaned on next boot if needed */
    }
  }
}
