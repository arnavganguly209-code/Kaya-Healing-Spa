"use client";

import { formatNpr, labelForCategory, packages as fallbackPackages } from "@/lib/content";
import type { SpaPackage } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export function PackageCatalog({
  items = fallbackPackages,
  categories,
}: {
  items?: SpaPackage[];
  categories?: string[];
}) {
  const [category, setCategory] = useState<string>("all");
  const filters = useMemo(() => ["all", ...(categories?.length ? categories : ["signature", "couples", "wellness"])], [categories]);

  const list = useMemo(() => {
    return items.filter((item) => {
      const cat = item.category || "wellness";
      return category === "all" || cat === category;
    });
  }, [category, items]);

  const featured = list.find((item) => item.featured) ?? list[0];
  const rest = list.filter((item) => item.slug !== featured?.slug);

  if (!featured) {
    return <p className="mx-auto max-w-[1440px] px-5 py-16 text-sm">Packages will appear here once published in Orbit.</p>;
  }

  return (
    <section className="mx-auto max-w-[1440px] px-5 py-16 md:px-8">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Package categories">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={category === filter}
            onClick={() => setCategory(filter)}
            className={`px-3 py-2 text-xs tracking-[0.14em] uppercase ${
              category === filter ? "bg-[#141210] text-white" : "bg-[#f6f1e8] text-[#141210]"
            }`}
          >
            {filter === "all" ? "All" : labelForCategory(filter)}
          </button>
        ))}
      </div>
      <article className="mt-8 grid overflow-hidden bg-[#141210] text-white lg:grid-cols-2">
        <div className="relative min-h-[360px]">
          <Image src={featured.image} alt={featured.imageAlt} fill className="object-cover" sizes="50vw" />
        </div>
        <div className="p-8 md:p-12">
          <p className="text-xs tracking-[0.2em] uppercase text-[#e8771a]">Featured · {labelForCategory(featured.category || "signature")}</p>
          <h2 className="display mt-3 text-5xl">{featured.name}</h2>
          <p className="mt-4 text-white/75">{featured.description}</p>
          <p className="mt-4 text-sm text-white/60">{featured.durationLabel}</p>
          <p className="mt-6 font-serif text-4xl">{formatNpr(featured.priceNpr)}</p>
          <Link href={`/contact?package=${featured.slug}&mode=package`} className="btn-primary mt-6">
            Book package
          </Link>
        </div>
      </article>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {rest.map((item) => (
          <article key={item.slug} className="border border-[#e6dfd4] bg-white">
            <div className="relative h-64">
              <Image src={item.image} alt={item.imageAlt} fill className="object-cover" sizes="50vw" />
            </div>
            <div className="p-6">
              <p className="text-xs tracking-[0.16em] uppercase text-[#8a8175]">
                {labelForCategory(item.category || "wellness")} · {item.durationLabel}
              </p>
              <h2 className="mt-2 font-serif text-3xl">{item.name}</h2>
              <p className="prose-quiet mt-3 text-sm">{item.description}</p>
              <p className="mt-4 font-serif text-2xl">{formatNpr(item.priceNpr)}</p>
              <Link href={`/packages/${item.slug}`} className="btn-line mt-4">
                View package
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
