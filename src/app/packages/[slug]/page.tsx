import { Breadcrumbs } from "@/components/breadcrumbs";
import { formatNpr, getPackage, packages } from "@/lib/content";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return packages.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getPackage(slug);
  if (!item) return { title: "Package" };
  return {
    title: item.name,
    description: item.summary,
    alternates: { canonical: `/packages/${item.slug}` },
  };
}

export default async function PackageDetail({ params }: Props) {
  const { slug } = await params;
  const item = getPackage(slug);
  if (!item) notFound();

  return (
    <article>
      <div className="relative min-h-[60svh]">
        <Image src={item.image} alt={item.imageAlt} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 mx-auto flex min-h-[60svh] max-w-[900px] flex-col justify-end px-5 pb-12 pt-32 text-white">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Packages", href: "/packages" }, { label: item.name }]} />
          <h1 className="display mt-6 text-5xl md:text-6xl">{item.name}</h1>
          <p className="mt-3 text-white/80">{item.durationLabel}</p>
        </div>
      </div>
      <div className="mx-auto max-w-[800px] px-5 py-16">
        <p className="prose-quiet text-lg">{item.description}</p>
        <ul className="mt-8 divide-y divide-[#e6dfd4] border-y border-[#e6dfd4]">
          {item.items.map((line) => (
            <li key={line.name} className="flex justify-between py-3 text-sm">
              <span>{line.name}</span>
              <span className="text-[#8a8175]">{line.detail}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 font-serif text-4xl">{formatNpr(item.priceNpr)}</p>
        <p className="text-xs text-[#8a8175]">Indicative placeholder price.</p>
        <Link href={`/contact?package=${item.slug}`} className="btn-primary mt-6">Book package</Link>
      </div>
    </article>
  );
}
