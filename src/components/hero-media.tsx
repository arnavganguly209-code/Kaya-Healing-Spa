"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export type HeroSlide = { src: string; alt: string; kind?: "image" | "video" };

function isVideo(slide: HeroSlide) {
  return slide.kind === "video" || /\.(mp4|webm|mov)$/i.test(slide.src);
}

function SlideVisual({
  slide,
  objectPosition,
  priority,
  sizes,
}: {
  slide: HeroSlide;
  objectPosition: string;
  priority?: boolean;
  sizes: string;
}) {
  if (isVideo(slide)) {
    return <video key={slide.src} src={slide.src} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition }} autoPlay muted loop playsInline />;
  }
  return (
    <Image
      key={slide.src}
      src={slide.src}
      alt={slide.alt}
      fill
      priority={priority}
      unoptimized={slide.src.startsWith("/uploads/")}
      className="object-cover"
      style={{ objectPosition }}
      sizes={sizes}
    />
  );
}

export function HeroMedia({
  slides,
  display,
  animation,
  intervalMs,
  className,
  objectPosition = "72% center",
  priority = false,
  sizes,
}: {
  slides: HeroSlide[];
  display: "still" | "slider";
  animation: "fade" | "none";
  intervalMs: number;
  className?: string;
  objectPosition?: string;
  priority?: boolean;
  sizes: string;
}) {
  const items = slides.filter((slide) => slide.src).slice(0, 10);
  const still = display === "still" || animation === "none" || items.length <= 1;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [items.map((item) => item.src).join("|"), still]);

  useEffect(() => {
    if (still) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, Math.min(20000, Math.max(2500, intervalMs || 6000)));
    return () => window.clearInterval(timer);
  }, [still, items.length, intervalMs]);

  const current = items[still ? 0 : index] ?? items[0];
  if (!current) return null;

  return (
    <div className={`overflow-hidden ${className ?? "relative"}`}>
      {still ? (
        <SlideVisual slide={current} objectPosition={objectPosition} priority={priority} sizes={sizes} />
      ) : (
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={`${current.src}-${index}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <SlideVisual slide={current} objectPosition={objectPosition} priority={priority && index === 0} sizes={sizes} />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
