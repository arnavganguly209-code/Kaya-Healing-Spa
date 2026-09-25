"use client";

import { CatalogPageIntro } from "@/components/page-hero";
import { formatNpr, labelForCategory, serviceMenuCategories, services } from "@/lib/content";
import { NAV_MENU_TYPE } from "@/lib/nav-menu-type";
import type { ServiceCategory } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const filtersDefault: (ServiceCategory | "all")[] = ["all", ...serviceMenuCategories];

export function ServiceCatalog({
  initialCategory = "all",
  catalogTitle = "Choose your convenient treatment",
  catalogSubtitle,
  items = services,
  categories,
}: {
  initialCategory?: string;
  catalogTitle?: string;
  catalogSubtitle?: string;
  items?: typeof services;
  categories?: string[];
}) {
  const [category, setCategory] = useState(initialCategory || "all");
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setCategory(initialCategory && initialCategory !== "" ? initialCategory : "all");
  }, [initialCategory]);

  const selectCategory = (filter: string) => {
    const next = filter === "all" ? "all" : filter;
    setCategory(next);
    if (next === "all") {
      router.replace(pathname, { scroll: false });
      return;
    }
    router.replace(`${pathname}?category=${next}`, { scroll: false });
  };

  const filters = useMemo(() => {
    const list = categories?.length ? categories : filtersDefault.slice(1);
    return ["all", ...list] as const;
  }, [categories]);

  const list = useMemo(() => {
    return items.filter((service) => {
      const catOk = category === "all" || service.category === category;
      const q = query.trim().toLowerCase();
      const textOk = !q || `${service.name} ${service.summary}`.toLowerCase().includes(q);
      return catOk && textOk;
    });
  }, [category, query, items]);

  return (
    <section className="relative bg-[#fffcf8] pb-20 pt-4 md:pb-24">
      <CatalogPageIntro title={catalogTitle} subtitle={catalogSubtitle} />

      <div className="mx-auto mt-10 max-w-[1440px] px-5 md:px-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Service categories">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                role="tab"
                aria-selected={category === filter}
                onClick={() => selectCategory(filter)}
                className={`rounded-full px-5 py-3 ${NAV_MENU_TYPE} transition ${
                  category === filter
                    ? "bg-[#F47B20] text-white shadow-[0_8px_24px_rgba(244,123,32,0.28)]"
                    : "border border-[#e6dfd4] bg-white text-[#141210] hover:border-[#F47B20]/40 hover:text-[#F47B20]"
                }`}
              >
                {labelForCategory(filter === "all" ? "all" : filter)}
              </button>
            ))}
          </div>
          <label className="w-full max-w-md text-sm">
            <span className="sr-only">Search treatments</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search treatments"
              className="w-full rounded-full border border-[#e6dfd4] bg-white px-5 py-3 text-center shadow-sm focus:border-[#F47B20] focus:outline-none"
            />
          </label>
        </div>

        <p className="mt-8 text-center text-sm text-[#8a8175]">
          All prices in NPR · {list.length} treatment{list.length === 1 ? "" : "s"}
        </p>

        {list.length === 0 ? (
          <p className="mt-16 text-center font-serif text-3xl text-[#141210]">No treatments match that search.</p>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {list.map((service) => (
              <article
                key={service.slug}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#efe8e0] bg-white shadow-[0_8px_30px_rgba(20,18,16,0.06)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(20,18,16,0.1)]"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="33vw"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-[#F47B20] px-3 py-1 text-[10px] font-bold tracking-[0.12em] text-white uppercase">
                    {service.durationMinutes} min
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-[#F47B20] uppercase">
                    {labelForCategory(service.category)}
                  </p>
                  <h2 className="mt-2 font-serif text-2xl leading-tight text-[#141210] md:text-[1.65rem]">{service.name}</h2>
                  <p className="prose-quiet mt-3 flex-1 text-sm leading-relaxed">{service.summary}</p>
                  {service.durationOptions.length > 0 ? (
                    <ul className="mt-3 space-y-1 text-xs font-medium text-[#3d4a6b]">
                      {service.durationOptions.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm font-semibold text-[#141210]">From {formatNpr(service.priceFromNpr)}</p>
                  )}
                  <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-[#f0ece8] pt-5">
                    <Link href={`/services/${service.slug}`} className="btn-line">
                      View details
                    </Link>
                    <Link
                      href={`/contact?service=${service.slug}`}
                      className="text-xs font-bold tracking-[0.14em] text-[#F47B20] uppercase hover:text-[#e06d12]"
                    >
                      Book now →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
