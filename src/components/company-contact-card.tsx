import { site } from "@/lib/content";
import Link from "next/link";

function normalizeWhatsAppHref(number: string) {
  const digits = number.replace(/\D/g, "");
  const withCountry = digits.startsWith("977") ? digits : `977${digits.replace(/^0+/, "")}`;
  const message = encodeURIComponent("Hello Kaya Healing Spa, I would like to inquire about an appointment.");
  return `https://wa.me/${withCountry}?text=${message}`;
}

function isHttpUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}

export function CompanyContactCard({
  phone,
  email,
  whatsapp,
  googleReviewsUrl,
  tripadvisorUrl,
}: {
  phone?: string;
  email?: string;
  whatsapp?: string;
  googleReviewsUrl?: string;
  tripadvisorUrl?: string;
}) {
  const tel = phone || site.phone;
  const digits = tel.replace(/\D/g, "");
  const telHref = tel.startsWith("+")
    ? tel.replace(/\s/g, "")
    : digits.startsWith("977")
      ? `+${digits}`
      : `+977${digits.replace(/^0+/, "")}`;
  const mail = (email || site.email).trim();
  const wa = (whatsapp || site.whatsapp).trim();
  const reviewsUrl = (googleReviewsUrl || site.social.google).trim();
  const tripUrl = (tripadvisorUrl || site.social.tripadvisor).trim();
  const reviewsLinkReady = isHttpUrl(reviewsUrl);
  const tripLinkReady = isHttpUrl(tripUrl);
  const mailReady = mail.includes("@") && !mail.includes("example.com");
  const waReady = wa.replace(/\D/g, "").length >= 8;

  return (
    <aside className="rounded-2xl border border-[#e6dfd4] bg-[#f6f1e8] p-8">
      <p className="text-[11px] font-semibold tracking-[0.22em] text-[#F47B20] uppercase">Visit us</p>
      <h2 className="mt-2 font-serif text-3xl">{site.name}</h2>
      <p className="mt-1 text-sm text-[#6B6B6B]">{site.placeType}</p>
      <p className="mt-4 text-sm leading-relaxed">{site.addressLine}</p>
      <p className="mt-4 text-sm">
        <span className="text-[#8a8175]">Phone: </span>
        <a href={`tel:${telHref}`} className="text-lg font-semibold text-[#171717] hover:text-[#F47B20]">
          {tel}
        </a>
      </p>
      <p className="mt-2 text-sm">
        <span className="text-[#8a8175]">WhatsApp: </span>
        {waReady ? (
          <a
            href={normalizeWhatsAppHref(wa)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#171717] hover:text-[#25D366]"
          >
            {wa}
          </a>
        ) : (
          <span>{wa || "—"}</span>
        )}
      </p>
      {mailReady ? (
        <p className="mt-2 text-sm">
          <span className="text-[#8a8175]">Email: </span>
          <a href={`mailto:${mail}`} className="font-medium text-[#171717] underline decoration-[#171717]/30 underline-offset-2 hover:text-[#F47B20]">
            {mail}
          </a>
        </p>
      ) : (
        <p className="mt-2 text-sm text-[#8a8175]">Email: configure reception email in admin</p>
      )}
      <p className="mt-2 text-sm">
        {reviewsLinkReady ? (
          <a
            href={reviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#2f8f45] underline decoration-[#2f8f45]/40 underline-offset-2 hover:text-[#1e6b32]"
          >
            Write a Google review
          </a>
        ) : (
          <span className="text-[#8a8175]">Google review link — set in admin</span>
        )}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {waReady ? (
          <a
            href={normalizeWhatsAppHref(wa)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold tracking-wide text-white uppercase hover:bg-[#1ebe5d]"
          >
            WhatsApp
          </a>
        ) : null}
        {tripLinkReady ? (
          <a
            href={tripUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-[#00af87] px-4 py-2 text-xs font-bold tracking-wide text-[#007a5c] uppercase hover:bg-white"
          >
            TripAdvisor
          </a>
        ) : null}
        <Link href="/services" className="inline-flex items-center rounded-full border border-[#F47B20] px-4 py-2 text-xs font-bold tracking-wide text-[#F47B20] uppercase hover:bg-white">
          Book a treatment
        </Link>
      </div>
      <ul className="mt-6 space-y-2 text-sm">
        {site.hours.map((row) => (
          <li key={row.day}>
            <span className="text-[#8a8175]">{row.day}:</span> {row.hours}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-[#8a8175]">{site.hoursNote}</p>
      <p className="mt-2 text-xs text-[#8a8175]">Appointments from 8:00 AM; last start 11:45 PM (15-minute intervals).</p>
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
