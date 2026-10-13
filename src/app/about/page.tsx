import { CATALOG_COMING_SOON_IMAGE } from "@/lib/catalog-images";
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

function pageImage(src: string | undefined) {
  if (!src?.trim()) return CATALOG_COMING_SOON_IMAGE;
  return src;
}

export default function AboutPage() {
  const orbit = readOrbitContent();
  const about = orbit.aboutPage;
  const storyParagraphs = about.story?.length ? about.story : [site.tagline];
  const storyImage = pageImage(about.storyImage || orbit.homeAbout.image);
  const storyAlt = about.storyImageAlt || orbit.homeAbout.imageAlt;
  const ownerPhoto = pageImage(about.owner.photo);
  const address = orbit.addressLine || site.addressLine;
  const values = about.values?.length
    ? about.values
    : [{ title: "Care", text: "Guests are greeted as people with a day behind them, not as a timetable." }];

  return (
    <>
      <PageHero
        eyebrow={orbit.pageCovers.about.eyebrow}
        title={orbit.pageCovers.about.title}
        tagline={orbit.pageCovers.about.tagline}
        text={orbit.pageCovers.about.text}
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <section className="mx-auto max-w-[900px] px-5 py-12 text-center md:px-8">
        <p className="eyebrow">{about.introEyebrow || "About us"}</p>
        <h2 className="display mt-3 text-4xl md:text-5xl">{about.introTitle || orbit.pageCovers.about.title}</h2>
        <p className="prose-quiet mx-auto mt-5 max-w-2xl text-base">{about.introLead || orbit.pageCovers.about.text}</p>
      </section>

      <section className="mx-auto max-w-[900px] px-5 py-16 md:px-8">
        <div className="rounded-2xl border border-[#e6dfd4] bg-[#f6f1e8] p-8 md:p-10">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[#F47B20] uppercase">Company details</p>
          <h2 className="mt-2 font-serif text-3xl">{site.name}</h2>
          <p className="mt-1 text-sm text-[#6B6B6B]">{about.companyTagline || site.placeType}</p>
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[#8a8175]">Address</dt>
              <dd className="mt-1 leading-relaxed">{address}</dd>
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
          <p className="eyebrow">{about.storyEyebrow || "Our story"}</p>
          <h2 className="display mt-4 text-5xl">{about.storyTitle || "Hospitality, then the treatment"}</h2>
          <div className="prose-quiet mt-6 space-y-4">
            {storyParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
        <div className="relative min-h-[420px] overflow-hidden rounded-2xl">
          <Image
            src={storyImage}
            alt={storyAlt}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
            unoptimized
          />
        </div>
      </section>

      <section className="bg-[#141210] text-white">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-16 md:grid-cols-[0.9fr_1.1fr] md:px-8">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl">
            <Image
              src={ownerPhoto}
              alt={about.owner.photoAlt}
              fill
              className="object-cover"
              sizes="400px"
              unoptimized
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
        <h2 className="display text-4xl md:text-5xl">{about.partnersTitle || "Partners & standards"}</h2>
        <p className="prose-quiet mt-4 max-w-2xl text-sm">{about.partnersLead}</p>
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {(about.logos?.length ? about.logos : []).map((logo) => (
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
            {values.map((item) => (
              <li key={item.title} className="border-t border-[#e6dfd4] pt-4">
                <p className="text-xs tracking-[0.18em] uppercase text-[#2f8f45]">{item.title}</p>
                <p className="prose-quiet mt-3 text-sm">{item.text}</p>
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
          <h2 className="display text-4xl md:text-5xl">{about.ctaTitle || "Come when you can stay a while."}</h2>
          <Link href={about.ctaHref || "/contact"} className="btn-primary mt-8">
            {about.ctaLabel || "Book an appointment"}
          </Link>
        </div>
      </section>
    </>
  );
}
