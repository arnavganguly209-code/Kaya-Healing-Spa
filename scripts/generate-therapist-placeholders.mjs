import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public/therapists");
mkdirSync(outDir, { recursive: true });

const therapists = [
  { slug: "anita-shrestha", initials: "AS", fill: "#f3e8dc" },
  { slug: "priya-gurung", initials: "PG", fill: "#efe6d8" },
  { slug: "sunita-rai", initials: "SR", fill: "#f0ebe3" },
  { slug: "maya-tamang", initials: "MT", fill: "#f5efe6" },
  { slug: "rebecca-limbu", initials: "RL", fill: "#ede4d6" },
  { slug: "karuna-bhandari", initials: "KB", fill: "#f2eadf" },
  { slug: "elina-magar", initials: "EM", fill: "#efe8dc" },
  { slug: "sangita-kc", initials: "SK", fill: "#f4ede4" },
  { slug: "nisha-pradhan", initials: "NP", fill: "#ebe3d5" },
  { slug: "devika-thapa", initials: "DT", fill: "#f0e9e0" },
];

for (const t of therapists) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000" role="img" aria-label="Therapist photo placeholder">
  <rect width="800" height="1000" fill="${t.fill}"/>
  <rect x="32" y="32" width="736" height="936" rx="8" fill="none" stroke="#F47B20" stroke-width="3" opacity="0.55"/>
  <circle cx="400" cy="360" r="108" fill="#e8dfd4"/>
  <text x="400" y="382" text-anchor="middle" font-family="system-ui,sans-serif" font-size="56" font-weight="600" fill="#8a8175">${t.initials}</text>
  <text x="400" y="560" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" letter-spacing="0.12em" fill="#6b635a">KAYA THERAPIST</text>
  <text x="400" y="600" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" fill="#9a9085">Upload photo in Orbit</text>
</svg>`;
  writeFileSync(path.join(outDir, `placeholder-${t.slug}.svg`), svg);
  console.log("Wrote", t.slug);
}
