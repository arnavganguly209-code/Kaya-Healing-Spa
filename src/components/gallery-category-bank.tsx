"use client";

import { GALLERY_CATEGORIES, galleryCategoryLabel, newGalleryImage } from "@/lib/gallery-categories";
import type { GalleryImage } from "@/lib/types";
import { useMemo } from "react";

type Props = {
  gallery: GalleryImage[];
  setGallery: (next: GalleryImage[]) => void;
  publishGallery: (next: GalleryImage[]) => void;
  upload: (file: File, apply: (path: string) => void) => void;
  onPickLibrary?: (apply: (src: string) => void) => void;
};

function previewSrc(src: string) {
  return src?.startsWith("/uploads/") ? `/api/orbit/media/file?path=${encodeURIComponent(src)}` : src;
}

export function GalleryCategoryBank({ gallery, setGallery, publishGallery, upload, onPickLibrary }: Props) {
  const byCategory = useMemo(() => {
    const map = new Map<GalleryImage["category"], GalleryImage[]>();
    for (const cat of GALLERY_CATEGORIES) map.set(cat.id, []);
    for (const image of gallery) {
      const list = map.get(image.category) ?? [];
      list.push(image);
      map.set(image.category, list);
    }
    return map;
  }, [gallery]);

  function patchImage(id: string, patch: Partial<GalleryImage>) {
    const next = gallery.map((item) => (item.id === id ? { ...item, ...patch } : item));
    setGallery(next);
    if (patch.src?.startsWith("/uploads/")) publishGallery(next);
  }

  function removeImage(id: string) {
    publishGallery(gallery.filter((item) => item.id !== id));
  }

  function uploadToCategory(category: GalleryImage["category"], file: File) {
    upload(file, (src) => {
      publishGallery([...gallery, newGalleryImage(category, src)]);
    });
  }

  function addEmptySlot(category: GalleryImage["category"]) {
    setGallery([...gallery, newGalleryImage(category)]);
  }

  return (
    <div className="space-y-10">
      <p className="text-sm leading-relaxed text-[#6B6B6B]">
        Upload photos by category — the same filters shown on{" "}
        <span className="font-semibold text-[#141210]">/gallery</span>. Each category has its own upload button.
      </p>

      {GALLERY_CATEGORIES.map(({ id, label }) => {
        const items = byCategory.get(id) ?? [];
        const liveCount = items.filter((i) => i.src.startsWith("/uploads/")).length;

        return (
          <section key={id} className="rounded-2xl border border-[#efe8e0] bg-[#fffdfb] p-5 md:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-[#F47B20] uppercase">{id}</p>
                <h3 className="font-serif text-2xl text-[#141210]">{label}</h3>
                <p className="mt-1 text-sm text-[#8a8175]">
                  {liveCount} live photo{liveCount === 1 ? "" : "s"}
                  {items.length > liveCount ? ` · ${items.length - liveCount} draft slot(s)` : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center rounded-full bg-[#F47B20] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#e06d12]">
                  Upload to {label}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (file) uploadToCategory(id, file);
                    }}
                  />
                </label>
                <button
                  type="button"
                  className="rounded-full border border-[#efe8e0] bg-white px-4 py-2.5 text-sm font-semibold text-[#141210] hover:bg-[#f6f1e8]"
                  onClick={() => addEmptySlot(id)}
                >
                  Add slot
                </button>
              </div>
            </div>

            {items.length === 0 ? (
              <p className="mt-6 text-sm text-[#8a8175]">No photos in {galleryCategoryLabel(id)} yet. Use Upload above.</p>
            ) : (
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((image) => (
                  <li key={image.id} className="rounded-xl border border-[#efe8e0] bg-white p-4">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#f6f1e8]">
                      {image.src ? (
                        <img src={previewSrc(image.src)} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center px-4 text-center text-xs text-[#8a8175]">
                          Empty slot — upload or pick from library
                        </div>
                      )}
                    </div>
                    <label className="mt-3 block text-xs font-medium">
                      Alt text
                      <input
                        value={image.alt}
                        onChange={(e) => patchImage(image.id, { alt: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-[#efe8e0] px-3 py-2 text-sm"
                      />
                    </label>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <label className="inline-flex cursor-pointer rounded-full border border-[#efe8e0] px-3 py-1.5 text-xs font-semibold hover:bg-[#f6f1e8]">
                        Replace
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            e.target.value = "";
                            if (file) upload(file, (src) => patchImage(image.id, { src }));
                          }}
                        />
                      </label>
                      {onPickLibrary && (
                        <button
                          type="button"
                          className="rounded-full border border-[#efe8e0] px-3 py-1.5 text-xs font-semibold hover:bg-[#f6f1e8]"
                          onClick={() => onPickLibrary((src) => patchImage(image.id, { src }))}
                        >
                          Media library
                        </button>
                      )}
                      <button type="button" className="text-xs font-semibold text-red-700 underline" onClick={() => removeImage(image.id)}>
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
