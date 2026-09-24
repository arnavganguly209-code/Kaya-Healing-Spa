import { BackToTop } from "@/components/back-to-top";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/content";
import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const sans = Outfit({
  variable: "--font-sans-body",
  subsets: ["latin"],
  display: "swap",
});

const display = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const serif = Cormorant_Garamond({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "KAYA SPA | Luxury Spa in Kathmandu",
    template: "%s | KAYA SPA",
  },
  description:
    "KAYA SPA is a luxury wellness spa in Kathmandu. Book massage, Ayurvedic rituals, and spa packages for a calm, complete visit.",
  openGraph: {
    type: "website",
    siteName: "KAYA SPA",
    title: "KAYA SPA | A Complete Wellness Experience",
    description: "Luxury spa and wellness in Kathmandu. Massage, Ayurveda, and unhurried spa packages.",
    images: ["/brand/kaya-logo.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "KAYA SPA",
    description: "A complete wellness experience in Kathmandu.",
    images: ["/brand/kaya-logo.jpg"],
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const business = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: "KAYA SPA",
    description: "Luxury spa and wellness in Kathmandu, Nepal.",
    slogan: site.tagline,
    image: `${site.url}/brand/kaya-logo.jpg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kathmandu",
      addressCountry: "NP",
    },
    areaServed: "Kathmandu",
    url: site.url,
  };

  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${display.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#fffcf8] text-[#141210]">
        <JsonLd data={business} />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <BackToTop />
        <Link href="/contact" className="btn-primary fixed bottom-4 left-4 z-40 sm:hidden">
          Book
        </Link>
      </body>
    </html>
  );
}
