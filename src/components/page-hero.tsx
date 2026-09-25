import { Breadcrumbs } from "@/components/breadcrumbs";
import type { ReactNode } from "react";

export type PageHeroProps = {
  eyebrow: string;
  title: string;
  tagline?: string;
  text?: string;
  crumbs: { label: string; href?: string }[];
};

export function PageHero({ eyebrow, title, tagline, text, crumbs }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#100e0c] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 85% 70% at 100% 0%, rgba(244,123,32,0.38) 0%, transparent 55%), radial-gradient(ellipse 70% 60% at 0% 100%, rgba(244,123,32,0.22) 0%, transparent 50%), linear-gradient(165deg, #1a1410 0%, #100e0c 45%, #0c0a09 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(244,123,32,0.9) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full border border-[#F47B20]/25" />
      <div className="pointer-events-none absolute -right-8 top-24 h-44 w-44 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -left-16 bottom-20 h-56 w-56 rounded-full bg-[#F47B20]/10 blur-3xl" />
      <div className="pointer-events-none absolute left-[12%] top-[38%] hidden h-px w-[min(42vw,520px)] bg-gradient-to-r from-transparent via-[#F47B20]/50 to-transparent md:block" />

      <div className="relative mx-auto flex min-h-[min(52svh,520px)] max-w-[1440px] flex-col justify-end px-5 pb-14 pt-32 md:px-8 md:pb-16 lg:min-h-[min(56svh,580px)] lg:pt-40">
        <Breadcrumbs items={crumbs} />
        <p className="mt-8 flex items-center gap-3 text-[11px] font-bold tracking-[0.28em] text-[#F47B20] uppercase">
          {eyebrow}
          <span className="h-px w-12 bg-[#F47B20]/80" aria-hidden />
        </p>
        <h1 className="display mt-4 max-w-4xl text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] text-white">{title}</h1>
        {tagline ? (
          <p className="mt-5 max-w-2xl font-serif text-xl leading-relaxed text-white/88 md:text-2xl">{tagline}</p>
        ) : null}
        {text ? <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65 md:text-[15px]">{text}</p> : null}
      </div>

      <div className="relative h-10 w-full text-[#fffcf8]" aria-hidden>
        <svg className="absolute bottom-0 left-0 h-full w-full" viewBox="0 0 1440 48" preserveAspectRatio="none">
          <path
            fill="currentColor"
            d="M0,32 C240,8 480,48 720,28 C960,8 1200,40 1440,20 L1440,48 L0,48 Z"
          />
        </svg>
      </div>
    </section>
  );
}

export function CatalogPageIntro({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-[720px] px-5 text-center md:px-8">
      <h2 className="font-serif text-3xl text-[#141210] md:text-4xl">{title}</h2>
      {subtitle ? <p className="prose-quiet mt-3 text-sm md:text-base">{subtitle}</p> : null}
    </div>
  );
}

export function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-36 md:px-8">
      <h1 className="display text-5xl">{title}</h1>
      <div className="prose-quiet mt-8 space-y-4 text-sm">{children}</div>
    </article>
  );
}
