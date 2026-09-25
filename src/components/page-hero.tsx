import { PageCoverArt, type ArtCoverProps } from "@/components/page-cover-art";
import type { ReactNode } from "react";

export type PageHeroProps = ArtCoverProps;

export function PageHero(props: PageHeroProps) {
  return <PageCoverArt {...props} />;
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
