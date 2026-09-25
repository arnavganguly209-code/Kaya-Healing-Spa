"use client";

import { BackToTop } from "@/components/back-to-top";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { site } from "@/lib/content";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function SiteChrome({
  phoneDisplay = site.phone,
  phoneTel = site.phoneTel,
  serviceCategories,
  packageCategories,
  footer,
  children,
}: {
  phoneDisplay?: string;
  phoneTel?: string;
  serviceCategories?: string[];
  packageCategories?: string[];
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/orbit")) return <>{children}</>;
  return (
    <>
      <SiteHeader serviceCategories={serviceCategories} packageCategories={packageCategories} />
      <main className={pathname === "/" ? "" : "pt-[68px] lg:pt-[108px]"}>{children}</main>
      {footer}
      <WhatsAppFloat phoneTel={phoneTel} displayPhone={phoneDisplay} />
      <BackToTop />
    </>
  );
}
