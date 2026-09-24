import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "fs";
import path from "path";

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
export const IMAGE_MAX = 25 * 1024 * 1024;
export const VIDEO_MAX = 120 * 1024 * 1024;

const uploadDir = path.join(process.cwd(), "public", "uploads");

export type MediaItem = {
  path: string;
  name: string;
  kind: "image" | "video";
  size: number;
};

export function isVideoName(name: string) {
  return /\.(mp4|webm|mov)$/i.test(name);
}

export function describeFile(file: File) {
  const type = file.type || "";
  const image = IMAGE_TYPES.includes(type) || /\.(jpe?g|png|webp|gif)$/i.test(file.name);
  const video = VIDEO_TYPES.includes(type) || isVideoName(file.name);
  return { image, video, kind: video ? "video" : image ? "image" : "" };
}

export function rejectUpload(file: File) {
  const { image, video } = describeFile(file);
  if (!image && !video) {
    return "Use a JPG, PNG, WebP, GIF, MP4, or WebM file.";
  }
  if (video && file.size > VIDEO_MAX) {
    return `This video is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 120 MB.`;
  }
  if (image && file.size > IMAGE_MAX) {
    return `This image is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 25 MB.`;
  }
  if (file.size <= 0) {
    return "That file is empty.";
  }
  return "";
}

export function extensionFor(file: File) {
  const type = file.type;
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  if (type === "video/webm") return "webm";
  if (type === "video/quicktime") return "mov";
  if (type === "video/mp4" || /\.mp4$/i.test(file.name)) return "mp4";
  if (/\.webp$/i.test(file.name)) return "webp";
  if (/\.png$/i.test(file.name)) return "png";
  if (/\.gif$/i.test(file.name)) return "gif";
  return "jpg";
}

export async function saveUpload(file: File) {
  const reason = rejectUpload(file);
  if (reason) throw new Error(reason);
  mkdirSync(uploadDir, { recursive: true });
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensionFor(file)}`;
  writeFileSync(path.join(uploadDir, name), Buffer.from(await file.arrayBuffer()));
  return { path: `/uploads/${name}`, kind: describeFile(file).kind as "image" | "video" };
}

export function listUploads(): MediaItem[] {
  if (!existsSync(uploadDir)) return [];
  return readdirSync(uploadDir)
    .filter((name) => !name.startsWith("."))
    .map((name) => {
      const full = path.join(uploadDir, name);
      const size = statSync(full).size;
      return {
        path: `/uploads/${name}`,
        name,
        kind: isVideoName(name) ? "video" : "image",
        size,
      };
    })
    .sort((a, b) => b.name.localeCompare(a.name));
}
