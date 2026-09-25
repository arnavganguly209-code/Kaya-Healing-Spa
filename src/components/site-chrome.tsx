"use client";

import { BackToTop } from "@/components/back-to-top";
import { SiteHeader } from "@/components/site-header";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Link from "next/link";

export function SiteChrome({
  phone,
  serviceCategories,
  packageCategories,
  footer,
  children,
}: {
  phone: string;
  serviceCategories?: string[];
  packageCategories?: string[];
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/orbit")) return <>{children}</>;
  return (
    <>
      <SiteHeader phone={phone} serviceCategories={serviceCategories} packageCategories={packageCategories} />
      <main className={pathname === "/" ? "" : "pt-[72px] lg:pt-[108px]"}>{children}</main>
      {footer}
      <BackToTop />
      <div className="fixed bottom-4 left-4 z-40 sm:hidden">
        <Link href="/contact" className="btn-primary">
          Book
        </Link>
      </div>
    </>
  );
}
