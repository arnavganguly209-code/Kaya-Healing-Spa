"use client";

import { Logo } from "@/components/logo";
import { categoryLabels, packageCategoryLabels, packageMenuCategories, serviceMenuCategories, site } from "@/lib/content";
import { Calendar, ChevronDown, Menu, Phone, X } from "lucide-react";
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

export function SiteHeader({ phone = site.phone }: { phone?: string }) {
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
    `relative text-[13px] font-bold uppercase tracking-[0.1em] ${
      onHero
        ? active
          ? "text-white"
          : "text-white hover:text-[#F47B20]"
        : active
          ? "text-[#F47B20]"
          : "text-[#121212] hover:text-[#F47B20]"
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ${
        glass
          ? "border-b border-white/60 bg-white/80 shadow-[0_8px_32px_rgba(23,23,23,0.05)] backdrop-blur-lg"
          : "border-b-0 border-transparent bg-gradient-to-b from-black/50 via-black/15 to-transparent shadow-none backdrop-blur-0"
      }`}
    >
      <div className="relative mx-auto flex h-[72px] max-w-[1440px] items-center gap-3 px-5 md:px-8 lg:h-[108px] xl:gap-4">
        <Link href="/" className="relative z-10 shrink-0" aria-label="Kaya Healing Spa home">
          <Logo priority />
        </Link>
        <nav
          className="relative z-20 hidden min-w-0 flex-1 items-center justify-center gap-5 xl:flex xl:gap-7 2xl:gap-8"
          aria-label="Primary"
        >
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

            if (link.href === "/services") {
              return (
                <div key={link.href} className="group/services relative px-1.5 xl:px-2">
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
                      {serviceMenuCategories.map((slug) => (
                        <li key={slug} role="none">
                          <Link
                            href={`/services?category=${slug}`}
                            role="menuitem"
                            className="block px-4 py-2.5 text-[13px] font-semibold tracking-wide text-[#141210] transition hover:bg-[#f6f1e8] hover:text-[#F47B20]"
                          >
                            {categoryLabels[slug]}
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
                <div key={link.href} className="group/packages relative px-1.5 xl:px-2">
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
                      {packageMenuCategories.map((slug) => (
                        <li key={slug} role="none">
                          <Link
                            href={`/packages?category=${slug}`}
                            role="menuitem"
                            className="block px-4 py-2.5 text-[13px] font-semibold tracking-wide text-[#141210] transition hover:bg-[#f6f1e8] hover:text-[#F47B20]"
                          >
                            {packageCategoryLabels[slug]}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            }

            return (
              <Link key={link.href} href={link.href} className={`px-1.5 xl:px-2 ${navLinkClass(active)}`}>
                {link.label}
                {active && <span className="absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-[#F47B20]" />}
              </Link>
            );
          })}
        </nav>
        <div className="relative z-10 flex shrink-0 items-center gap-3 lg:gap-4 xl:pl-2">
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className={`group/call hidden items-center gap-3 transition-transform duration-300 hover:-translate-y-0.5 lg:flex ${onHero ? "text-white" : "text-[#171717]"}`}
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-300 group-hover/call:scale-105 ${
                glass
                  ? "call-ring bg-[#fff1e6]"
                  : onHero
                    ? "call-ring-hero bg-white/15"
                    : "call-ring bg-[#fff1e6]/35 backdrop-blur-[2px]"
              }`}
            >
              <Phone size={18} className={`${onHero ? "text-white" : "text-[#F47B20]"}`} strokeWidth={1.8} />
            </span>
            <span className="leading-tight">
              <span className={`block text-[11px] font-semibold ${onHero ? "text-white/80" : "text-[#5c5c5c]"}`}>Call Us</span>
              <span className={`text-sm font-bold ${onHero ? "text-white" : "text-[#121212]"}`}>{phone}</span>
            </span>
          </a>
          <Link
            href="/contact"
            className={`group/book hidden items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition duration-300 hover:-translate-y-0.5 sm:inline-flex ${
              onHero
                ? "book-cta border border-white/70 bg-transparent text-white hover:bg-white/10"
                : "book-cta-solid bg-[#F47B20] text-white hover:bg-[#e06d12]"
            }`}
          >
            <Calendar size={16} className="transition-transform duration-300 group-hover/book:scale-110" />
            Book Appointment
            <span aria-hidden className="inline-block transition-transform duration-300 group-hover/book:translate-x-0.5">
              →
            </span>
          </Link>
          <button
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center xl:hidden ${onHero ? "text-white" : "text-[#171717]"}`}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 top-[72px] z-40 flex flex-col bg-white px-6 py-8 xl:hidden">
          <nav className="flex flex-col gap-4" aria-label="Mobile">
            {links.map((link) => {
              if (link.href === "/services") {
                return (
                  <div key={link.href}>
                    <Link href="/services" onClick={() => setOpen(false)} className="text-lg font-bold text-[#171717]">
                      Services
                    </Link>
                    <div className="mt-3 flex flex-col gap-2 border-l-2 border-[#F47B20]/35 pl-4">
                      {serviceMenuCategories.map((slug) => (
                        <Link
                          key={slug}
                          href={`/services?category=${slug}`}
                          onClick={() => setOpen(false)}
                          className="text-sm font-semibold text-[#5c5c5c] hover:text-[#F47B20]"
                        >
                          {categoryLabels[slug]}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              if (link.href === "/packages") {
                return (
                  <div key={link.href}>
                    <Link href="/packages" onClick={() => setOpen(false)} className="text-lg font-bold text-[#171717]">
                      Packages
                    </Link>
                    <div className="mt-3 flex flex-col gap-2 border-l-2 border-[#F47B20]/35 pl-4">
                      {packageMenuCategories.map((slug) => (
                        <Link
                          key={slug}
                          href={`/packages?category=${slug}`}
                          onClick={() => setOpen(false)}
                          className="text-sm font-semibold text-[#5c5c5c] hover:text-[#F47B20]"
                        >
                          {packageCategoryLabels[slug]}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-lg font-bold text-[#171717]">
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="mt-8 text-sm font-semibold">
            Call Us {site.phone}
          </a>
          <Link href="/contact" onClick={() => setOpen(false)} className="btn-primary mt-6 w-fit rounded-full">
            Book Appointment
          </Link>
        </div>
      )}
    </header>
  );
}
