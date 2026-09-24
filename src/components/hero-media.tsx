"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export type HeroSlide = { src: string; alt: string };

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
  animation: "fade" | "slide" | "none";
  intervalMs: number;
  className?: string;
  objectPosition?: string;
  priority?: boolean;
  sizes: string;
}) {
  const images = slides.filter((slide) => slide.src).slice(0, 8);
  const still = display === "still" || animation === "none" || images.length <= 1;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (still) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, Math.min(20000, Math.max(2500, intervalMs || 6000)));
    return () => window.clearInterval(timer);
  }, [still, images.length, intervalMs]);

  const current = images[still ? 0 : index] ?? images[0];
  if (!current) return null;

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      {still ? (
        <Image src={current.src} alt={current.alt} fill priority={priority} className="object-cover" style={{ objectPosition }} sizes={sizes} />
      ) : (
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={`${current.src}-${index}`}
            className="absolute inset-0"
            initial={animation === "slide" ? { opacity: 0, x: 48 } : { opacity: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={animation === "slide" ? { opacity: 0, x: -48 } : { opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src={current.src} alt={current.alt} fill priority={priority && index === 0} className="object-cover" style={{ objectPosition }} sizes={sizes} />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
