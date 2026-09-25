import { site } from "@/lib/content";
import Link from "next/link";

export function CompanyContactCard({ phone }: { phone?: string }) {
  const tel = phone || site.phone;
  const href = tel.startsWith("+") ? tel.replace(/\s/g, "") : site.phoneTel.replace(/\s/g, "");
  return (
    <aside className="rounded-2xl border border-[#e6dfd4] bg-[#f6f1e8] p-8">
      <p className="text-[11px] font-semibold tracking-[0.22em] text-[#F47B20] uppercase">Visit us</p>
      <h2 className="mt-2 font-serif text-3xl">{site.name}</h2>
      <p className="mt-1 text-sm text-[#6B6B6B]">{site.placeType}</p>
      <p className="mt-4 text-sm leading-relaxed">{site.addressLine}</p>
      <p className="mt-4">
        <a href={`tel:${href}`} className="text-lg font-semibold text-[#171717] hover:text-[#F47B20]">
          {tel}
        </a>
      </p>
      <p className="mt-2 text-sm text-[#2f8f45]">
        {site.googleRating} ★ · {site.googleReviewCount.toLocaleString()} Google reviews
      </p>
      <ul className="mt-6 space-y-2 text-sm">
        {site.hours.map((row) => (
          <li key={row.day}>
            <span className="text-[#8a8175]">{row.day}:</span> {row.hours}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-[#8a8175]">{site.hoursNote}</p>
      {site.social.google.startsWith("https://") && (
        <Link href={site.social.google} target="_blank" rel="noreferrer" className="btn-line mt-6 inline-flex">
          Open on Google Maps
        </Link>
      )}
      <div className="mt-6 min-h-[240px] overflow-hidden rounded-xl border border-[#e6dfd4]">
        <iframe
          title={`Map — ${site.name}`}
          className="h-64 w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${site.mapEmbedQuery}&z=15&output=embed`}
        />
      </div>
    </aside>
  );
}
