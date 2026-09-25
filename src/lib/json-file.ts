import { existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from "fs";
import path from "path";

export function readJsonFile<T>(filePath: string, fallback: () => T): T {
  if (!existsSync(filePath)) return fallback();
  try {
    const raw = readFileSync(filePath, "utf8");
    if (!raw.trim()) return fallback();
    return JSON.parse(raw) as T;
  } catch {
    return fallback();
  }
}

export function writeJsonFileAtomic(filePath: string, data: unknown) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  const tmp = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
  renameSync(tmp, filePath);
}

export function fileMtimeMs(filePath: string): number {
  try {
    return statSync(filePath).mtimeMs;
  } catch {
    return 0;
  }
}

export function dataFilePath(name: string) {
  return path.join(process.cwd(), "data", name);
}
