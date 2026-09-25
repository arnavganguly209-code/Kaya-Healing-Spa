import { JsonLd } from "@/components/json-ld";
import { PageCoverArt } from "@/components/page-cover-art";
import { TherapistStrip } from "@/components/therapist-strip";
import { categoryLabels, formatNpr, getService as fallbackService, services, site } from "@/lib/content";
import { readOrbitContent } from "@/lib/orbit-store";
import type { Service } from "@/lib/types";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

function getService(slug: string): Service | undefined {
  return readOrbitContent().services.find((service) => service.slug === slug) ?? fallbackService(slug);
}

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Treatment" };
  return {
    title: service.name,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: service.name, description: service.summary, images: [service.image] },
  };
}

export default async function ServiceDetail({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const orbit = readOrbitContent();

  return (
    <article className="pb-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.name,
          description: service.overview,
          provider: { "@type": "HealthAndBeautyBusiness", name: site.name },
          url: `${site.url}/services/${service.slug}`,
        }}
      />
      <PageCoverArt
        eyebrow={categoryLabels[service.category]}
        title={service.name}
        tagline={service.summary}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.name },
        ]}
      />
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 md:px-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <h2 className="font-serif text-3xl">Treatment overview</h2>
          <p className="prose-quiet mt-4">{service.overview}</p>
          {service.benefits.length > 0 ? (
            <>
              <h2 className="mt-10 font-serif text-3xl">Benefits</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#4a453e]">
                {service.benefits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}
          {service.expect.length > 0 ? (
            <>
              <h2 className="mt-10 font-serif text-3xl">What to expect</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#4a453e]">
                {service.expect.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}
          {service.recommendedFor.length > 0 ? (
            <>
              <h2 className="mt-10 font-serif text-3xl">Recommended for</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#4a453e]">
                {service.recommendedFor.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}
          {service.preparation.length > 0 ? (
            <>
              <h2 className="mt-10 font-serif text-3xl">Preparation</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#4a453e]">
                {service.preparation.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
        <aside className="h-fit border border-[#e6dfd4] bg-[#f6f1e8] p-6 lg:sticky lg:top-28">
          <p className="text-xs tracking-[0.16em] uppercase text-[#8a8175]">Duration options</p>
          <ul className="mt-3 space-y-1 text-sm">
            {service.durationOptions.map((option) => (
              <li key={option}>{option}</li>
            ))}
          </ul>
          <p className="mt-6 text-xs tracking-[0.16em] uppercase text-[#8a8175]">From</p>
          <p className="mt-1 font-serif text-4xl">{formatNpr(service.priceFromNpr)}</p>
          <p className="mt-2 text-xs text-[#8a8175]">Prices in NPR. This is wellness bodywork, not medical treatment.</p>
          <Link href={`/contact?service=${service.slug}&mode=service`} className="btn-primary mt-6 w-full">
            Book appointment
          </Link>
        </aside>
      </div>
      <TherapistStrip therapists={orbit.therapists} serviceSlug={service.slug} />
    </article>
  );
}
