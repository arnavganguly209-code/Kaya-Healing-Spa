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

/** One lotus glyph — top view, readable at small tile sizes. */
function LotusGlyph({ className }: { className?: string }) {
  const petals = Array.from({ length: 8 }, (_, i) => (
    <path
      key={i}
      d="M0 6 C-7 -4 -11 -14 0 -22 C11 -14 7 -4 0 6"
      transform={`rotate(${i * 45})`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinejoin="round"
    />
  ));
  const inner = Array.from({ length: 8 }, (_, i) => (
    <path
      key={`in-${i}`}
      d="M0 4 C-4 -2 -6 -8 0 -12 C6 -8 4 -2 0 4"
      transform={`rotate(${i * 45 + 22.5})`}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.85"
      strokeLinejoin="round"
      opacity="0.85"
    />
  ));
  return (
    <g className={className}>
      {petals}
      {inner}
      <circle r="2.2" fill="currentColor" opacity="0.5" />
    </g>
  );
}

/** Shared spa banner: orange field + white lotus pattern — all inner page covers. */
export function PageCoverArt({ eyebrow, title, tagline, text, crumbs, children }: ArtCoverProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#c45e0a] text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 85% at 50% -10%, rgba(255,255,255,0.22) 0%, transparent 52%), radial-gradient(ellipse 80% 60% at 100% 100%, rgba(255,220,180,0.15) 0%, transparent 50%), linear-gradient(168deg, #f5924a 0%, #F47B20 38%, #e06d12 68%, #c45e0a 100%)",
        }}
      />

      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="kaya-page-lotus-tile" width="128" height="128" patternUnits="userSpaceOnUse">
            <g transform="translate(64 64)" className="text-white/[0.2]">
              <LotusGlyph />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kaya-page-lotus-tile)" />
      </svg>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.08)_100%)]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(420px,70vw)] w-[min(420px,70vw)] -translate-x-1/2 -translate-y-[58%] text-white/[0.07]">
        <svg viewBox="-32 -32 64 64" className="h-full w-full">
          <LotusGlyph />
        </svg>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <div className="relative mx-auto flex min-h-[min(48svh,440px)] max-w-[920px] flex-col items-center justify-center px-5 py-20 text-center md:min-h-[min(52svh,480px)] md:px-8 md:py-24">
        {eyebrow ? (
          <p className="text-[11px] font-bold tracking-[0.32em] text-white/95 uppercase drop-shadow-sm">{eyebrow}</p>
        ) : null}
        <div className="mt-4 flex items-center gap-3" aria-hidden>
          <span className="h-px w-10 bg-white/50" />
          <span className="h-1.5 w-1.5 rotate-45 border border-white/60 bg-white/20" />
          <span className="h-px w-10 bg-white/50" />
        </div>
        <h1 className="display mt-5 text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[1.06] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.15)]">
          {title}
        </h1>
        {tagline ? (
          <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-white/95 md:text-[1.35rem]">{tagline}</p>
        ) : null}
        {text ? <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 md:text-[15px]">{text}</p> : null}
        {children}
        <div className="mt-10 flex justify-center text-white/90 [&_a]:text-white/90 [&_a:hover]:text-white [&_span]:text-white">
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
