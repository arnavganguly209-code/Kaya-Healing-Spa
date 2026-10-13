"use client";

import { CatalogPhoto } from "@/components/catalog-photo";
import { FilterChips } from "@/components/filter-chips";
import { MenuDownloadButton } from "@/components/menu-download-button";
import { CatalogPageIntro } from "@/components/page-hero";
import { formatNpr, labelForCategory, packageMenuCategories, packages as fallbackPackages } from "@/lib/content";
import type { SpaPackage } from "@/lib/types";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function PackageCatalog({
  initialCategory = "all",
  catalogTitle = "Explore our packages",
  catalogSubtitle,
  items = fallbackPackages,
  categories,
  menuPdfHref,
}: {
  initialCategory?: string;
  catalogTitle?: string;
  catalogSubtitle?: string;
  items?: SpaPackage[];
  categories?: string[];
  menuPdfHref?: string;
}) {
  const [category, setCategory] = useState(initialCategory || "all");
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

  const filters = useMemo(
    () => ["all", ...(categories?.length ? categories : [...packageMenuCategories])],
    [categories],
  );

  const list = useMemo(() => {
    return items.filter((item) => {
      const cat = item.category || "wellness";
      return category === "all" || cat === category;
    });
  }, [category, items]);

  const featured = list.find((item) => item.featured) ?? list[0];
  const rest = list.filter((item) => item.slug !== featured?.slug);

  if (!featured) {
    return (
      <p className="mx-auto max-w-[1440px] bg-[#fffcf8] px-5 py-16 text-center text-sm md:px-8">
        Packages will appear here once published in Orbit.
      </p>
    );
  }

  return (
    <section className="relative bg-[#fffcf8] px-0 pb-20 pt-4 md:pb-24">
      <CatalogPageIntro title={catalogTitle} subtitle={catalogSubtitle} />
      <div className="mx-auto mt-6 max-w-[1440px] px-4 md:px-8">
        <MenuDownloadButton href={menuPdfHref} label="Download menu" />
      </div>

      <div className="mx-auto mt-10 max-w-[1440px] px-4 md:px-8">
        <FilterChips
          label="Package categories"
          value={category}
          onChange={selectCategory}
          items={filters.map((filter) => ({
            id: filter,
            label: filter === "all" ? "All" : labelForCategory(filter),
          }))}
        />

        <article className="mt-12 overflow-hidden rounded-3xl bg-[#141210] text-white shadow-[0_20px_50px_rgba(20,18,16,0.18)] lg:grid lg:grid-cols-2">
          <div className="relative min-h-[320px] lg:min-h-[420px]">
            <CatalogPhoto src={featured.image} alt={featured.imageAlt} className="object-cover" sizes="50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141210]/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#141210]/40" />
            <span className="absolute left-5 top-5 rounded-full border border-[#F47B20]/60 bg-[#141210]/60 px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-[#F47B20] uppercase backdrop-blur-sm">
              Featured
            </span>
          </div>
          <div className="flex flex-col justify-center p-5 sm:p-8 md:p-12 lg:p-14">
            <p className="text-[11px] font-bold tracking-[0.2em] text-[#F47B20] uppercase">
              {labelForCategory(featured.category || "signature")}
            </p>
            <h2 className="display mt-3 text-[1.85rem] md:text-5xl">{featured.name}</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/78 md:text-base">{featured.description}</p>
            <p className="mt-4 text-sm font-medium text-white/55">{featured.durationLabel}</p>
            <p className="mt-6 font-serif text-3xl text-white sm:text-4xl">{formatNpr(featured.priceNpr)}</p>
            <Link
              href={`/contact?package=${featured.slug}&mode=package`}
              className="btn-primary mt-8 w-full rounded-full px-8 sm:w-fit"
            >
              Book this package
            </Link>
          </div>
        </article>

        {rest.length > 0 ? (
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {rest.map((item) => (
              <article
                key={item.slug}
                className="group overflow-hidden rounded-2xl border border-[#efe8e0] bg-white shadow-[0_8px_30px_rgba(20,18,16,0.06)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(20,18,16,0.1)]"
              >
                <div className="relative h-64 overflow-hidden">
                  <CatalogPhoto
                    src={item.image}
                    alt={item.imageAlt}
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="50vw"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold tracking-[0.12em] text-[#141210] uppercase">
                    {item.durationLabel}
                  </span>
                </div>
                <div className="p-6 md:p-7">
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-[#F47B20] uppercase">
                    {labelForCategory(item.category || "wellness")}
                  </p>
                  <h2 className="mt-2 font-serif text-3xl text-[#141210]">{item.name}</h2>
                  <p className="prose-quiet mt-3 text-sm leading-relaxed">{item.description}</p>
                  <p className="mt-4 font-serif text-2xl text-[#141210]">{formatNpr(item.priceNpr)}</p>
                  <Link href={`/packages/${item.slug}`} className="btn-line mt-5 inline-block">
                    View package
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
