"use client";

import { Logo } from "@/components/logo";
import { site } from "@/lib/content";
import { Calendar, Menu, Phone, X } from "lucide-react";
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
  const navReadable = onHero
    ? "[text-shadow:0_0_18px_rgba(255,255,255,0.95),0_1px_2px_rgba(255,255,255,0.9)] antialiased"
    : "antialiased";

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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ${
        glass
          ? "border-b border-white/60 bg-white/80 shadow-[0_8px_32px_rgba(23,23,23,0.05)] backdrop-blur-lg"
          : "border-b-0 border-transparent bg-transparent shadow-none backdrop-blur-0"
      }`}
    >
      <div className="relative mx-auto flex h-[72px] max-w-[1440px] items-center px-5 md:px-8 lg:h-[108px]">
        <Link href="/" className="relative z-10 shrink-0" aria-label="Kaya Healing Spa home">
          <Logo priority />
        </Link>
        <nav
          className="absolute left-[calc(50%-2.75rem)] z-20 hidden -translate-x-1/2 items-center gap-6 xl:flex 2xl:left-[calc(50%-1.5rem)] 2xl:gap-7"
          aria-label="Primary"
        >
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-[15px] font-extrabold tracking-[0.02em] ${navReadable} ${active ? "text-[#F47B20]" : "text-[#171717] hover:text-[#F47B20]"}`}
              >
                {link.label}
                {active && <span className="absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-[#F47B20]" />}
              </Link>
            );
          })}
        </nav>
        <div className="relative z-10 ml-auto flex shrink-0 items-center gap-4 lg:gap-5">
          <a href={`tel:${phone.replace(/\s/g, "")}`} className={`hidden items-center gap-3 text-[#171717] lg:flex ${navReadable}`}>
            <span className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${glass ? "bg-[#fff1e6]" : "bg-[#fff1e6]/35 backdrop-blur-[2px]"}`}>
              <Phone size={18} className="call-pulse text-[#F47B20]" strokeWidth={1.8} />
            </span>
            <span className="leading-tight">
              <span className="block text-[11px] text-[#8a8a8a]">Call Us</span>
              <span className="text-sm font-semibold">{phone}</span>
            </span>
          </a>
          <Link href="/contact" className="hidden items-center gap-2 rounded-full bg-[#F47B20] px-6 py-3 text-sm font-medium text-white shadow-[0_8px_20px_rgba(244,123,32,0.25)] transition hover:bg-[#e06d12] sm:inline-flex">
            <Calendar size={16} />
            Book Appointment
            <span aria-hidden>→</span>
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center text-[#171717] xl:hidden"
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
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-lg font-bold text-[#171717]">
                {link.label}
              </Link>
            ))}
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
