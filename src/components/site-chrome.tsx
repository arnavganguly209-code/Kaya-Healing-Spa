"use client";

import { BackToTop } from "@/components/back-to-top";
import { SiteHeader } from "@/components/site-header";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Link from "next/link";

export function SiteChrome({
  phone,
  footer,
  children,
}: {
  phone: string;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/orbit")) return <>{children}</>;
  return (
    <>
      <SiteHeader phone={phone} />
      <main>{children}</main>
      {footer}
      <BackToTop />
      <Link href="/contact" className="btn-primary fixed bottom-4 left-4 z-40 sm:hidden">
        Book
      </Link>
    </>
  );
}
