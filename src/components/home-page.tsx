import { Reveal } from "@/components/reveal";
import { formatNpr, gallery, packages, reviews, services, site } from "@/lib/content";
import { Calendar, Droplets, Flower2, Leaf, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const trust = [
  { icon: UserRound, title: "Experienced therapists", text: "Sessions are led by therapists who adjust pressure and pace with you, not against a script." },
  { icon: Sparkles, title: "A considered visit", text: "Rooms, timing, and sequences are arranged so the hour feels settled from the moment you arrive." },
  { icon: Leaf, title: "Treatments shaped to you", text: "Tell us what you need — quiet, recovery, or a longer ritual — and the booking follows that." },
  { icon: ShieldCheck, title: "Clean, quiet rooms", text: "Linens, tools, and surfaces are prepared between every guest. The rooms stay simple and calm." },
];

const why = [
  ["Personalized care", "Each booking starts with what you want from the hour."],
  ["Experienced therapists", "Pressure, draping, and pace are discussed before work begins."],
  ["Premium products", "Oils and scrubs are chosen for comfort and a light, clean finish."],
  ["Serene environment", "Soft light, low voices, and rooms kept free of clutter."],
  ["Hygiene & standards", "Fresh linen and cleaned tools for every treatment."],
  ["Kathmandu", "A city spa for travellers and residents who want a proper pause."],
];

const journey = [
  ["01", "Arrive", "You are greeted, offered water, and given a few quiet minutes before the room."],
  ["02", "Relax", "The consultation is short. You set pressure, scent, and anything to avoid."],
  ["03", "Restore", "The treatment follows the plan you agreed — unhurried, and draped throughout."],
  ["04", "Renew", "You dress in your own time and sit with tea before stepping back outside."],
];

const benefits = [
  ["Relaxation", "An hour with nowhere else to be, paced slowly enough to feel it."],
  ["Mental clarity", "Less noise, a closed door, and time that is not split across a screen."],
  ["Body recovery", "Practical work for legs, back, and shoulders after travel or trekking."],
  ["Natural renewal", "Warm oil, simple scrubs, and heat used with a light hand."],
];

const pillars = [
  ["Restore", "Bring the body back from the day it has had."],
  ["Release", "Let held shoulders, jaws, and pace soften."],
  ["Renew", "Leave with more room in the afternoon than you arrived with."],
];

function TherapyCard({
  href,
  image,
  alt,
  icon: Icon,
  title,
  text,
}: {
  href: string;
  image: string;
  alt: string;
  icon: typeof Flower2;
  title: string;
  text: string;
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(40,24,8,0.08)]">
      <div className="relative h-36 sm:h-40 lg:h-[148px]">
        <Image src={image} alt={alt} fill className="object-cover" sizes="(min-width: 1024px) 22vw, 50vw" />
      </div>
      <div className="relative flex flex-1 flex-col px-4 pb-4 pt-5">
        <span className="absolute -top-5 left-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#f3d7c2] bg-white text-[#e8771a]">
          <Icon size={18} strokeWidth={1.6} />
        </span>
        <h3 className="text-[15px] font-semibold text-[#1a1614]">{title}</h3>
        <p className="mt-2 flex-1 text-[13px] leading-5 text-[#6d665e]">{text}</p>
        <Link href={href} className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-[#e8771a] px-4 py-2 text-xs font-medium text-white hover:bg-[#d06812]">
          Learn More <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Flower2;
  title: string;
  text: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <Icon className="mt-0.5 shrink-0 text-[#e8771a]" size={22} strokeWidth={1.5} />
      <span>
        <span className="block text-sm font-semibold text-[#1a1614]">{title}</span>
        <span className="text-sm text-[#8d857c]">{text}</span>
      </span>
    </li>
  );
}

export function HomePage() {
  const featuredServices = services.slice(0, 6);
  const preview = gallery.slice(0, 6);

  return (
    <>
      <section className="relative bg-[#fffdfb] pt-[86px]">
        <div className="relative min-h-[560px] overflow-hidden lg:min-h-[640px]">
          <Image
            src="/hero/kaya-hero-uhd.png"
            alt="A therapist giving a guest a massage in a bright KAYA SPA treatment room"
            fill
            priority
            className="object-cover object-[78%_center]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#fffdfb_0%,#fffdfb_34%,rgba(255,253,251,0.88)_46%,rgba(255,253,251,0.2)_62%,transparent_74%)]" />
          <div className="relative z-10 mx-auto flex min-h-[560px] max-w-[1280px] items-center px-6 py-12 lg:min-h-[640px] lg:px-8">
            <div className="max-w-[520px]">
              <p className="flex items-center gap-4 text-[11px] font-medium tracking-[0.28em] text-[#9a9188]">
                A COMPLETE WELLNESS EXPERIENCE
                <span className="h-px w-14 bg-[#e8771a]" />
              </p>
              <h1
                className="mt-4 text-[64px] leading-[0.9] font-semibold tracking-[-0.03em] text-[#1a1614] sm:text-[84px] lg:text-[92px]"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                <span className="text-[#e8771a]">Kaya</span> Spa
              </h1>
              <p className="mt-5 font-serif text-[28px] leading-tight text-[#1a1614] sm:text-[32px]">
                Heal Your Body, Calm Your Mind
              </p>
              <p className="mt-4 max-w-[430px] text-[15px] leading-7 text-[#5c564f]">
                Experience the perfect blend of traditional therapies and modern wellness in a serene and peaceful environment. Rejuvenate, relax and restore your natural balance.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/services" className="inline-flex items-center gap-2 rounded-full bg-[#e8771a] px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#d06812]">
                  Explore Treatments <span aria-hidden>→</span>
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-[#eadfd4] bg-white px-6 py-3 text-sm font-medium text-[#1a1614] hover:border-[#e8771a]">
                  <Calendar size={16} />
                  Book Your Experience
                </Link>
              </div>
              <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-4 text-[13px] leading-tight text-[#1a1614]">
                <li className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e4ddd4]"><Flower2 size={18} strokeWidth={1.4} /></span>
                  Traditional<br />Therapies
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e4ddd4]"><Sparkles size={18} strokeWidth={1.4} /></span>
                  Relaxation<br />&amp; Healing
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e4ddd4]"><Leaf size={18} strokeWidth={1.4} /></span>
                  Natural<br />Wellness
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-[#f3ebe3] bg-[#fffdfb]">
          <ul className="mx-auto grid max-w-[1280px] gap-6 px-6 py-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
            <Feature icon={Flower2} title="Massage Therapy" text="Release tension, restore balance" />
            <Feature icon={Leaf} title="Body Treatments" text="Naturally rejuvenate your body" />
            <Feature icon={Sparkles} title="Wellness Rituals" text="Ancient wisdom, modern care" />
            <Feature icon={Flower2} title="Personalized Care" text="Tailored to your unique needs" />
          </ul>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#fffaf6] px-4 py-8 sm:px-6 lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:px-10 lg:py-6">
        <div className="pointer-events-none absolute -left-8 bottom-8 hidden h-40 w-40 rounded-full bg-[#e8f5e6] opacity-80 blur-2xl lg:block" />
        <div className="relative mx-auto flex w-full max-w-[1240px] flex-1 flex-col justify-center">
          <div className="grid items-center gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
            <div>
              <p className="flex items-center gap-3 text-[11px] font-medium tracking-[0.28em] text-[#8d857c]">
                OUR SIGNATURE TREATMENTS
                <span className="h-px w-16 bg-[#e8771a]" />
              </p>
              <h2
                className="mt-3 text-4xl leading-[0.95] font-semibold tracking-[-0.03em] text-[#1a1614] sm:text-5xl lg:text-[56px]"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                <span className="text-[#e8771a]">Natural Therapies</span>
                <br />
                for a Healthier You
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#5c564f] sm:text-[15px]">
                Experience a carefully crafted range of traditional and modern therapies designed to relax your body, calm your mind, and restore your natural balance.
              </p>
            </div>
            <div className="relative h-44 overflow-hidden rounded-2xl sm:h-56 lg:h-[220px]">
              <Image
                src="/therapies/therapies-still.png"
                alt="Rolled towels, a candle, and flowers in the spa"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 46vw, 100vw"
              />
            </div>
          </div>
          <div className="relative z-10 mt-6 grid gap-4 sm:grid-cols-2 lg:-mt-8 lg:grid-cols-4 lg:gap-5">
            <TherapyCard
              href="/services/signature-massage"
              image="/therapies/card-massage.png"
              alt="Guest receiving a traditional massage"
              icon={Flower2}
              title="Traditional Massage"
              text="Release tension, relieve stress and restore your natural balance with expert massage techniques."
            />
            <TherapyCard
              href="/services/shirodhara"
              image="/therapies/card-ayurveda.png"
              alt="Warm oil poured during an Ayurvedic treatment"
              icon={Droplets}
              title="Ayurvedic Therapy"
              text="Ancient healing practices to detoxify, rejuvenate and promote complete wellness."
            />
            <TherapyCard
              href="/services/calm-facial"
              image="/therapies/card-facial.png"
              alt="Guest resting during a facial"
              icon={Sparkles}
              title="Facial Treatments"
              text="Rejuvenate your skin with natural care and professional skincare therapies."
            />
            <TherapyCard
              href="/services/hot-stone"
              image="/therapies/card-stones.png"
              alt="Warm stones prepared for hot stone therapy"
              icon={Flower2}
              title="Hot Stone Therapy"
              text="Deep relaxation, improve circulation and relieve muscle tension with warm stone therapy."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <p className="eyebrow">KAYA SPA</p>
          <h2 className="display mt-4 max-w-3xl text-5xl md:text-6xl">Wellness, reimagined</h2>
          <p className="prose-quiet mt-6 max-w-2xl text-lg">
            Traditional oil work and contemporary hospitality sit in the same room here. The visit is personal, the setting is quiet, and nothing is asked of you except to arrive.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <item.icon className="text-[#2f8f45]" strokeWidth={1.25} />
              <h3 className="mt-4 font-serif text-2xl">{item.title}</h3>
              <p className="prose-quiet mt-3 text-sm">{item.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-[#f6f1e8]">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-20 md:px-8 lg:grid-cols-2 lg:py-28">
          <Reveal className="relative min-h-[420px]">
            <Image
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=80"
              alt="Spa stones and folded towels"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </Reveal>
          <Reveal>
            <p className="eyebrow">About</p>
            <h2 className="display mt-4 text-5xl md:text-6xl">A spa with a slower standard</h2>
            <div className="prose-quiet mt-6 space-y-4">
              <p>
                KAYA SPA was imagined for Kathmandu guests who already know what a hurried treatment feels like. The philosophy is simple: hospitality first, then skilled bodywork, then enough time afterward that the benefit is not lost in the lobby.
              </p>
              <p>
                Wellness here means practical care — pressure you agree to, oil that is warm, rooms that smell clean rather than loud, and a therapist who listens before they begin.
              </p>
            </div>
            <Link href="/about" className="btn-line mt-8">Discover KAYA SPA</Link>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Signature services</p>
            <h2 className="display mt-3 text-5xl md:text-6xl">Selected treatments</h2>
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

      <section className="relative bg-[#141210] text-white">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:px-8 lg:grid-cols-12 lg:py-32">
          <div className="relative min-h-[460px] lg:col-span-7">
            <Image
              src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1600&q=80"
              alt="Guest resting during a massage"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 55vw, 100vw"
            />
          </div>
          <div className="lg:col-span-5 lg:-ml-16 lg:mt-24 lg:bg-[#141210] lg:p-10">
            <Flower2 className="text-[#2f8f45]" strokeWidth={1.25} />
            <h2 className="display mt-4 text-5xl">More than a massage</h2>
            <p className="mt-5 text-white/70">
              A single treatment can be wonderful. KAYA is arranged for the whole visit — arrival, the work itself, and the quiet that follows — so relaxation is not squeezed into the last ten minutes.
            </p>
            <ul className="mt-8 space-y-6">
              {pillars.map(([title, text]) => (
                <li key={title}>
                  <p className="text-xs tracking-[0.2em] uppercase text-[#e8771a]">{title}</p>
                  <p className="mt-1 text-white/80">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-8">
        <p className="eyebrow">Packages</p>
        <h2 className="display mt-3 text-5xl md:text-6xl">Featured sequences</h2>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {packages.slice(0, 4).map((item) => (
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

      <section className="bg-[#1c1a17] text-[#f6f1e8]">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-8">
          <h2 className="display text-5xl md:text-6xl">Why choose KAYA SPA</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {why.map(([title, text]) => (
              <div key={title} className="border-t border-white/15 pt-5">
                <h3 className="font-serif text-2xl">{title}</h3>
                <p className="mt-2 text-sm text-white/65">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-8">
        <p className="eyebrow">The visit</p>
        <h2 className="display mt-3 text-5xl">A wellness journey</h2>
        <ol className="mt-12 grid gap-8 md:grid-cols-4">
          {journey.map(([n, title, text]) => (
            <li key={n} className="border-t border-[#e6dfd4] pt-6">
              <p className="font-serif text-4xl text-[#e8771a]">{n}</p>
              <h3 className="mt-3 font-serif text-2xl">{title}</h3>
              <p className="prose-quiet mt-2 text-sm">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-[#f6f1e8]">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Reviews</p>
              <h2 className="display mt-3 text-5xl">Stories of relaxation</h2>
            </div>
            <Link href="/contact#reviews" className="btn-line">Read more reviews</Link>
          </div>
          <p className="mt-4 max-w-xl text-sm text-[#8a8175]">
            These cards are placeholders. They are not guest reviews and are not sourced from Google or TripAdvisor.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <blockquote key={review.id} className={`bg-white p-8 ${index === 0 ? "lg:col-span-2" : ""}`}>
                <p className="text-xs tracking-[0.16em] uppercase text-[#e8771a]">Sample layout</p>
                <p className="mt-4 font-serif text-2xl leading-snug">“{review.text}”</p>
                <footer className="mt-6 text-sm text-[#8a8175]">{review.name}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="display text-5xl">Gallery</h2>
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
          {benefits.map(([title, text]) => (
            <article key={title} className="border-[#e6dfd4] px-6 py-12 md:border-r md:last:border-r-0">
              <h3 className="text-xs tracking-[0.2em] uppercase text-[#2f8f45]">{title}</h3>
              <p className="prose-quiet mt-4 text-sm">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#141210] text-white">
        <Image
          src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1800&q=80"
          alt=""
          fill
          className="object-cover opacity-30"
        />
        <div className="relative mx-auto max-w-3xl px-5 py-28 text-center md:py-36">
          <h2 className="display text-5xl md:text-6xl">Your time to unwind starts here.</h2>
          <p className="mt-6 text-white/75">Step away from the pace of everyday life and give yourself time to restore.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn-primary">Book an Appointment</Link>
            <Link href="/services" className="btn-ghost">Explore Treatments</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-10 px-5 py-24 md:px-8 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Visit</p>
          <h2 className="display mt-3 text-5xl">KAYA SPA</h2>
          <p className="mt-4 text-lg">{site.city}</p>
          <p className="prose-quiet mt-2 text-sm">A street address will be published when the spa confirms it. Until then, use the booking form and we will share directions.</p>
          <ul className="mt-6 space-y-2 text-sm">
            <li>Phone: {site.phone || "Shared with your confirmation"}</li>
            <li>Email: {site.email || "Shared with your confirmation"}</li>
            {site.hours.map((row) => (
              <li key={row.day}>{row.day}: {row.hours}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-[#8a8175]">{site.hoursNote}</p>
          <Link href="/contact" className="btn-primary mt-8">Request a time</Link>
        </div>
        <div className="min-h-[320px] bg-[#f6f1e8]">
          <iframe
            title="Map of Kathmandu"
            className="h-full min-h-[320px] w-full grayscale"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=Kathmandu%20Nepal&z=12&output=embed"
          />
        </div>
      </section>
    </>
  );
}
