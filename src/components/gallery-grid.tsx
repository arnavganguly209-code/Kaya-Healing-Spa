"use client";

import { gallery } from "@/lib/content";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const filters = ["all", "spa", "treatments", "interiors", "wellness", "details"] as const;

export function GalleryGrid() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [active, setActive] = useState<number | null>(null);
  const images = useMemo(
    () => gallery.filter((image) => filter === "all" || image.category === filter),
    [filter],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") setActive((i) => (i === null ? i : (i + 1) % images.length));
      if (event.key === "ArrowLeft") setActive((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, images.length]);

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-14 md:px-8">
      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`px-3 py-2 text-xs tracking-[0.14em] uppercase ${
              filter === item ? "bg-[#141210] text-white" : "bg-[#f6f1e8]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      {images.length === 0 ? (
        <p className="mt-12 font-serif text-3xl">No photographs in this set yet.</p>
      ) : (
        <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className="img-zoom mb-4 block w-full break-inside-avoid text-left"
              onClick={() => setActive(index)}
            >
              <Image src={image.src} alt={image.alt} width={image.width} height={image.height} className="h-auto w-full" />
            </button>
          ))}
        </div>
      )}
      {active !== null && images[active] && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image"
          onTouchStart={(event) => {
            const start = event.changedTouches[0].clientX;
            event.currentTarget.dataset.x = String(start);
          }}
          onTouchEnd={(event) => {
            const start = Number(event.currentTarget.dataset.x ?? 0);
            const delta = event.changedTouches[0].clientX - start;
            if (delta < -40) setActive((i) => (i === null ? i : (i + 1) % images.length));
            if (delta > 40) setActive((i) => (i === null ? i : (i - 1 + images.length) % images.length));
          }}
        >
          <button type="button" className="absolute right-4 top-4 text-white" aria-label="Close" onClick={() => setActive(null)}>
            <X />
          </button>
          <button type="button" className="absolute left-4 text-white" aria-label="Previous" onClick={() => setActive((i) => (i === null ? i : (i - 1 + images.length) % images.length))}>
            <ChevronLeft />
          </button>
          <Image src={images[active].src} alt={images[active].alt} width={1400} height={900} className="max-h-[80svh] w-auto object-contain" />
          <button type="button" className="absolute right-4 text-white" aria-label="Next" onClick={() => setActive((i) => (i === null ? i : (i + 1) % images.length))}>
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
