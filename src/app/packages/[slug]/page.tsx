import { CatalogPhoto } from "@/components/catalog-photo";
import { PageCoverArt } from "@/components/page-cover-art";
import { TherapistStrip } from "@/components/therapist-strip";
import { formatNpr, getPackage, packages as fallbackPackages } from "@/lib/content";
import { readOrbitContent } from "@/lib/orbit-store";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

function getPackageFromOrbit(slug: string) {
  return readOrbitContent().packages.find((item) => item.slug === slug) ?? getPackage(slug);
}

export function generateStaticParams() {
  const orbit = readOrbitContent();
  const slugs = new Set([...fallbackPackages.map((p) => p.slug), ...orbit.packages.map((p) => p.slug)]);
  return [...slugs].map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getPackageFromOrbit(slug);
  if (!item) notFound();
  return {
    title: item.name,
    description: item.summary,
    alternates: { canonical: `/packages/${item.slug}` },
  };
}

export default async function PackageDetail({ params }: Props) {
  const { slug } = await params;
  const item = getPackageFromOrbit(slug);
  if (!item) notFound();
  const orbit = readOrbitContent();

  return (
    <article>
      <PageCoverArt
        eyebrow="Package"
        title={item.name}
        tagline={item.summary}
        text={item.durationLabel}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Packages", href: "/packages" },
          { label: item.name },
        ]}
      />
      <div className="mx-auto max-w-[800px] px-5 py-16">
        <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-3xl bg-[#f4eee6]">
          <CatalogPhoto src={item.image} alt={item.imageAlt} className="object-cover" sizes="800px" />
        </div>
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
        <Link href={`/contact?package=${item.slug}&mode=package`} className="btn-primary mt-6">
          Book package
        </Link>
      </div>
      <TherapistStrip therapists={orbit.therapists} packageSlug={item.slug} />
    </article>
  );
}
