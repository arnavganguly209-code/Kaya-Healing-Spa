import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { ServiceCatalog } from "@/components/service-catalog";
import { TherapistStrip } from "@/components/therapist-strip";
import { services as fallbackServices, site } from "@/lib/content";
import { readOrbitContent } from "@/lib/orbit-store";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spa Treatments in Kathmandu",
  description:
    `Massage, Ayurvedic rituals, body care, facials, and recovery treatments at ${site.name} in Kathmandu.`,
  alternates: { canonical: "/services" },
  openGraph: {
    title: `Treatments at ${site.name}`,
    description: "A full treatment menu for massage, Ayurveda, and wellness in Kathmandu.",
  },
};

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const live = readOrbitContent();
  const services = live.services.length ? live.services : fallbackServices;
  return (
    <>
      <JsonLd
        data={services.map((service) => ({
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.name,
          description: service.summary,
          provider: { "@type": "HealthAndBeautyBusiness", name: site.name, url: site.url },
          areaServed: "Kathmandu",
          url: `${site.url}/services/${service.slug}`,
        }))}
      />
      <PageHero
        eyebrow={live.pageCovers.services.eyebrow}
        title={live.pageCovers.services.title}
        tagline={live.pageCovers.services.tagline}
        text={live.pageCovers.services.text}
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />
      <ServiceCatalog
        initialCategory={params.category ?? "all"}
        catalogTitle={live.pageCovers.services.catalogTitle}
        catalogSubtitle={live.pageCovers.services.catalogSubtitle}
        items={services}
        categories={live.categories}
      />
      <TherapistStrip therapists={live.therapists} intro="Book a treatment and pick your therapist on the contact form." />
    </>
  );
}
