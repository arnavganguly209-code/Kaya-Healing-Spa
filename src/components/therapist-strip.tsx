import type { OrbitTherapist } from "@/lib/orbit-types";
import { formatNpr } from "@/lib/content";
import Image from "next/image";
import Link from "next/link";

export function TherapistStrip({
  therapists,
  serviceSlug,
  packageSlug,
  title = "Choose your therapist",
  intro = "Scroll to meet the team. Book with the therapist whose style fits your visit.",
}: {
  therapists: OrbitTherapist[];
  serviceSlug?: string;
  packageSlug?: string;
  title?: string;
  intro?: string;
}) {
  if (!therapists.length) return null;

  function bookHref(therapist: OrbitTherapist) {
    const params = new URLSearchParams();
    if (serviceSlug) params.set("service", serviceSlug);
    if (packageSlug) params.set("package", packageSlug);
    params.set("therapist", therapist.slug);
    params.set("mode", serviceSlug ? "service" : packageSlug ? "package" : "therapist");
    return `/contact?${params.toString()}`;
  }

  return (
    <section className="border-t border-[#e6dfd4] bg-[#faf7f3]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-8">
        <p className="eyebrow">{title}</p>
        <p className="prose-quiet mt-3 max-w-2xl text-sm">{intro}</p>
        <div className="mt-8 flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:thin]">
          {therapists.map((therapist) => (
            <article
              key={therapist.slug}
              className="flex w-[min(85vw,280px)] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-[#e6dfd4] bg-white shadow-[0_12px_32px_rgba(23,23,23,0.06)]"
            >
              <div className="relative h-56">
                <Image
                  src={therapist.photo}
                  alt={therapist.photoAlt}
                  fill
                  className="object-cover object-top"
                  sizes="280px"
                  unoptimized={therapist.photo.startsWith("/uploads/")}
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-[#F47B20] uppercase">{therapist.title}</p>
                <h3 className="mt-1 font-serif text-2xl text-[#171717]">{therapist.name}</h3>
                <p className="mt-2 text-xs font-medium text-[#6B6B6B]">{therapist.experience}</p>
                <p className="prose-quiet mt-3 flex-1 text-sm leading-relaxed">{therapist.description}</p>
                <p className="mt-4 font-serif text-xl text-[#171717]">From {formatNpr(therapist.priceFromNpr)}</p>
                <Link href={bookHref(therapist)} className="btn-primary mt-4 w-full text-center">
                  Book now
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
