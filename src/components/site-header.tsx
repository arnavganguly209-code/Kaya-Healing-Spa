"use client";

import { Logo } from "@/components/logo";
import { categoryLabels, labelForCategory, packageCategoryLabels, packageMenuCategories, serviceMenuCategories, site, whatsAppUrl } from "@/lib/content";
import { Calendar, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/packages", label: "Packages" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({
  serviceCategories,
  packageCategories,
  whatsappDisplay = site.whatsapp,
}: {
  serviceCategories?: string[];
  packageCategories?: string[];
  whatsappDisplay?: string;
}) {
  const serviceMenu = serviceCategories?.length ? serviceCategories : [...serviceMenuCategories];
  const packageMenu = packageCategories?.length ? packageCategories : [...packageMenuCategories];
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const glass = !isHome || scrolled;
  const onHero = isHome && !scrolled;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (pathname.startsWith("/orbit")) return null;

  const navLinkClass = (active: boolean) =>
    `relative whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.08em] xl:text-[12px] 2xl:text-[13px] 2xl:tracking-[0.1em] ${
      onHero
        ? active
          ? "text-white"
          : "text-white hover:text-[#F47B20]"
        : active
          ? "text-[#F47B20]"
          : "text-[#121212] hover:text-[#F47B20]"
    }`;

  const bookClass = onHero
    ? "book-cta border border-white/70 bg-transparent text-white hover:bg-white/10"
    : "book-cta-cream border border-[#F47B20]/30 bg-gradient-to-b from-[#fff8f0] to-[#fde5cc] text-[#7a3a12] shadow-[0_10px_28px_rgba(244,123,32,0.2)] hover:from-[#fff3e6] hover:to-[#ffd9b0]";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ${
        glass
          ? "border-b border-white/60 bg-white/80 shadow-[0_8px_32px_rgba(23,23,23,0.05)] backdrop-blur-lg"
          : "border-b-0 border-transparent bg-gradient-to-b from-black/50 via-black/15 to-transparent shadow-none backdrop-blur-0"
      }`}
    >
      <div className="relative mx-auto flex h-[64px] w-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:h-[68px] sm:px-5 md:px-8 lg:h-[108px] lg:gap-4">
        <Link href="/" className="relative z-10 shrink-0" aria-label="Kaya Healing Spa home">
          <Logo priority />
        </Link>

        <nav
          className="relative z-20 hidden min-w-0 flex-1 items-center justify-center gap-3 xl:flex xl:gap-6 2xl:gap-8"
          aria-label="Primary"
        >
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

            if (link.href === "/services") {
              return (
                <div key={link.href} className="group/services relative px-1 xl:px-2">
                  <Link href="/services" className={`inline-flex items-center gap-1 ${navLinkClass(active)}`}>
                    {link.label}
                    <ChevronDown
                      size={14}
                      strokeWidth={2.5}
                      className="opacity-70 transition-transform duration-200 group-hover/services:rotate-180"
                      aria-hidden
                    />
                    {active && <span className="absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-[#F47B20]" />}
                  </Link>
                  <div className="pointer-events-none absolute top-full left-1/2 z-[60] w-52 -translate-x-1/2 pt-3 opacity-0 transition duration-200 group-hover/services:pointer-events-auto group-hover/services:opacity-100">
                    <ul
                      className="overflow-hidden rounded-2xl border border-[#efe8e0] bg-white py-1.5 shadow-[0_18px_44px_rgba(20,18,16,0.14)]"
                      role="menu"
                      aria-label="Service categories"
                    >
                      {serviceMenu.map((slug) => (
                        <li key={slug} role="none">
                          <Link
                            href={`/services?category=${slug}`}
                            role="menuitem"
                            className="block px-4 py-2.5 text-[13px] font-semibold tracking-wide text-[#141210] transition hover:bg-[#f6f1e8] hover:text-[#F47B20]"
                          >
                            {categoryLabels[slug as keyof typeof categoryLabels] ?? labelForCategory(slug)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            }

            if (link.href === "/packages") {
              return (
                <div key={link.href} className="group/packages relative px-1 xl:px-2">
                  <Link href="/packages" className={`inline-flex items-center gap-1 ${navLinkClass(active)}`}>
                    {link.label}
                    <ChevronDown
                      size={14}
                      strokeWidth={2.5}
                      className="opacity-70 transition-transform duration-200 group-hover/packages:rotate-180"
                      aria-hidden
                    />
                    {active && <span className="absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-[#F47B20]" />}
                  </Link>
                  <div className="pointer-events-none absolute top-full left-1/2 z-[60] w-52 -translate-x-1/2 pt-3 opacity-0 transition duration-200 group-hover/packages:pointer-events-auto group-hover/packages:opacity-100">
                    <ul
                      className="overflow-hidden rounded-2xl border border-[#efe8e0] bg-white py-1.5 shadow-[0_18px_44px_rgba(20,18,16,0.14)]"
                      role="menu"
                      aria-label="Package categories"
                    >
                      {packageMenu.map((slug) => (
                        <li key={slug} role="none">
                          <Link
                            href={`/packages?category=${slug}`}
                            role="menuitem"
                            className="block px-4 py-2.5 text-[13px] font-semibold tracking-wide text-[#141210] transition hover:bg-[#f6f1e8] hover:text-[#F47B20]"
                          >
                            {packageCategoryLabels[slug] ?? labelForCategory(slug)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            }

            return (
              <Link key={link.href} href={link.href} className={`px-1 xl:px-2 ${navLinkClass(active)}`}>
                {link.label}
                {active && <span className="absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-[#F47B20]" />}
              </Link>
            );
          })}
        </nav>

        <div className="relative z-10 flex shrink-0 items-center gap-2">
          <Link
            href="/contact"
            className={`group/book hidden items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition duration-300 xl:inline-flex ${bookClass}`}
          >
            <Calendar size={16} className="shrink-0 transition-transform duration-300 group-hover/book:scale-110" />
            Book Appointment
            <span aria-hidden className="inline-block transition-transform duration-300 group-hover/book:translate-x-0.5">
              →
            </span>
          </Link>
          <button
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition xl:hidden ${
              onHero ? "text-white hover:bg-white/10" : "text-[#171717] hover:bg-[#f6f1e8]"
            }`}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 top-[64px] z-40 flex flex-col overflow-y-auto bg-white px-5 py-6 sm:top-[68px] sm:px-6 sm:py-8 xl:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((link) => {
              if (link.href === "/services") {
                return (
                  <div key={link.href} className="border-b border-[#f0ece8] py-3">
                    <Link href="/services" onClick={() => setOpen(false)} className="text-base font-bold text-[#171717]">
                      Services
                    </Link>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 pl-1">
                      {serviceMenu.map((slug) => (
                        <Link
                          key={slug}
                          href={`/services?category=${slug}`}
                          onClick={() => setOpen(false)}
                          className="text-sm font-semibold text-[#5c5c5c] hover:text-[#F47B20]"
                        >
                          {categoryLabels[slug as keyof typeof categoryLabels] ?? labelForCategory(slug)}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              if (link.href === "/packages") {
                return (
                  <div key={link.href} className="border-b border-[#f0ece8] py-3">
                    <Link href="/packages" onClick={() => setOpen(false)} className="text-base font-bold text-[#171717]">
                      Packages
                    </Link>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 pl-1">
                      {packageMenu.map((slug) => (
                        <Link
                          key={slug}
                          href={`/packages?category=${slug}`}
                          onClick={() => setOpen(false)}
                          className="text-sm font-semibold text-[#5c5c5c] hover:text-[#F47B20]"
                        >
                          {packageCategoryLabels[slug] ?? labelForCategory(slug)}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-[#f0ece8] py-3.5 text-base font-bold text-[#171717] hover:text-[#F47B20]"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 flex flex-col gap-3">
            <a
              href={whatsAppUrl(whatsappDisplay)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white"
            >
              WhatsApp {whatsappDisplay}
            </a>
            <Link href="/contact" onClick={() => setOpen(false)} className="btn-primary w-full rounded-full text-center">
              Book Appointment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
