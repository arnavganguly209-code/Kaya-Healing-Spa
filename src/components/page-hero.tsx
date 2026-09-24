import { Breadcrumbs } from "@/components/breadcrumbs";
import Image from "next/image";
import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  text,
  image,
  crumbs,
}: {
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  crumbs: { label: string; href?: string }[];
}) {
  return (
    <section className="relative flex min-h-[70svh] items-end bg-[#141210]">
      <Image src={image} alt="" fill priority className="object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-[#141210]/60 to-[#141210]/30" />
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-16 pt-36 md:px-8">
        <Breadcrumbs items={crumbs} />
        <p className="mt-6 text-xs tracking-[0.22em] uppercase text-white/70">{eyebrow}</p>
        <h1 className="display mt-3 max-w-4xl text-5xl text-white md:text-7xl">{title}</h1>
        <p className="mt-5 max-w-xl text-white/75">{text}</p>
      </div>
    </section>
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
