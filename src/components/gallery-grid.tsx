"use client";

import type { GalleryImage } from "@/lib/types";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

function unoptimizedSrc(src: string) {
  return src.startsWith("/uploads/") || src.startsWith("/hero/");
}

export function GalleryGrid({ items }: { items: GalleryImage[] }) {
  const categories = useMemo(() => {
    const set = new Set(items.map((image) => image.category));
    return ["all", ...Array.from(set)] as const;
  }, [items]);

  const [filter, setFilter] = useState<string>("all");
  const [active, setActive] = useState<number | null>(null);
  const images = useMemo(
    () => items.filter((image) => filter === "all" || image.category === filter),
    [filter, items],
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
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-full px-4 py-2 text-xs font-bold tracking-[0.14em] uppercase ${
              filter === item ? "bg-[#F47B20] text-white" : "border border-[#e6dfd4] bg-white"
            }`}
          >
            {item === "all" ? "All" : item.replace(/-/g, " ")}
          </button>
        ))}
      </div>
      {images.length === 0 ? (
        <p className="mt-12 max-w-xl text-sm leading-7 text-[#6B6B6B]">
          Gallery photos will appear here after fresh uploads from Orbit. Until then, this page stays empty on purpose.
        </p>
      ) : (
        <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className="img-zoom mb-4 block w-full break-inside-avoid text-left"
              onClick={() => setActive(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className="h-auto w-full"
                unoptimized={unoptimizedSrc(image.src)}
              />
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
          <Image
            src={images[active].src}
            alt={images[active].alt}
            width={1400}
            height={900}
            className="max-h-[80svh] w-auto object-contain"
            unoptimized={unoptimizedSrc(images[active].src)}
          />
          <button type="button" className="absolute right-4 text-white" aria-label="Next" onClick={() => setActive((i) => (i === null ? i : (i + 1) % images.length))}>
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
