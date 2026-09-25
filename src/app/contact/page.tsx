import { BookingForm, NewsletterForm } from "@/components/booking-form";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { faqs, reviews, site } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Booking",
  description: `Request a spa appointment at ${site.name} in Kathmandu. Share a preferred treatment, package, date, and time.`,
  alternates: { canonical: "/contact" },
  openGraph: { title: `Book ${site.name}`, description: "Request a wellness appointment in Kathmandu." },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; package?: string }>;
}) {
  const params = await searchParams;
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
        eyebrow="Contact"
        title="Your wellness appointment"
        text="Send a request with a preferred time. The spa confirms availability directly. Online requests are not instant bookings and are not medical consultations."
        image="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=2000&q=80"
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <section className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 md:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <BookingForm service={params.service} packageSlug={params.package} />
        <aside>
          <h2 className="font-serif text-3xl">{site.name}</h2>
          <p className="mt-3">{site.city}</p>
          <p className="prose-quiet mt-2 text-sm">Street address, phone, and email will appear here when the spa publishes them.</p>
          <ul className="mt-6 space-y-2 text-sm">
            {site.hours.map((row) => (
              <li key={row.day}>{row.day}: {row.hours}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-[#8a8175]">{site.hoursNote}</p>
          <div className="mt-6 min-h-[240px]">
            <iframe
              title="Map of Kathmandu"
              className="h-64 w-full"
              loading="lazy"
              src="https://maps.google.com/maps?q=Kathmandu%20Nepal&z=12&output=embed"
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-xs tracking-[0.14em] uppercase">
            {(
              [
                ["Instagram", site.social.instagram],
                ["Facebook", site.social.facebook],
                ["Google", site.social.google],
                ["Tripadvisor", site.social.tripadvisor],
              ] as const
            )
              .filter(([, href]) => href.startsWith("https://"))
              .map(([label, href]) => (
                <a key={label} href={href} target="_blank" rel="noreferrer">
                  {label}
                </a>
              ))}
          </div>
          <h3 className="mt-10 font-serif text-2xl">Wellness notes</h3>
          <p className="prose-quiet mt-2 text-sm">Receive wellness updates & exclusive offers.</p>
          <NewsletterForm />
        </aside>
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
        <h2 className="font-serif text-3xl">Reviews</h2>
        <p className="mt-3 text-sm text-[#8a8175]">
          Verified guest reviews are not published yet. The notes below are layout samples only.
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
