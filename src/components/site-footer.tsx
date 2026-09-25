import { Logo } from "@/components/logo";
import { site } from "@/lib/content";
import { readOrbitContent } from "@/lib/orbit-store";
import Link from "next/link";

const explore = [
  ["Home", "/"],
  ["Services", "/services"],
  ["Packages", "/packages"],
  ["Gallery", "/gallery"],
  ["Blog", "/blog"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

const treatments = [
  ["Massage", "/services?category=massage"],
  ["Ayurvedic", "/services?category=ayurvedic"],
  ["Thai", "/services/thai-therapy"],
  ["Aromatherapy", "/services/aromatherapy"],
  ["Deep Tissue", "/services/deep-tissue"],
  ["Wellness Rituals", "/packages"],
];

export function SiteFooter() {
  const orbit = readOrbitContent();
  const brand = orbit.footerBrand || site.name;
  return (
    <footer className="relative overflow-hidden bg-[#12100e] text-[#f6f1e8]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F47B20]/80 to-transparent" />
      <div className="pointer-events-none absolute -left-32 top-0 h-64 w-64 rounded-full bg-[#F47B20]/10 blur-3xl" />
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 md:grid-cols-2 md:px-10 lg:grid-cols-4 lg:gap-14">
        <div>
          <Logo />
          <p className="mt-5 font-serif text-2xl text-white">{brand}</p>
          <p className="mt-2 text-xs tracking-[0.22em] uppercase text-[#F47B20]">{site.tagline}</p>
          <p className="mt-5 max-w-xs text-sm leading-7 text-white/65">{orbit.footerText}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.24em] text-[#F47B20] uppercase">Explore</p>
          <ul className="mt-5 space-y-3 text-sm text-white/78">
            {explore.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.24em] text-[#F47B20] uppercase">Treatments</p>
          <ul className="mt-5 space-y-3 text-sm text-white/78">
            {treatments.map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="transition hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.24em] text-[#F47B20] uppercase">Contact</p>
          <ul className="mt-5 space-y-3 text-sm text-white/78">
            <li>{site.city}</li>
            <li>
              <a href={`tel:${(orbit.phone || site.phone).replace(/\s/g, "")}`} className="hover:text-white">
                {orbit.phone || site.phone}
              </a>
            </li>
            {orbit.email ? <li>{orbit.email}</li> : null}
            {site.hours.map((row) => (
              <li key={row.day}>
                {row.day}: {row.hours}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[11px] tracking-[0.18em] text-white/45 uppercase">Wellness updates</p>
          <Link
            href="/contact#newsletter"
            className="mt-3 inline-flex rounded-full bg-[#F47B20] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#e06d12]"
          >
            Join the list
          </Link>
          <div className="mt-8 flex flex-wrap gap-4 text-[11px] tracking-[0.14em] text-white/50 uppercase">
            {(
              [
                ["Instagram", site.social.instagram],
                ["Facebook", site.social.facebook],
                ["TikTok", site.social.tiktok],
                ["Google", site.social.google],
                ["TripAdvisor", site.social.tripadvisor],
              ] as const
            )
              .filter(([, href]) => href.startsWith("https://"))
              .map(([label, href]) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" className="hover:text-white">
                  {label}
                </a>
              ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 py-7 text-xs text-white/50 md:flex-row md:items-center md:justify-between md:px-10">
          <p>© {new Date().getFullYear()} {brand}. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="hover:text-white/80">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white/80">
              Terms & Conditions
            </Link>
            <Link href="/cookies" className="hover:text-white/80">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
