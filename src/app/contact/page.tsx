import { ContactBookingHub } from "@/components/contact-booking-hub";
import { CompanyContactCard } from "@/components/company-contact-card";
import { NewsletterForm } from "@/components/booking-form";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { faqs, reviews, site } from "@/lib/content";
import { readOrbitContent } from "@/lib/orbit-store";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Booking",
  description: `Book massage and spa packages at ${site.name}, Hotel Northfield, Chaksibari, Kathmandu. Call ${site.phone}.`,
  alternates: { canonical: "/contact" },
  openGraph: { title: `Book ${site.name}`, description: "Request a wellness appointment in Kathmandu." },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; package?: string; therapist?: string; mode?: string }>;
}) {
  const params = await searchParams;
  const orbit = readOrbitContent();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }}
      />
      <PageHero
        eyebrow={orbit.pageCovers.contact.eyebrow}
        title={orbit.pageCovers.contact.title}
        tagline={orbit.pageCovers.contact.tagline}
        text={orbit.pageCovers.contact.text}
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <section className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 md:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        <ContactBookingHub
          services={orbit.services}
          packages={orbit.packages}
          therapists={orbit.therapists}
          initial={{
            service: params.service,
            package: params.package,
            therapist: params.therapist,
            mode: params.mode,
          }}
        />
        <div className="space-y-8">
          <CompanyContactCard phone={orbit.phone || site.phone} />
          <div className="rounded-2xl border border-[#e6dfd4] bg-white p-6">
            <h3 className="font-serif text-2xl">Wellness notes</h3>
            <p className="prose-quiet mt-2 text-sm">Occasional updates from the spa.</p>
            <NewsletterForm />
          </div>
        </div>
      </section>
      <section className="bg-[#f6f1e8]">
        <div className="mx-auto max-w-[900px] px-5 py-16 md:px-8">
          <h2 className="display text-4xl">Before you visit</h2>
          <div className="mt-8 divide-y divide-[#e6dfd4]">
            {faqs.map((faq) => (
              <details key={faq.question} className="py-4">
                <summary className="cursor-pointer font-serif text-2xl">{faq.question}</summary>
                <p className="prose-quiet mt-2 text-sm">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section id="reviews" className="mx-auto max-w-[900px] px-5 py-16">
        <h2 className="font-serif text-3xl">Google reviews</h2>
        <p className="mt-3 text-sm text-[#2f8f45]">
          {site.googleRating} average from {site.googleReviewCount.toLocaleString()} reviews on Google.
        </p>
        <ul className="mt-6 space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="border border-[#e6dfd4] p-5 text-sm">
              {review.text}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
