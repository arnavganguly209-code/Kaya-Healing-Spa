"use client";

import { formatNpr, labelForCategory, serviceMenuCategories, services } from "@/lib/content";
import type { ServiceCategory } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const filtersDefault: (ServiceCategory | "all")[] = ["all", ...serviceMenuCategories];

export function ServiceCatalog({
  initialCategory = "all",
  items = services,
  categories,
}: {
  initialCategory?: string;
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
    <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Service categories">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={category === filter}
              onClick={() => selectCategory(filter)}
              className={`px-3 py-2 text-xs tracking-[0.14em] uppercase ${
                category === filter ? "bg-[#141210] text-white" : "bg-[#f6f1e8] text-[#141210]"
              }`}
            >
              {labelForCategory(filter === "all" ? "all" : filter)}
            </button>
          ))}
        </div>
        <label className="text-sm">
          <span className="sr-only">Search treatments</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search treatments"
            className="w-full border border-[#e6dfd4] bg-white px-4 py-3 md:w-72"
          />
        </label>
      </div>
      <p className="mt-6 text-sm text-[#8a8175]">Indicative prices. Confirm when you book. {list.length} treatments.</p>
      {list.length === 0 ? (
        <p className="mt-16 font-serif text-3xl">No treatments match that search.</p>
      ) : (
        <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {list.map((service) => (
            <article key={service.slug} className="flex flex-col border border-[#e6dfd4] bg-white">
              <div className="relative h-56">
                <Image src={service.image} alt={service.imageAlt} fill className="object-cover" sizes="33vw" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs tracking-[0.16em] uppercase text-[#2f8f45]">
                  {labelForCategory(service.category)} · {service.durationMinutes} min
                </p>
                <h2 className="mt-2 font-serif text-3xl">{service.name}</h2>
                <p className="prose-quiet mt-3 flex-1 text-sm">{service.summary}</p>
                <p className="mt-4 text-sm">From {formatNpr(service.priceFromNpr)}</p>
                <div className="mt-5 flex flex-wrap gap-4">
                  <Link href={`/services/${service.slug}`} className="btn-line">View details</Link>
                  <Link href={`/contact?service=${service.slug}`} className="text-xs tracking-[0.14em] uppercase text-[#e8771a]">
                    Book now
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
