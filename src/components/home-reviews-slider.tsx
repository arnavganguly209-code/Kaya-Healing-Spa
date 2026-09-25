"use client";

import type { OrbitHomeReview } from "@/lib/orbit-store";
import { site } from "@/lib/content";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function GoogleMark() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={16} className={i < rating ? "fill-[#FBBC04] text-[#FBBC04]" : "text-[#e6dfd4]"} strokeWidth={1.5} />
      ))}
    </div>
  );
}

export function HomeReviewsSlider({
  eyebrow,
  title,
  disclaimer,
  reviews,
  googleUrl,
}: {
  eyebrow: string;
  title: string;
  disclaimer: string;
  reviews: OrbitHomeReview[];
  googleUrl: string;
}) {
  const [index, setIndex] = useState(0);
  const count = reviews.length;

  useEffect(() => {
    if (count <= 1) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), 7000);
    return () => window.clearInterval(timer);
  }, [count]);

  if (!count) return null;

  const review = reviews[index];

  return (
    <section className="bg-[#f6f1e8]">
      <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="display mt-3 text-5xl">{title}</h2>
          </div>
          <Link href="/contact#reviews" className="btn-line">
            Read more reviews
          </Link>
        </div>
        <p className="mt-4 max-w-2xl text-sm text-[#6d665e]">{disclaimer}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold text-[#141210] shadow-sm">
            <GoogleMark />
            {site.googleRating} ★ · {site.googleReviewCount.toLocaleString()} on Google
          </span>
          {googleUrl.startsWith("https://") ? (
            <a href={googleUrl} target="_blank" rel="noreferrer" className="btn-line">
              Open Google reviews
            </a>
          ) : null}
        </div>

        <div className="relative mt-12 overflow-hidden rounded-[1.75rem] border border-[#e6dfd4] bg-white shadow-[0_24px_60px_rgba(20,18,16,0.08)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#4285F4] via-[#FBBC04] to-[#34A853]" />
          <div className="grid gap-8 p-8 md:grid-cols-[1fr_auto] md:p-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="min-h-[200px]">
              <div className="flex flex-wrap items-center gap-3">
                <GoogleMark />
                <Stars rating={review.rating} />
                <span className="text-xs font-semibold tracking-wide text-[#8a8175] uppercase">{review.dateLabel}</span>
              </div>
              <blockquote className="mt-6 font-serif text-2xl leading-snug text-[#141210] md:text-[1.65rem]">
                “{review.text}”
              </blockquote>
              <p className="mt-6 text-sm font-semibold text-[#141210]">{review.name}</p>
            </div>
            <div className="flex flex-col justify-between gap-6 border-t border-[#efe8e0] pt-6 md:border-t-0 md:border-l md:pl-8 md:pt-0">
              <p className="text-xs leading-relaxed text-[#8a8175]">
                Swipe or use arrows to browse guest stories. Edit every quote and name in Orbit → Home page or Admin → Reviews.
              </p>
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  aria-label="Previous review"
                  onClick={() => setIndex((i) => (i - 1 + count) % count)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e6dfd4] bg-[#fffcf8] text-[#141210] transition hover:border-[#F47B20] hover:text-[#F47B20]"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex gap-2">
                  {reviews.map((r, i) => (
                    <button
                      key={r.id}
                      type="button"
                      aria-label={`Show review ${i + 1}`}
                      onClick={() => setIndex(i)}
                      className={`h-2.5 rounded-full transition-all ${i === index ? "w-8 bg-[#F47B20]" : "w-2.5 bg-[#dccfc4]"}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  aria-label="Next review"
                  onClick={() => setIndex((i) => (i + 1) % count)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e6dfd4] bg-[#fffcf8] text-[#141210] transition hover:border-[#F47B20] hover:text-[#F47B20]"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
