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
      <main
        className={`min-w-0 overflow-x-hidden ${
          pathname === "/"
            ? ""
            : "pt-[calc(64px+env(safe-area-inset-top,0px))] sm:pt-[calc(68px+env(safe-area-inset-top,0px))] lg:pt-[calc(108px+env(safe-area-inset-top,0px))]"
        }`}
      >
        {children}
      </main>
      {footer}
      <WhatsAppFloat displayPhone={whatsapp} />
      <BackToTop />
    </>
  );
}
