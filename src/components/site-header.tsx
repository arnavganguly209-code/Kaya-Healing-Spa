"use client";

import { Logo } from "@/components/logo";
import { site } from "@/lib/content";
import { Calendar, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Treatments" },
  { href: "/packages", label: "Wellness" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#f3ebe3] bg-white">
      <div className="mx-auto flex h-[86px] max-w-[1440px] items-center gap-6 px-4 md:px-8">
        <Link href="/" className="shrink-0" aria-label="KAYA SPA home">
          <Logo size={68} priority />
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-7 xl:flex" aria-label="Primary">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-[15px] font-medium ${active ? "text-[#e8771a]" : "text-[#1c1a17] hover:text-[#e8771a]"}`}
              >
                {link.label}
                {active && <span className="absolute -bottom-2 left-0 h-[2px] w-full bg-[#e8771a]" />}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hidden items-center gap-2 text-sm text-[#1c1a17] lg:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1e6] text-[#e8771a]">
              <Phone size={16} />
            </span>
            <span>
              <span className="block text-[11px] text-[#8a8175]">Call Us</span>
              <span className="font-medium">{site.phone}</span>
            </span>
          </a>
          <Link href="/contact" className="hidden items-center gap-2 rounded-full bg-[#e8771a] px-5 py-3 text-sm font-medium text-white hover:bg-[#c45e0a] sm:inline-flex">
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
        <div className="fixed inset-0 top-[86px] z-40 flex flex-col bg-white px-6 py-8 xl:hidden">
          <nav className="flex flex-col gap-5" aria-label="Mobile">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="font-serif text-4xl">
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
