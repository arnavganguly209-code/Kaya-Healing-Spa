import type { OrbitTherapist } from "@/lib/orbit-types";
import { TherapistPortrait } from "@/components/therapist-portrait";
import Link from "next/link";

export function TherapistStrip({
  therapists,
  title = "Meet our therapists",
  intro = "Choose someone whose style fits you, then pick a treatment or package when you book.",
}: {
  therapists: OrbitTherapist[];
  serviceSlug?: string;
  packageSlug?: string;
  title?: string;
  intro?: string;
}) {
  if (!therapists.length) return null;

  return (
    <section className="border-t border-[#e6dfd4] bg-[#faf7f3]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-8">
        <p className="eyebrow">{title}</p>
        <p className="prose-quiet mt-3 max-w-2xl text-sm">{intro}</p>
        <div className="mt-8 flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:thin]">
          {therapists.map((therapist) => (
            <article
              key={therapist.slug}
              className="flex w-[min(85vw,260px)] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-[#e6dfd4] bg-white shadow-[0_12px_32px_rgba(23,23,23,0.06)]"
            >
              <div className="p-4 pb-0">
                <TherapistPortrait src={therapist.photo} alt={therapist.photoAlt} sizes="260px" />
              </div>
              <div className="flex flex-1 flex-col p-5 pt-4">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-[#F47B20] uppercase">{therapist.title}</p>
                <h3 className="mt-1 font-serif text-2xl text-[#171717]">{therapist.name}</h3>
                <p className="mt-2 text-xs font-medium text-[#6B6B6B]">{therapist.experience}</p>
                <p className="prose-quiet mt-3 flex-1 text-sm leading-relaxed">{therapist.description}</p>
                <Link
                  href={`/contact?therapist=${encodeURIComponent(therapist.slug)}&mode=therapist`}
                  className="btn-primary mt-5 w-full text-center"
                >
                  Book therapist
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
