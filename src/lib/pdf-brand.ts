import { PDFDocument } from "pdf-lib";
import { existsSync, readFileSync } from "fs";
import path from "path";
import { readOrbitContent } from "@/lib/orbit-store";
import { resolveUploadFile } from "@/lib/upload-path";

function resolvePublicAsset(src: string) {
  const trimmed = src.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/uploads/")) return resolveUploadFile(trimmed);
  if (trimmed.startsWith("/brand/")) {
    const name = trimmed.slice("/brand/".length).replace(/^\/+/, "");
    if (!name || name.includes("..")) return null;
    return path.join(process.cwd(), "public", "brand", name);
  }
  return null;
}

export async function embedBrandLogo(doc: PDFDocument) {
  let orbitLogo = "";
  try {
    orbitLogo = readOrbitContent().brandLogo?.trim() || "";
  } catch {
    orbitLogo = "";
  }
  const candidates = [
    resolvePublicAsset(orbitLogo),
    path.join(process.cwd(), "public", "brand", "kaya-logo-pdf.png"),
    path.join(process.cwd(), "public", "brand", "kaya-logo-hd.png"),
    path.join(process.cwd(), "public", "brand", "kaya-logo-192.png"),
  ].filter((file): file is string => Boolean(file));

  for (const file of candidates) {
    if (!existsSync(file)) continue;
    const bytes = readFileSync(file);
    try {
      if (file.toLowerCase().endsWith(".jpg") || file.toLowerCase().endsWith(".jpeg")) {
        return await doc.embedJpg(bytes);
      }
      return await doc.embedPng(bytes);
    } catch {
      /* try next */
    }
  }
  return null;
}
