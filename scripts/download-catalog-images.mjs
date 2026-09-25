import { mkdirSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(root, "src/lib/catalog-images.ts");
const src = readFileSync(catalogPath, "utf8");

function parseBlock(name) {
  const re = new RegExp(`export const ${name}[\\s\\S]*?= \\{([\\s\\S]*?)\\};`);
  const m = src.match(re);
  if (!m) throw new Error(`Missing ${name}`);
  const out = {};
  for (const line of m[1].split("\n")) {
    let kv = line.match(/"([^"]+)":\s*"([^"]+)"/);
    if (kv) {
      out[kv[1]] = kv[2];
      continue;
    }
    kv = line.match(/^\s*(\w+):\s*"([^"]+)"/);
    if (kv) out[kv[1]] = kv[2];
  }
  return out;
}

const services = parseBlock("servicePhotoIds");
const packages = parseBlock("packagePhotoIds");

function url(id) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&h=1280&q=92`;
}

async function download(dest, photoId) {
  const res = await fetch(url(photoId), { redirect: "follow" });
  if (!res.ok) throw new Error(`${photoId} → ${res.status}`);
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  console.log("OK", path.basename(dest));
}

async function main() {
  const svcDir = path.join(root, "public/catalog/services");
  const pkgDir = path.join(root, "public/catalog/packages");
  mkdirSync(svcDir, { recursive: true });
  mkdirSync(pkgDir, { recursive: true });

  const errors = [];
  for (const [slug, id] of Object.entries(services)) {
    try {
      await download(path.join(svcDir, `${slug}.jpg`), id);
    } catch (e) {
      errors.push(`${slug}: ${e.message}`);
    }
  }
  for (const [slug, id] of Object.entries(packages)) {
    try {
      await download(path.join(pkgDir, `${slug}.jpg`), id);
    } catch (e) {
      errors.push(`${slug}: ${e.message}`);
    }
  }
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
