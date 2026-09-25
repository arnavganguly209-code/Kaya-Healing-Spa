import { FooterSocialLinks } from "@/components/footer-social-links";
import { Logo } from "@/components/logo";
import { OrangeLotusBackground } from "@/components/orange-lotus-background";
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
  ["Holistic & Ayurvedic", "/services?category=holistic"],
  ["Thai Stretch", "/services/thai-stretch-massage"],
  ["Aromatic Massage", "/services/nepali-aromatic-massage"],
  ["Deep Tissue", "/services/deep-tissue-massage"],
  ["Wellness Rituals", "/packages"],
];

export function SiteFooter() {
  const orbit = readOrbitContent();
  const brand = orbit.footerBrand || site.name;
  const displayPhone = orbit.phone || site.phone;
  const telHref = displayPhone.startsWith("+") ? displayPhone.replace(/\s/g, "") : site.phoneTel;
  return (
    <footer className="relative overflow-hidden bg-[#12100e] text-[#f6f1e8]">
      <OrangeLotusBackground idSuffix="footer" intensity={0.2} showWatermark={false} />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-[#F47B20]/80 to-transparent" />
      <div className="relative z-[2] mx-auto grid max-w-[1440px] gap-12 px-5 py-20 md:grid-cols-2 md:px-10 lg:grid-cols-4 lg:gap-14">
        <div>
          <Logo />
          <p className="mt-5 font-serif text-2xl text-white">{brand}</p>
          <p className="mt-2 text-xs tracking-[0.22em] uppercase text-[#F47B20]">{site.tagline}</p>
          <p className="mt-5 max-w-xs text-sm leading-7 text-white/65">{orbit.footerText}</p>
          <p className="mt-4 max-w-xs text-sm text-white/55">{site.addressLine}</p>
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
              <a href={`tel:${telHref}`} className="hover:text-white">
                {displayPhone}
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
          <FooterSocialLinks links={orbit.socialLinks} extra={orbit.extraSocialLinks} />
        </div>
      </div>
      <div className="relative z-[2] border-t border-white/10 bg-black/20">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-4 px-5 py-7 text-xs text-white/50 md:grid-cols-3 md:items-center md:px-10">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} {orbit.footerBottom.copyrightName}. {orbit.footerBottom.rightsLine}
          </p>
          <p className="text-center text-white/55">
            <span aria-hidden>—</span>
            {orbit.footerBottom.developerLead}{" "}
            <a
              href={orbit.footerBottom.developerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#E8C547] transition hover:text-[#F5E6A8] hover:underline"
            >
              {orbit.footerBottom.developerName}
            </a>
            <span aria-hidden>—</span>
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 md:justify-end">
            {orbit.footerBottom.legalLinks.map((link) => (
              <Link key={`${link.href}-${link.label}`} href={link.href} className="hover:text-white/80">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
