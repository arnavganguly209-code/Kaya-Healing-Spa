import { CatalogPhoto } from "@/components/catalog-photo";
import { PageCoverArt } from "@/components/page-cover-art";
import { ServiceBookingPanel } from "@/components/service-booking-panel";
import { TherapistStrip } from "@/components/therapist-strip";
import { formatNpr, getPackage, packages as fallbackPackages } from "@/lib/content";
import { readOrbitContent } from "@/lib/orbit-store";
import type { Metadata } from "next";
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
    openGraph: { title: item.name, description: item.summary, images: [item.image] },
  };
}

export default async function PackageDetail({ params }: Props) {
  const { slug } = await params;
  const item = getPackageFromOrbit(slug);
  if (!item) notFound();
  const orbit = readOrbitContent();
  const overview = item.overview?.trim() || item.description;
  const benefits = item.benefits?.filter(Boolean) ?? [];
  const expect = item.expect?.filter(Boolean) ?? [];

  return (
    <article className="pb-20">
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
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-3xl bg-[#f4eee6] sm:mb-10">
            <CatalogPhoto src={item.image} alt={item.imageAlt} className="object-cover" sizes="70vw" />
          </div>
          <h2 className="font-serif text-3xl">Package details</h2>
          <p className="prose-quiet mt-4">{overview}</p>
          {item.items.length > 0 ? (
            <ul className="mt-8 divide-y divide-[#e6dfd4] border-y border-[#e6dfd4]">
              {item.items.map((line) => (
                <li key={`${line.name}-${line.detail}`} className="flex justify-between gap-4 py-3 text-sm">
                  <span>{line.name}</span>
                  <span className="shrink-0 text-[#8a8175]">{line.detail}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {benefits.length > 0 ? (
            <>
              <h2 className="mt-10 font-serif text-3xl">Benefits</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#4a453e]">
                {benefits.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </>
          ) : null}
          {expect.length > 0 ? (
            <>
              <h2 className="mt-10 font-serif text-3xl">What to expect</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#4a453e]">
                {expect.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </>
          ) : null}
          <p className="mt-8 font-serif text-4xl">{formatNpr(item.priceNpr)}</p>
          {item.compareAtNpr ? (
            <p className="mt-1 text-sm text-[#8a8175] line-through">{formatNpr(item.compareAtNpr)}</p>
          ) : null}
        </div>
        <ServiceBookingPanel pkg={item} therapists={orbit.therapists} />
      </div>
      <TherapistStrip therapists={orbit.therapists} packageSlug={item.slug} />
    </article>
  );
}
