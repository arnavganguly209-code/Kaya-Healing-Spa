import { Breadcrumbs } from "@/components/breadcrumbs";
import { OrangeLotusBackground } from "@/components/orange-lotus-background";
import type { ReactNode } from "react";

export type ArtCoverProps = {
  eyebrow?: string;
  title: string;
  tagline?: string;
  text?: string;
  crumbs: { label: string; href?: string }[];
  children?: ReactNode;
};

/** Shared spa banner: orange field + white lotus pattern — all inner page covers. */
export function PageCoverArt({ eyebrow, title, tagline, text, crumbs, children }: ArtCoverProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#c45e0a] text-white">
      <OrangeLotusBackground idSuffix="cover" intensity={1} />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <div className="relative z-[2] mx-auto flex min-h-[min(48svh,440px)] max-w-[920px] flex-col items-center justify-center px-5 py-20 text-center md:min-h-[min(52svh,480px)] md:px-8 md:py-24">
        {eyebrow ? (
          <p className="text-[11px] font-bold tracking-[0.32em] text-white uppercase drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]">{eyebrow}</p>
        ) : null}
        <div className="mt-4 flex items-center gap-3" aria-hidden>
          <span className="h-px w-10 bg-white/50" />
          <span className="h-1.5 w-1.5 rotate-45 border border-white/60 bg-white/20" />
          <span className="h-px w-10 bg-white/50" />
        </div>
        <h1 className="display mt-5 text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[1.06] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)]">
          {title}
        </h1>
        {tagline ? (
          <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.3)] md:text-[1.35rem]">
            {tagline}
          </p>
        ) : null}
        {text ? (
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/95 drop-shadow-[0_1px_10px_rgba(0,0,0,0.28)] md:text-[15px]">
            {text}
          </p>
        ) : null}
        {children}
        <div className="mt-10 flex justify-center text-white [&_a]:text-white/95 [&_a:hover]:text-white [&_span]:text-white">
          <Breadcrumbs items={crumbs} />
        </div>
      </div>

      <div className="relative z-[2] h-10 w-full text-[#fffcf8]" aria-hidden>
        <svg className="absolute bottom-0 left-0 h-full w-full" viewBox="0 0 1440 48" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,32 C240,8 480,48 720,28 C960,8 1200,40 1440,20 L1440,48 L0,48 Z" />
        </svg>
      </div>
    </section>
  );
}
