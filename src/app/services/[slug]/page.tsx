import { CatalogPhoto } from "@/components/catalog-photo";
import { JsonLd } from "@/components/json-ld";
import { PageCoverArt } from "@/components/page-cover-art";
import { ServiceBookingPanel } from "@/components/service-booking-panel";
import { TherapistStrip } from "@/components/therapist-strip";
import { categoryLabels, getService as fallbackService, services, site } from "@/lib/content";
import { readOrbitContent } from "@/lib/orbit-store";
import { bookableTherapists, publicTherapists } from "@/lib/therapist-booking";
import type { Service } from "@/lib/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

function getService(slug: string): Service | undefined {
  return readOrbitContent().services.find((service) => service.slug === slug) ?? fallbackService(slug);
}

export function generateStaticParams() {
  const orbit = readOrbitContent();
  const slugs = new Set([...services.map((s) => s.slug), ...orbit.services.map((s) => s.slug)]);
  return [...slugs].map((slug) => ({ slug }));
}

/** Unknown slugs must return a real HTTP 404 (not a soft 200). */
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
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
    <article className="pb-28">
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
      <div className="mx-auto flex max-w-[1440px] flex-col-reverse gap-8 px-4 py-10 md:px-8 md:py-16 lg:grid lg:grid-cols-[1.4fr_0.8fr] lg:gap-12">
        <div>
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-3xl bg-[#f4eee6]">
            <CatalogPhoto src={service.image} alt={service.imageAlt} className="object-cover" sizes="70vw" />
          </div>
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
        <ServiceBookingPanel service={service} therapists={bookableTherapists(orbit)} />
      </div>
      <TherapistStrip
        therapists={publicTherapists(orbit)}
        serviceSlug={service.slug}
        allowBooking={orbit.therapistBookingEnabled !== false}
      />
    </article>
  );
}
