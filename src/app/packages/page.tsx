import { PageHero } from "@/components/page-hero";
import { formatNpr, packages } from "@/lib/content";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Spa Packages in Kathmandu",
  description: "Half-day and full-day spa packages, couple sessions, and recovery rituals at KAYA SPA.",
  alternates: { canonical: "/packages" },
  openGraph: { title: "KAYA SPA packages", description: "Complete wellness experiences in Kathmandu." },
};

export default function PackagesPage() {
  const featured = packages.find((item) => item.featured) ?? packages[0];
  const rest = packages.filter((item) => item.slug !== featured.slug);

  return (
    <>
      <PageHero
        eyebrow="Packages"
        title="Complete wellness experiences"
        text="Sequences with rest built in. Swap a treatment of similar length if you prefer — tell us when you book."
        image="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=2000&q=80"
        crumbs={[{ label: "Home", href: "/" }, { label: "Packages" }]}
      />
      <section className="mx-auto max-w-[1440px] px-5 py-16 md:px-8">
        <p className="text-sm text-[#8a8175]">All package prices are indicative placeholders until confirmed by the spa.</p>
        <article className="mt-8 grid overflow-hidden bg-[#141210] text-white lg:grid-cols-2">
          <div className="relative min-h-[360px]">
            <Image src={featured.image} alt={featured.imageAlt} fill className="object-cover" sizes="50vw" />
          </div>
          <div className="p-8 md:p-12">
            <p className="text-xs tracking-[0.2em] uppercase text-[#e8771a]">Featured</p>
            <h2 className="display mt-3 text-5xl">{featured.name}</h2>
            <p className="mt-4 text-white/75">{featured.description}</p>
            <p className="mt-4 text-sm text-white/60">{featured.durationLabel}</p>
            <ul className="mt-6 space-y-2 text-sm">
              {featured.items.map((item) => (
                <li key={item.name} className="flex justify-between gap-4 border-b border-white/10 py-2">
                  <span>{item.name}</span>
                  <span className="text-white/50">{item.detail}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 font-serif text-4xl">{formatNpr(featured.priceNpr)}</p>
            {featured.compareAtNpr && (
              <p className="text-sm text-white/50">
                Indicative saving {formatNpr(featured.compareAtNpr - featured.priceNpr)} against booking separately.
              </p>
            )}
            <Link href={`/contact?package=${featured.slug}`} className="btn-primary mt-6">Book package</Link>
          </div>
        </article>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {rest.map((item) => (
            <article key={item.slug} className="border border-[#e6dfd4] bg-white">
              <div className="relative h-64">
                <Image src={item.image} alt={item.imageAlt} fill className="object-cover" sizes="50vw" />
              </div>
              <div className="p-6">
                <p className="text-xs tracking-[0.16em] uppercase text-[#8a8175]">{item.durationLabel}</p>
                <h2 className="mt-2 font-serif text-3xl">{item.name}</h2>
                <p className="prose-quiet mt-3 text-sm">{item.description}</p>
                <ul className="mt-4 space-y-1 text-sm">
                  {item.items.map((line) => (
                    <li key={line.name}>
                      {line.name} <span className="text-[#8a8175]">· {line.detail}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4">
                  {formatNpr(item.priceNpr)}
                  {item.compareAtNpr && (
                    <span className="ml-2 text-sm text-[#8a8175] line-through">{formatNpr(item.compareAtNpr)}</span>
                  )}
                </p>
                <Link href={`/packages/${item.slug}`} className="btn-line mt-4">View package</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
