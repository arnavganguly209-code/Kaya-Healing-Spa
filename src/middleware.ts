import { knownPackageSlugs, knownServiceSlugs } from "@/lib/route-slugs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function notFoundHtml(): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>Page not found | Kaya Healing Spa</title><meta name="robots" content="noindex"/></head><body style="margin:0;font-family:Georgia,serif;background:#141210;color:#fff;text-align:center;padding:48px 24px"><p style="color:#e8771a;letter-spacing:.2em;font-size:12px">404</p><h1 style="font-weight:500;font-size:2rem">This page is not part of Kaya Healing Spa.</h1><p style="color:rgba(255,255,255,.7)"><a href="/" style="color:#F47B20">Return home</a></p></body></html>`;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const serviceMatch = pathname.match(/^\/services\/([^/]+)\/?$/);
  if (serviceMatch) {
    const slug = decodeURIComponent(serviceMatch[1]);
    if (!knownServiceSlugs.has(slug)) {
      return new NextResponse(notFoundHtml(), {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "private, no-store" },
      });
    }
  }

  const packageMatch = pathname.match(/^\/packages\/([^/]+)\/?$/);
  if (packageMatch) {
    const slug = decodeURIComponent(packageMatch[1]);
    if (!knownPackageSlugs.has(slug)) {
      return new NextResponse(notFoundHtml(), {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "private, no-store" },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/services/:slug", "/packages/:slug"],
};
