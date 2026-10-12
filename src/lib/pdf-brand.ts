import { PDFDocument } from "pdf-lib";
import { existsSync, readFileSync } from "fs";
import path from "path";

export async function embedBrandLogo(doc: PDFDocument) {
  const candidates = [
    path.join(process.cwd(), "public", "brand", "kaya-logo-hd.png"),
    path.join(process.cwd(), "public", "brand", "kaya-logo-192.png"),
  ];
  for (const file of candidates) {
    if (!existsSync(file)) continue;
    const bytes = readFileSync(file);
    try {
      return await doc.embedPng(bytes);
    } catch {
      /* try next */
    }
  }
  return null;
}
