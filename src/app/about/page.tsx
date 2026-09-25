import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { labelForCategory, site } from "@/lib/content";
import { readOrbitContent } from "@/lib/orbit-store";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: `About ${site.name}`,
  description: `${site.name} — ${site.placeType}. ${site.addressLine}. Call ${site.phone}.`,
  alternates: { canonical: "/about" },
  openGraph: { title: `About ${site.name}`, description: "Wellness with intention in Kathmandu." },
};

const values = [
  ["Care", "Guests are greeted as people with a day behind them, not as a timetable."],
  ["Quality", "Treatments are simple, skilled, and finished properly."],
  ["Calm", "Rooms, voices, and pacing stay low."],
  ["Authenticity", "Ayurvedic and body rituals are offered plainly, without costume."],
  ["Professionalism", "Draping, hygiene, and timekeeping are part of the craft."],
];

export default function AboutPage() {
  const orbit = readOrbitContent();
  const about = orbit.aboutPage;

  return (
    <>
      <PageHero
        eyebrow={about.introEyebrow}
        title={about.introTitle}
        text={about.introLead}
        image="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2000&q=80"
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <section className="mx-auto max-w-[900px] px-5 py-16 md:px-8">
        <div className="rounded-2xl border border-[#e6dfd4] bg-[#f6f1e8] p-8 md:p-10">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[#F47B20] uppercase">Company details</p>
          <h2 className="mt-2 font-serif text-3xl">{site.name}</h2>
          <p className="mt-1 text-sm text-[#6B6B6B]">{about.companyTagline || site.placeType}</p>
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[#8a8175]">Address</dt>
              <dd className="mt-1 leading-relaxed">{site.addressLine}</dd>
            </div>
            <div>
              <dt className="text-[#8a8175]">Phone</dt>
              <dd className="mt-1">
                <a href={`tel:${site.phoneTel}`} className="font-semibold hover:text-[#F47B20]">
                  {orbit.phone || site.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[#8a8175]">Hours</dt>
              <dd className="mt-1">{site.hours.map((row) => `${row.hours}`).join(" · ")}</dd>
            </div>
            <div>
              <dt className="text-[#8a8175]">Google</dt>
              <dd className="mt-1">
                {about.googleRating || site.googleRating} ★ · {(about.googleReviewCount || site.googleReviewCount).toLocaleString()} reviews
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-12 px-5 py-8 md:px-8 lg:grid-cols-2 lg:py-16">
        <Reveal>
          <p className="eyebrow">Our story</p>
          <h2 className="display mt-4 text-5xl">Hospitality, then the treatment</h2>
          <div className="prose-quiet mt-6 space-y-4">
            {about.story.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
        <div className="relative min-h-[420px]">
          <Image
            src={orbit.homeAbout.image}
            alt={orbit.homeAbout.imageAlt}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
            unoptimized={orbit.homeAbout.image.startsWith("/uploads/") || orbit.homeAbout.image.startsWith("/hero/")}
          />
        </div>
      </section>

      <section className="bg-[#141210] text-white">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-16 md:grid-cols-[0.9fr_1.1fr] md:px-8">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
            <Image
              src={about.owner.photo}
              alt={about.owner.photoAlt}
              fill
              className="object-cover"
              sizes="400px"
              unoptimized={about.owner.photo.startsWith("/uploads/")}
            />
          </div>
          <div>
            <p className="text-[11px] tracking-[0.22em] text-[#F47B20] uppercase">Leadership</p>
            <h2 className="display mt-3 text-4xl md:text-5xl">{about.owner.name}</h2>
            <p className="mt-2 text-sm text-white/70">{about.owner.role}</p>
            <p className="mt-2 text-sm font-medium text-[#F47B20]">{about.owner.experience}</p>
            <p className="prose-quiet mt-6 text-white/80">{about.owner.description}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-8">
        <h2 className="display text-4xl md:text-5xl">Partners & standards</h2>
        <p className="prose-quiet mt-4 max-w-2xl text-sm">Marks and programmes that shape how we host guests at Northfield.</p>
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {about.logos.map((logo) => (
            <li key={logo.name} className="flex flex-col rounded-2xl border border-[#e6dfd4] bg-white p-6">
              <div className="relative mx-auto h-20 w-20">
                <Image
                  src={logo.image}
                  alt={logo.imageAlt}
                  fill
                  className="object-contain"
                  unoptimized={logo.image.startsWith("/uploads/") || logo.image.startsWith("/brand/")}
                />
              </div>
              <h3 className="mt-4 text-center font-serif text-xl">{logo.name}</h3>
              <p className="prose-quiet mt-2 text-center text-sm">{logo.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-[#f6f1e8]">
        <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-8">
          <h2 className="display text-5xl">Brand values</h2>
          <ul className="mt-10 grid gap-6 md:grid-cols-5">
            {values.map(([title, text]) => (
              <li key={title} className="border-t border-[#e6dfd4] pt-4">
                <p className="text-xs tracking-[0.18em] uppercase text-[#2f8f45]">{title}</p>
                <p className="prose-quiet mt-3 text-sm">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 md:px-8">
        <p className="text-sm text-[#8a8175]">
          Service categories on the menu: {orbit.categories.map((c) => labelForCategory(c)).join(" · ")}
        </p>
        <div className="mt-12 bg-[#141210] px-8 py-14 text-white md:px-14">
          <h2 className="display text-4xl md:text-5xl">Come when you can stay a while.</h2>
          <Link href="/contact" className="btn-primary mt-8">
            Book an appointment
          </Link>
        </div>
      </section>
    </>
  );
}
