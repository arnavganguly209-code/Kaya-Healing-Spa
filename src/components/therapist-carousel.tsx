"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export function TherapistCarousel({
  children,
  ariaLabel = "Therapists",
  className = "mt-8",
}: {
  children: ReactNode;
  ariaLabel?: string;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < max - 8);
  }, []);

  useEffect(() => {
    updateButtons();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateButtons, { passive: true });
    const ro = new ResizeObserver(updateButtons);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      ro.disconnect();
    };
  }, [updateButtons, children]);

  function scrollByPage(direction: -1 | 1) {
    const el = trackRef.current;
    if (!el) return;
    const step = Math.max(260, Math.floor(el.clientWidth * 0.85));
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        aria-label={`Previous ${ariaLabel}`}
        disabled={!canPrev}
        onClick={() => scrollByPage(-1)}
        className="absolute left-0 top-[42%] z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#e6dfd4] bg-white text-[#171717] shadow-lg transition hover:border-[#F47B20] hover:text-[#F47B20] disabled:pointer-events-none disabled:opacity-30 sm:h-12 sm:w-12"
      >
        <ChevronLeft size={22} strokeWidth={2.2} />
      </button>
      <button
        type="button"
        aria-label={`Next ${ariaLabel}`}
        disabled={!canNext}
        onClick={() => scrollByPage(1)}
        className="absolute right-0 top-[42%] z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#e6dfd4] bg-white text-[#171717] shadow-lg transition hover:border-[#F47B20] hover:text-[#F47B20] disabled:pointer-events-none disabled:opacity-30 sm:h-12 sm:w-12"
      >
        <ChevronRight size={22} strokeWidth={2.2} />
      </button>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-12 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 sm:px-14 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </div>
  );
}
