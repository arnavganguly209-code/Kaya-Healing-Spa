import { Breadcrumbs } from "@/components/breadcrumbs";
import type { ReactNode } from "react";

export type ArtCoverProps = {
  eyebrow?: string;
  title: string;
  tagline?: string;
  text?: string;
  crumbs: { label: string; href?: string }[];
  children?: ReactNode;
};

/** Shared spa banner: lotus pattern, no photograph — used on all inner page covers. */
export function PageCoverArt({ eyebrow, title, tagline, text, crumbs, children }: ArtCoverProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#1e4634] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-100"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 55%), linear-gradient(180deg, #255a42 0%, #1e4634 48%, #183528 100%)",
        }}
      />
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-[#7cb896]"
        aria-hidden
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="kaya-lotus-tile" width="120" height="120" patternUnits="userSpaceOnUse">
            <path
              d="M60 18c-8 14-8 28 0 42 8-14 8-28 0-42zm-22 32c10 8 22 8 32 0-10 8-22 8-32 0zm44 0c10 8 22 8 32 0-10 8-22 8-32 0zM60 78c-6 10-6 20 0 30 6-10 6-20 0-30z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              opacity="0.35"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kaya-lotus-tile)" opacity="0.55" />
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(244,123,32,0.12),transparent_55%)]" />

      <div className="relative mx-auto flex min-h-[min(48svh,440px)] max-w-[900px] flex-col items-center justify-center px-5 py-20 text-center md:min-h-[min(52svh,480px)] md:px-8 md:py-24">
        {eyebrow ? (
          <p className="text-[11px] font-semibold tracking-[0.28em] text-[#f5c9a8] uppercase">{eyebrow}</p>
        ) : null}
        <h1 className="display mt-3 text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[1.08] text-white">{title}</h1>
        {tagline ? (
          <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-white/90 md:text-xl">{tagline}</p>
        ) : null}
        {text ? <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 md:text-[15px]">{text}</p> : null}
        {children}
        <div className="mt-10 flex justify-center text-white/85 [&_a]:text-white/85 [&_a:hover]:text-[#f5c9a8]">
          <Breadcrumbs items={crumbs} />
        </div>
      </div>

      <div className="relative h-10 w-full text-[#fffcf8]" aria-hidden>
        <svg className="absolute bottom-0 left-0 h-full w-full" viewBox="0 0 1440 48" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,32 C240,8 480,48 720,28 C960,8 1200,40 1440,20 L1440,48 L0,48 Z" />
        </svg>
      </div>
    </section>
  );
}
