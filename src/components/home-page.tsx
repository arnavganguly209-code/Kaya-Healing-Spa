import { HeroMedia } from "@/components/hero-media";
import { HomeReviewsSlider } from "@/components/home-reviews-slider";
import { HomeVisitSection } from "@/components/home-visit-section";
import { Reveal } from "@/components/reveal";
import { TherapiesSection } from "@/components/therapies-section";
import { WhyKayaSection } from "@/components/why-kaya-section";
import { formatNpr, site } from "@/lib/content";
import { readOrbitContent } from "@/lib/orbit-store";
import { Flower2, Leaf, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function StonesIcon({ className = "text-[#F47B20]", size = 22 }: { className?: string; size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <ellipse cx="12" cy="6" rx="5" ry="2.2" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="12" cy="12" rx="6.2" ry="2.4" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="12" cy="18" rx="7.2" ry="2.6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function CareIcon({ className = "text-[#F47B20]", size = 22 }: { className?: string; size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M8 13c0-2 1.2-3.5 2.6-3.5 1 0 1.6.6 2 1.3.4-.7 1-1.3 2-1.3C16 9.5 17.2 11 17.2 13c0 2.6-2.4 4.6-5.2 6.2C9.2 17.6 8 15.6 8 13Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 8.2V5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12 6.2c1.2-1 2.4-1.2 3.2-.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

const featureIcons = [Flower2, Leaf, StonesIcon, CareIcon];

export function HomePage() {
  const orbit = readOrbitContent();
  const homePage = orbit.homePage;
  const services = orbit.services;
  const gallery = orbit.gallery;
  const hero = orbit.hero;
  const therapies = orbit.therapies;
  const whyKaya = orbit.whyKaya;
  const homeAbout = orbit.homeAbout;
  const featuredServices = services.slice(0, 6);
  const preview = gallery.slice(0, 6);

  return (
    <>
      <section className="relative isolate h-[100svh] min-h-[540px] max-h-[100svh] overflow-hidden bg-[#0a0a0a]">
        <div className="pointer-events-none absolute inset-0 z-0">
          <HeroMedia
            slides={hero.slides}
            display={hero.display}
            animation={hero.animation}
            intervalMs={hero.intervalMs}
            flipHorizontal={hero.flipHorizontal}
            objectPosition={hero.objectPosition}
            className="absolute inset-0"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,6,0.62)_0%,rgba(10,8,6,0.28)_22%,rgba(10,8,6,0.08)_45%,transparent_62%)]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#fafafa] via-[#fafafa]/80 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-h-[100svh] w-full max-w-[1440px] flex-col justify-end px-5 pb-3 pt-[64px] sm:px-8 sm:pt-[68px] md:px-10 lg:px-12 lg:pt-[108px] lg:pb-4 xl:px-14">
          <h1 className="sr-only">
            {hero.titleOrange} {hero.titleDark} — {site.name}
          </h1>
          <div className="relative z-20 w-full shrink-0">
            <div className="hero-feature-glass relative z-20 w-full shrink-0">
            <ul className="grid sm:grid-cols-2 lg:grid-cols-4">
              {hero.features.map((feature, index) => {
                const Icon = featureIcons[index % featureIcons.length];
                return (
                  <li
                    key={feature.title}
                    className="flex items-center gap-2.5 px-4 py-3.5 max-[900px]:py-3 sm:gap-4 sm:px-6 sm:py-5 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-[#f47b20]/10 sm:[&:not(:first-child)]:border-t-0 sm:[&:not(:first-child)]:lg:border-l sm:[&:not(:first-child)]:lg:border-[#f47b20]/15"
                  >
                    <Icon className="shrink-0 text-[#F47B20]" size={28} strokeWidth={1.3} />
                    <span className="min-w-0">
                      <span className="block text-[14px] font-bold leading-snug text-[#1a1512] sm:text-[15px]">{feature.title}</span>
                      <span className="text-[12px] font-medium leading-snug text-[#5c534a] sm:text-[13px]">{feature.text}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            </div>
          </div>
        </div>
      </section>

      <TherapiesSection
        eyebrow={therapies.eyebrow}
        titleOrange={therapies.titleOrange}
        titleDark={therapies.titleDark}
        intro={therapies.intro}
        image={therapies.image}
        imageAlt={therapies.imageAlt}
        cards={therapies.cards}
      />

      <WhyKayaSection data={whyKaya} />

      <section className="bg-[#f6f1e8]">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-20 md:px-8 lg:grid-cols-2 lg:py-28">
          <Reveal className="relative min-h-[420px]">
            <Image
              src={homeAbout.image}
              alt={homeAbout.imageAlt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              unoptimized={homeAbout.image.startsWith("/uploads/")}
            />
          </Reveal>
          <Reveal>
            <p className="eyebrow">{homeAbout.eyebrow}</p>
            <h2 className="display mt-4 text-5xl md:text-6xl">{homeAbout.title}</h2>
            <div className="prose-quiet mt-6 space-y-4">
              <p>{homeAbout.paragraph1}</p>
              <p>{homeAbout.paragraph2}</p>
            </div>
            <Link href={homeAbout.linkHref} className="btn-line mt-8">
              {homeAbout.linkLabel}
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{homePage.servicesEyebrow}</p>
            <h2 className="display mt-3 text-5xl md:text-6xl">{homePage.servicesTitle}</h2>
          </div>
          <Link href="/services" className="btn-line">View all services</Link>
        </div>
        <p className="mt-4 text-sm text-[#8a8175]">Prices are indicative placeholders until the spa confirms the live menu.</p>
        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {featuredServices.map((service) => (
            <article key={service.slug} className="group border border-[#e6dfd4] bg-white">
              <Link href={`/services/${service.slug}`} className="img-zoom relative block h-64">
                <Image src={service.image} alt={service.imageAlt} fill className="object-cover" sizes="(min-width: 1280px) 33vw, 100vw" />
              </Link>
              <div className="p-6">
                <p className="text-xs tracking-[0.16em] uppercase text-[#2f8f45]">{service.durationMinutes} min · from {formatNpr(service.priceFromNpr)}</p>
                <h3 className="mt-2 font-serif text-3xl">{service.name}</h3>
                <p className="prose-quiet mt-3 text-sm">{service.summary}</p>
                <Link href={`/services/${service.slug}`} className="btn-line mt-5">View treatment</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <HomeVisitSection visit={homePage.visit} />

      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-8">
        <p className="eyebrow">{homePage.packagesEyebrow}</p>
        <h2 className="display mt-3 text-5xl md:text-6xl">{homePage.packagesTitle}</h2>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {orbit.packages.slice(0, 4).map((item) => (
            <article key={item.slug} className="grid overflow-hidden border border-[#e6dfd4] bg-white md:grid-cols-5">
              <div className="relative min-h-56 md:col-span-2">
                <Image src={item.image} alt={item.imageAlt} fill className="object-cover" sizes="40vw" />
              </div>
              <div className="p-6 md:col-span-3">
                <p className="text-xs tracking-[0.16em] uppercase text-[#8a8175]">{item.durationLabel}</p>
                <h3 className="mt-2 font-serif text-3xl">{item.name}</h3>
                <p className="prose-quiet mt-3 text-sm">{item.summary}</p>
                <p className="mt-4 text-sm">
                  <span className="text-[#e8771a]">{formatNpr(item.priceNpr)}</span>
                  {item.compareAtNpr && (
                    <span className="ml-3 text-[#8a8175] line-through">{formatNpr(item.compareAtNpr)}</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-[#8a8175]">Indicative pricing</p>
                <Link href={`/contact?package=${item.slug}`} className="btn-primary mt-5">Book now</Link>
              </div>
            </article>
          ))}
        </div>
        <Link href="/packages" className="btn-line mt-10">All packages</Link>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-8">
        <p className="eyebrow">The visit</p>
        <h2 className="display mt-3 text-5xl">A wellness journey</h2>
        <ol className="mt-12 grid gap-8 md:grid-cols-4">
          {homePage.journey.map((step) => (
            <li key={step.step} className="border-t border-[#e6dfd4] pt-6">
              <p className="font-serif text-4xl text-[#e8771a]">{step.step}</p>
              <h3 className="mt-3 font-serif text-2xl">{step.title}</h3>
              <p className="prose-quiet mt-2 text-sm">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <HomeReviewsSlider
        eyebrow={homePage.reviewsEyebrow}
        title={homePage.reviewsTitle}
        disclaimer={homePage.reviewsDisclaimer}
        reviews={homePage.reviews}
        googleUrl={site.social.google}
      />

      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="display text-5xl">{homePage.galleryTitle}</h2>
          <Link href="/gallery" className="btn-line">Explore our gallery</Link>
        </div>
        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {preview.map((image) => (
            <Link key={image.id} href="/gallery" className="img-zoom mb-4 block break-inside-avoid">
              <Image src={image.src} alt={image.alt} width={image.width} height={image.height} className="h-auto w-full" />
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[#e6dfd4]">
        <div className="mx-auto grid max-w-[1440px] md:grid-cols-4">
          {homePage.benefits.map((item) => (
            <article key={item.title} className="border-[#e6dfd4] px-6 py-12 md:border-r md:last:border-r-0">
              <h3 className="text-xs tracking-[0.2em] uppercase text-[#2f8f45]">{item.title}</h3>
              <p className="prose-quiet mt-4 text-sm">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#141210] text-white">
        <Image
          src={homePage.cta.backgroundImage}
          alt=""
          fill
          className="object-cover opacity-30"
          unoptimized={homePage.cta.backgroundImage.startsWith("/uploads/")}
        />
        <div className="relative mx-auto max-w-3xl px-5 py-28 text-center md:py-36">
          <h2 className="display text-5xl md:text-6xl">{homePage.cta.title}</h2>
          <p className="mt-6 text-white/75">{homePage.cta.text}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={homePage.cta.primaryHref} className="btn-primary">
              {homePage.cta.primaryLabel}
            </Link>
            <Link href={homePage.cta.secondaryHref} className="btn-ghost">
              {homePage.cta.secondaryLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-10 px-5 py-24 md:px-8 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Visit</p>
          <h2 className="display mt-3 text-5xl">{site.name}</h2>
          <p className="mt-4 text-lg leading-relaxed">{site.addressLine}</p>
          <p className="mt-2 text-sm">
            <a href={`tel:${site.phoneTel}`} className="font-semibold hover:text-[#F47B20]">
              {orbit.phone || site.phone}
            </a>
          </p>
          <p className="prose-quiet mt-2 text-sm">{site.placeType} · {site.googleRating}★ on Google</p>
          <ul className="mt-6 space-y-2 text-sm">
            {site.hours.map((row) => (
              <li key={row.day}>{row.day}: {row.hours}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-[#8a8175]">{site.hoursNote}</p>
          <Link href="/contact" className="btn-primary mt-8">Request a time</Link>
        </div>
        <div className="min-h-[320px] bg-[#f6f1e8]">
          <iframe
            title={`Map — ${site.name}`}
            className="h-full min-h-[320px] w-full grayscale"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${site.mapEmbedQuery}&z=15&output=embed`}
          />
        </div>
      </section>
    </>
  );
}
