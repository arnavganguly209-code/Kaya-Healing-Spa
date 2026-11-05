import { phoneToTelHref, site } from "@/lib/content";
import { mapEmbedUrl } from "@/lib/map-embed";
import type { SpaBranch } from "@/lib/spa-branches";
import Link from "next/link";

export function BranchShowcase({
  branches,
  eyebrow = "Our houses",
  title = "Two places to pause",
  intro = "Online booking is confirmed in Kathmandu. Lumbini welcomes you by phone, in the birthplace of the Buddha.",
}: {
  branches: SpaBranch[];
  eyebrow?: string;
  title?: string;
  intro?: string;
}) {
  if (!branches.length) return null;

  return (
    <section className="border-t border-[#e6dfd4] bg-[#f6f1e8]">
      <div className="mx-auto max-w-[1440px] px-4 py-14 md:px-8 md:py-24">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display mt-3 max-w-3xl text-[1.85rem] sm:text-5xl md:text-6xl">{title}</h2>
        <p className="prose-quiet mt-4 max-w-2xl text-base">{intro}</p>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {branches.map((branch) => {
            const mapsHref = branch.mapsLink?.trim() || mapEmbedUrl(branch.mapEmbedQuery);
            return (
              <article
                key={branch.id}
                className="flex min-w-0 flex-col overflow-hidden rounded-[28px] border border-[#e6dfd4] bg-white shadow-[0_24px_60px_-36px_rgba(20,18,16,0.45)]"
              >
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <p className="text-[11px] font-semibold tracking-[0.22em] text-[#F47B20] uppercase">
                    {branch.bookingLocation ? "Online booking" : "Visit by phone"}
                  </p>
                  <h3 className="mt-3 font-serif text-4xl text-[#171717]">{branch.place}</h3>
                  <p className="mt-1 text-sm text-[#6B6B6B]">{branch.name}</p>
                  {branch.quote?.trim() ? (
                    <p className="mt-5 font-serif text-xl leading-snug text-[#8a5a2b] italic">“{branch.quote.trim()}”</p>
                  ) : null}
                  <p className="prose-quiet mt-4 flex-1 whitespace-pre-line text-sm leading-7">{branch.description}</p>
                  <p className="mt-6 text-sm leading-relaxed text-[#171717]">{branch.addressLine}</p>
                  <a href={`tel:${phoneToTelHref(branch.phone)}`} className="mt-2 inline-block text-lg font-semibold hover:text-[#F47B20]">
                    {branch.phone}
                  </a>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {branch.bookingLocation ? (
                      <Link href="/contact" className="btn-primary">
                        Book this house
                      </Link>
                    ) : (
                      <a href={`tel:${phoneToTelHref(branch.phone)}`} className="btn-primary">
                        Call {branch.place}
                      </a>
                    )}
                    <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                      Google Maps
                    </a>
                  </div>
                </div>
                <div className="min-h-[220px] border-t border-[#efe8e0] bg-[#faf7f2] sm:min-h-[260px]">
                  <iframe
                    title={`Map — ${branch.place}`}
                    className="h-[220px] w-full grayscale sm:h-[260px]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={mapEmbedUrl(branch.mapEmbedQuery)}
                  />
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-6 text-xs text-[#8a8175]">
          {site.hours.map((row) => `${row.day}: ${row.hours}`).join(" · ")} {site.hoursNote}
        </p>
      </div>
    </section>
  );
}
