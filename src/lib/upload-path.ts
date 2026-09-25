import { existsSync } from "fs";
import path from "path";

export function getUploadDir() {
  return path.join(process.cwd(), "public", "uploads");
}

/** Safe path for `/uploads/filename.ext` → absolute file path, or null if invalid. */
export function resolveUploadFile(uploadPath: string) {
  if (!uploadPath.startsWith("/uploads/")) return null;
  const name = uploadPath.slice("/uploads/".length).replace(/^\/+/, "");
  if (!name || name.includes("..") || name.includes("\\")) return null;
  const full = path.join(getUploadDir(), name);
  const dir = path.resolve(getUploadDir());
  const resolved = path.resolve(full);
  if (!resolved.startsWith(dir + path.sep) && resolved !== dir) return null;
  return resolved;
}

export function contentTypeForUpload(name: string) {
  const ext = path.extname(name).toLowerCase();
  const types: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
  };
  return types[ext] || "application/octet-stream";
}

export function uploadFileExists(uploadPath: string) {
  const full = resolveUploadFile(uploadPath);
  return full ? existsSync(full) : false;
}
