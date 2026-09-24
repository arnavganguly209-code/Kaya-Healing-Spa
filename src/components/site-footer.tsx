import { Logo } from "@/components/logo";
import { site } from "@/lib/content";
import Link from "next/link";

const explore = [
  ["Home", "/"],
  ["About", "/about"],
  ["Services", "/services"],
  ["Packages", "/packages"],
  ["Gallery", "/gallery"],
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
  return (
    <footer className="bg-[#141210] text-[#f6f1e8]">
      <div className="h-px w-full bg-gradient-to-r from-[#e8771a] via-[#2f8f45] to-transparent" />
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 md:grid-cols-2 md:px-8 lg:grid-cols-4">
        <div>
          <Logo size={72} />
          <p className="mt-4 text-sm tracking-[0.18em] uppercase text-white/70">{site.tagline}</p>
          <p className="prose-quiet mt-4 max-w-xs text-sm text-white/60">
            A Kathmandu spa for guests who want time, quiet rooms, and treatments arranged around how they actually feel.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#e8771a]">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            {explore.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#e8771a]">Treatments</p>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            {treatments.map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#e8771a]">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>{site.city}</li>
            <li>{site.phone || "Phone shared when you book"}</li>
            <li>{site.email || "Email shared when you book"}</li>
            {site.hours.map((row) => (
              <li key={row.day}>
                {row.day}: {row.hours}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs tracking-[0.16em] uppercase text-white/50">Receive wellness updates & exclusive offers</p>
          <Link href="/contact#newsletter" className="btn-primary !py-3">
            Join the list
          </Link>
          <div className="mt-6 flex flex-wrap gap-4 text-xs tracking-[0.14em] uppercase text-white/60">
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
                <a key={label} href={href} target="_blank" rel="noreferrer">
                  {label}
                </a>
              ))}
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 border-t border-white/10 px-5 py-6 text-xs text-white/45 md:flex-row md:items-center md:justify-between md:px-8">
        <p>© {new Date().getFullYear()} KAYA SPA. All Rights Reserved.</p>
        <div className="flex gap-4">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms & Conditions</Link>
          <Link href="/cookies">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
}
