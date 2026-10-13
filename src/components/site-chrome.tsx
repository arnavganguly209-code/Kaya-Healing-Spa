"use client";

import { BackToTop } from "@/components/back-to-top";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { site } from "@/lib/content";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function SiteChrome({
  whatsapp = site.whatsapp,
  serviceCategories,
  packageCategories,
  logoSrc,
  footer,
  children,
}: {
  whatsapp?: string;
  serviceCategories?: string[];
  packageCategories?: string[];
  logoSrc?: string;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/orbit") || pathname.startsWith("/admin")) return <>{children}</>;
  return (
    <>
      <SiteHeader
        serviceCategories={serviceCategories}
        packageCategories={packageCategories}
        whatsappDisplay={whatsapp}
        logoSrc={logoSrc}
      />
      <main className={pathname === "/" ? "" : "pt-[64px] sm:pt-[68px] lg:pt-[108px]"}>{children}</main>
      {footer}
      <WhatsAppFloat displayPhone={whatsapp} />
      <BackToTop />
    </>
  );
}
