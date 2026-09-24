import { JsonLd } from "@/components/json-ld";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/lib/content";
import { readOrbitContent } from "@/lib/orbit-store";
import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit, Playfair_Display } from "next/font/google";
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
  twitter: {
    card: "summary_large_image",
    title: "KAYA SPA",
    description: "A complete wellness experience in Kathmandu.",
    images: ["/brand/kaya-logo-hd.png"],
  },
  keywords: [
    "Kaya Spa",
    "spa in Kathmandu",
    "luxury spa in Kathmandu",
    "massage in Kathmandu",
    "wellness spa Kathmandu",
    "Ayurvedic massage Kathmandu",
  ],
  icons: { icon: "/brand/kaya-logo-hd.png", apple: "/brand/kaya-logo-hd.png" },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "KAYA SPA",
    url: site.url,
    title: "KAYA SPA | A Complete Wellness Experience",
    description: "Luxury spa and wellness in Kathmandu. Massage, Ayurveda, and unhurried spa packages.",
    images: ["/brand/kaya-logo-hd.png"],
  },
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: LayoutProps<"/">) {
  const business = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: "KAYA SPA",
    description: "Luxury spa and wellness in Kathmandu, Nepal.",
    slogan: site.tagline,
    image: `${site.url}/brand/kaya-logo-hd.png`,
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
        <SiteChrome phone={readOrbitContent().phone || site.phone} footer={<SiteFooter />}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
