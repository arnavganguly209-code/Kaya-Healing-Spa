import type { Service, SpaPackage } from "@/lib/types";

export function slugifyCategory(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function updateServiceCategorySlug(categories: string[], services: Service[], index: number, nextSlug: string) {
  const prev = categories[index];
  const slug = slugifyCategory(nextSlug) || prev || "massage";
  const nextCategories = categories.map((c, i) => (i === index ? slug : c));
  const nextServices = services.map((s) =>
    s.category === prev ? { ...s, category: slug as Service["category"] } : s,
  );
  return { categories: nextCategories, services: nextServices };
}

export function removeServiceCategoryAt(categories: string[], services: Service[], index: number, moveTo: string) {
  const removed = categories[index];
  const target = slugifyCategory(moveTo) || categories.find((_, i) => i !== index) || "massage";
  const nextCategories = categories.filter((_, i) => i !== index);
  const nextServices = services.map((s) =>
    s.category === removed ? { ...s, category: target as Service["category"] } : s,
  );
  return { categories: nextCategories, services: nextServices };
}

export function updatePackageCategorySlug(categories: string[], packages: SpaPackage[], index: number, nextSlug: string) {
  const prev = categories[index];
  const slug = slugifyCategory(nextSlug) || prev || "wellness";
  const nextCategories = categories.map((c, i) => (i === index ? slug : c));
  const nextPackages = packages.map((p) => (p.category === prev ? { ...p, category: slug } : p));
  return { packageCategories: nextCategories, packages: nextPackages };
}

export function removePackageCategoryAt(categories: string[], packages: SpaPackage[], index: number, moveTo: string) {
  const removed = categories[index];
  const target = slugifyCategory(moveTo) || categories.find((_, i) => i !== index) || "wellness";
  const nextCategories = categories.filter((_, i) => i !== index);
  const nextPackages = packages.map((p) => (p.category === removed ? { ...p, category: target } : p));
  return { packageCategories: nextCategories, packages: nextPackages };
}
