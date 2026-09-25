import { JsonLd } from "@/components/json-ld";
import { TherapistStrip } from "@/components/therapist-strip";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { categoryLabels, formatNpr, getService as fallbackService, services, site } from "@/lib/content";
import { readOrbitContent } from "@/lib/orbit-store";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

function getService(slug: string) {
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
      <div className="relative min-h-[68svh] bg-[#141210]">
        <Image src={service.image} alt={service.imageAlt} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-black/40 to-black/20" />
        <div className="relative z-10 mx-auto flex min-h-[68svh] max-w-[1440px] flex-col justify-end px-5 pb-12 pt-32 md:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
              { label: service.name },
            ]}
          />
          <p className="mt-6 text-xs tracking-[0.2em] uppercase text-white/70">{categoryLabels[service.category]}</p>
          <h1 className="display mt-3 text-5xl text-white md:text-7xl">{service.name}</h1>
        </div>
      </div>
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 md:px-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <h2 className="font-serif text-3xl">Treatment overview</h2>
          <p className="prose-quiet mt-4">{service.overview}</p>
          <h2 className="mt-10 font-serif text-3xl">Benefits</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#4a453e]">
            {service.benefits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h2 className="mt-10 font-serif text-3xl">What to expect</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#4a453e]">
            {service.expect.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h2 className="mt-10 font-serif text-3xl">Recommended for</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#4a453e]">
            {service.recommendedFor.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h2 className="mt-10 font-serif text-3xl">Preparation</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#4a453e]">
            {service.preparation.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
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
          <p className="mt-2 text-xs text-[#8a8175]">Indicative placeholder pricing. This is not a medical treatment.</p>
          <Link href={`/contact?service=${service.slug}&mode=service`} className="btn-primary mt-6 w-full">
            Book appointment
          </Link>
        </aside>
      </div>
      <TherapistStrip therapists={orbit.therapists} serviceSlug={service.slug} />
    </article>
  );
}
