import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { ServiceCatalog } from "@/components/service-catalog";
import { services as fallbackServices, site } from "@/lib/content";
import { readOrbitContent } from "@/lib/orbit-store";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spa Treatments in Kathmandu",
  description:
    "Massage, Ayurvedic rituals, body care, facials, and recovery treatments at KAYA SPA in Kathmandu.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Treatments at KAYA SPA",
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
          provider: { "@type": "HealthAndBeautyBusiness", name: "KAYA SPA", url: site.url },
          areaServed: "Kathmandu",
          url: `${site.url}/services/${service.slug}`,
        }))}
      />
      <PageHero
        eyebrow="Services"
        title="Treatments designed around you"
        text="Massage, Ayurvedic oil rituals, body care, and recovery work. Choose a starting point — the hour can still be adjusted when you arrive."
        image="https://images.unsplash.com/photo-1519824145371-296894a0daa9?auto=format&fit=crop&w=2000&q=80"
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />
      <ServiceCatalog initialCategory={params.category ?? "all"} items={services} />
    </>
  );
}
