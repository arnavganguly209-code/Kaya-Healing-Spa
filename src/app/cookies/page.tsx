import { LegalLayout } from "@/components/page-hero";
import { site } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `How ${site.name} uses cookies.`,
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookie Policy">
      <p>This site uses only the cookies required to run the pages. We do not set advertising cookies.</p>
      <p>Embedded maps may set cookies belonging to the map provider when the map loads.</p>
    </LegalLayout>
  );
}
