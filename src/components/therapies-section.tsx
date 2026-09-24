"use client";

import type { OrbitTherapyCard } from "@/lib/orbit-store";
import { ChevronLeft, ChevronRight, Droplets, Flower2, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

function StonesIcon({ className = "text-[#F47B20]", size = 20 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <ellipse cx="12" cy="6" rx="5" ry="2.2" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="12" cy="12" rx="6.2" ry="2.4" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="12" cy="18" rx="7.2" ry="2.6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

const cardIcons = [Flower2, Droplets, Sparkles, StonesIcon];

function TherapySlideCard({
  card,
  iconIndex,
}: {
  card: OrbitTherapyCard;
  iconIndex: number;
}) {
  const Icon = cardIcons[iconIndex % cardIcons.length];
  const button = card.buttonLabel?.trim() || "Learn More";
  const unoptimized = card.image.startsWith("/uploads/");

  return (
    <article className="flex h-full w-[min(100%,280px)] shrink-0 snap-start flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_16px_48px_rgba(40,24,8,0.1)] sm:w-[300px] lg:w-[calc((100%-3rem)/4)] lg:min-w-[240px] lg:max-w-[300px]">
      <div className="relative h-[168px] sm:h-[180px]">
        <Image
          src={card.image}
          alt={card.alt}
          fill
          unoptimized={unoptimized}
          className="object-cover"
          sizes="(min-width: 1024px) 25vw, 280px"
        />
      </div>
      <div className="relative flex flex-1 flex-col px-5 pb-5 pt-6">
        <span className="absolute -top-6 left-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#f3d7c2] bg-white text-[#F47B20] shadow-[0_8px_20px_rgba(244,123,32,0.12)]">
          {Icon === StonesIcon ? <StonesIcon size={20} /> : <Icon size={20} strokeWidth={1.5} />}
        </span>
        <h3 className="font-serif text-[17px] font-semibold leading-snug text-[#1a1614]">{card.title}</h3>
        <p className="mt-2 flex-1 text-[13px] leading-[1.55] text-[#6d665e]">{card.text}</p>
        <Link
          href={card.href}
          className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#F47B20] px-5 py-2.5 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(244,123,32,0.28)] transition hover:bg-[#e06d12]"
        >
          {button} <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}

export function TherapiesSection({
  eyebrow,
  titleOrange,
  titleDark,
  intro,
  image,
  imageAlt,
  cards,
}: {
  eyebrow: string;
  titleOrange: string;
  titleDark: string;
  intro: string;
  image: string;
  imageAlt: string;
  cards: OrbitTherapyCard[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(cards.length > 4);

  const syncArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  const scrollBy = (direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("article");
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.85;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
    window.setTimeout(syncArrows, 350);
  };

  useEffect(() => {
    syncArrows();
    const el = trackRef.current;
    if (!el) return;
    const onResize = () => syncArrows();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [cards.length, syncArrows]);

  const sectionImageUnoptimized = image.startsWith("/uploads/");

  return (
    <section className="relative overflow-hidden bg-[#fffaf6] px-4 py-12 sm:px-6 lg:min-h-[100svh] lg:px-10 lg:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#fffaf6_22%,#fff8f3_100%)]" />
      <div className="pointer-events-none absolute -left-16 top-0 h-64 w-64 rounded-full bg-[#e8f5e6]/80 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-16 h-72 w-72 rounded-full bg-[#e8f5e6]/60 blur-3xl" />
      <Image
        src="/hero/kaya-leaves.png"
        alt=""
        aria-hidden
        width={480}
        height={480}
        className="pointer-events-none absolute -left-20 top-4 z-[1] hidden w-[min(42vw,360px)] opacity-95 lg:block"
      />
      <Image
        src="/hero/kaya-leaves.png"
        alt=""
        aria-hidden
        width={480}
        height={480}
        className="pointer-events-none absolute -bottom-16 -left-12 z-[1] hidden w-[min(38vw,320px)] -scale-x-100 opacity-90 lg:block"
      />
      <Image
        src="/hero/kaya-leaves.png"
        alt=""
        aria-hidden
        width={420}
        height={420}
        className="pointer-events-none absolute -right-24 bottom-0 z-[1] hidden w-[280px] rotate-180 opacity-85 lg:block"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1240px] flex-col justify-center lg:min-h-[calc(100svh-8rem)]">
        <div className="grid items-center gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-medium tracking-[0.28em] text-[#8d857c] uppercase">
              {eyebrow}
              <span className="h-px w-16 bg-[#F47B20]" />
            </p>
            <h2
              className="mt-4 text-[40px] leading-[0.95] font-semibold tracking-[-0.03em] sm:text-5xl lg:text-[56px]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              <span className="text-[#F47B20]">{titleOrange}</span>{" "}
              <span className="text-[#1a1614]">{titleDark}</span>
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#5c564f] sm:text-[15px]">{intro}</p>
          </div>
          <div className="relative h-48 overflow-hidden rounded-[24px] shadow-[0_20px_50px_rgba(40,24,8,0.08)] sm:h-56 lg:h-[240px]">
            <Image
              src={image}
              alt={imageAlt}
              fill
              unoptimized={sectionImageUnoptimized}
              className="object-cover"
              sizes="(min-width: 1024px) 46vw, 100vw"
            />
          </div>
        </div>

        <div className="relative z-10 mt-8 lg:-mt-10">
          <div className="flex items-center justify-end gap-2 pb-4 lg:absolute lg:-top-14 lg:right-0 lg:pb-0">
            <button
              type="button"
              aria-label="Previous treatments"
              disabled={!canPrev}
              onClick={() => scrollBy(-1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#efe8e0] bg-white text-[#171717] shadow-[0_8px_24px_rgba(23,23,23,0.08)] transition hover:border-[#F47B20] hover:text-[#F47B20] disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              aria-label="Next treatments"
              disabled={!canNext}
              onClick={() => scrollBy(1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#efe8e0] bg-white text-[#171717] shadow-[0_8px_24px_rgba(23,23,23,0.08)] transition hover:border-[#F47B20] hover:text-[#F47B20] disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          <div
            ref={trackRef}
            onScroll={syncArrows}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:gap-5 [&::-webkit-scrollbar]:hidden"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {cards.map((card, index) => (
              <TherapySlideCard key={`${card.title}-${index}`} card={card} iconIndex={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
