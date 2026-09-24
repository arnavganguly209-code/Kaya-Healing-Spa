import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About KAYA SPA",
  description:
    "The story, philosophy, and standards behind KAYA SPA, a luxury wellness spa in Kathmandu.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About KAYA SPA", description: "Wellness with intention in Kathmandu." },
};

const values = [
  ["Care", "Guests are greeted as people with a day behind them, not as a timetable."],
  ["Quality", "Treatments are simple, skilled, and finished properly."],
  ["Calm", "Rooms, voices, and pacing stay low."],
  ["Authenticity", "Ayurvedic and body rituals are offered plainly, without costume."],
  ["Professionalism", "Draping, hygiene, and timekeeping are part of the craft."],
];

const blocks = [
  {
    title: "Our philosophy",
    text: "Rest should feel earned by the room, not sold by the sentence. KAYA holds a traditional respect for oil, heat, and hands, and pairs it with hospitality that is modern and exact.",
  },
  {
    title: "Our approach",
    text: "We ask what you want from the visit, then build the hour around that answer. A trekker, a couple, and a guest with one free afternoon do not receive the same plan.",
  },
  {
    title: "What makes us different",
    text: "The difference is pacing. Treatments are not stacked so tightly that you dress in a hurry. Lounge time is part of the appointment, not a leftover.",
  },
  {
    title: "Therapist experience",
    text: "Therapists are briefed on your notes before you enter. Pressure is checked. Areas you want left alone stay untouched. Experience shows up as attention, not as a speech.",
  },
  {
    title: "Wellness environment",
    text: "Light is warm, corridors are quiet, and materials are natural: linen, wood, stone, and oil. The city stays outside.",
  },
  {
    title: "Hygiene & care",
    text: "Tables are reset fully between guests. Linens are fresh. Tools used on the skin are cleaned. If something does not look ready, the session waits.",
  },
  {
    title: "Personalized experience",
    text: "You can change pressure, shorten a stretch, or swap a scent. Packages can be adjusted when two treatments are a similar length. The menu is a starting point.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Wellness with intention"
        text="KAYA SPA is a Kathmandu house for guests who want skilled bodywork and a visit that respects their time and privacy."
        image="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2000&q=80"
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />
      <section className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-24 md:px-8 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">About KAYA SPA</p>
          <h2 className="display mt-4 text-5xl">Hospitality, then the treatment</h2>
          <p className="prose-quiet mt-6">
            The spa exists for people moving through Kathmandu — residents between workdays, travellers between flights, walkers coming down from the hills. The offer is not spectacle. It is a well-run room, a therapist who listens, and a sequence that finishes with you still feeling looked after.
          </p>
        </Reveal>
        <div className="relative min-h-[420px]">
          <Image
            src="https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?auto=format&fit=crop&w=1400&q=80"
            alt="A prepared treatment room"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </section>
      <section className="bg-[#f6f1e8]">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 md:grid-cols-2 md:px-8">
          {blocks.map((block) => (
            <Reveal key={block.title}>
              <h2 className="font-serif text-3xl">{block.title}</h2>
              <p className="prose-quiet mt-3">{block.text}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-8">
        <h2 className="display text-5xl">Brand values</h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-5">
          {values.map(([title, text]) => (
            <li key={title} className="border-t border-[#e6dfd4] pt-4">
              <p className="text-xs tracking-[0.18em] uppercase text-[#2f8f45]">{title}</p>
              <p className="prose-quiet mt-3 text-sm">{text}</p>
            </li>
          ))}
        </ul>
        <div className="mt-16 bg-[#141210] px-8 py-14 text-white md:px-14">
          <h2 className="display text-4xl md:text-5xl">Come when you can stay a while.</h2>
          <Link href="/contact" className="btn-primary mt-8">Book an Appointment</Link>
        </div>
      </section>
    </>
  );
}
