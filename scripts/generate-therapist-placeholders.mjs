import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public/therapists");
mkdirSync(outDir, { recursive: true });

/** Single flat cream + orange accent — no portraits; replace via Orbit / Admin upload. */
const therapists = [
  "anita-shrestha",
  "priya-gurung",
  "sunita-rai",
  "maya-tamang",
  "rebecca-limbu",
  "karuna-bhandari",
  "elina-magar",
  "sangita-kc",
  "nisha-pradhan",
  "devika-thapa",
];

for (const slug of therapists) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000" role="img" aria-label="Therapist photo placeholder">
  <rect width="800" height="1000" fill="#f6f1e8"/>
  <rect x="0" y="920" width="800" height="80" fill="#F47B20" opacity="0.35"/>
  <rect x="48" y="48" width="704" height="904" rx="12" fill="none" stroke="#F47B20" stroke-width="2" opacity="0.25"/>
</svg>`;
  writeFileSync(path.join(outDir, `placeholder-${slug}.svg`), svg);
  console.log("Wrote", slug);
}
