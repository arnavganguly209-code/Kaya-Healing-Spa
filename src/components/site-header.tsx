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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (pathname.startsWith("/orbit")) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#eeeae6] bg-white">
      <div className="relative mx-auto flex h-[72px] max-w-[1440px] items-center px-4 md:px-8 lg:h-[120px]">
        <Link href="/" className="relative z-10 shrink-0 bg-transparent" aria-label="KAYA SPA home">
          <Logo size={99} priority />
        </Link>
        <nav className="absolute left-[44%] z-20 hidden -translate-x-1/2 items-center gap-6 xl:flex" aria-label="Primary">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-[15px] font-semibold tracking-[-0.01em] ${active ? "text-[#F47B20]" : "text-[#171717] hover:text-[#F47B20]"}`}
              >
                {link.label}
                {active && <span className="absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-[#F47B20]" />}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-5">
          <a href={`tel:${phone.replace(/\s/g, "")}`} className="hidden items-center gap-2.5 text-[#171717] lg:flex">
            <Phone size={18} className="text-[#F47B20]" strokeWidth={1.75} />
            <span className="leading-tight">
              <span className="block text-[11px] text-[#8a8a8a]">Call Us</span>
              <span className="text-sm font-semibold">{phone}</span>
            </span>
          </a>
          <Link href="/contact" className="hidden items-center gap-2 rounded-full bg-[#F47B20] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#e06d12] sm:inline-flex">
            <Calendar size={16} />
            Book Appointment
            <span aria-hidden>→</span>
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center text-[#1c1a17] xl:hidden"
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
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-lg font-semibold text-[#171717]">
                {link.label}
              </Link>
            ))}
          </nav>
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="mt-8 text-sm">
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
