import type { GalleryImage } from "@/lib/types";

export const GALLERY_CATEGORIES: { id: GalleryImage["category"]; label: string }[] = [
  { id: "spa", label: "Spa" },
  { id: "treatments", label: "Treatments" },
  { id: "interiors", label: "Interiors" },
  { id: "wellness", label: "Wellness" },
  { id: "details", label: "Details" },
];

export function galleryCategoryLabel(id: string) {
  return GALLERY_CATEGORIES.find((c) => c.id === id)?.label ?? id.replace(/-/g, " ");
}

export function newGalleryImage(category: GalleryImage["category"], src = ""): GalleryImage {
  return {
    id: `g-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    src,
    alt: "Kaya Healing Spa",
    category,
    width: 1200,
    height: 1600,
  };
}
