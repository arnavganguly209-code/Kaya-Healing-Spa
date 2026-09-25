import { PackageCatalog } from "@/components/package-catalog";
import { TherapistStrip } from "@/components/therapist-strip";
import { PageHero } from "@/components/page-hero";
import { packages as fallbackPackages, site } from "@/lib/content";
import { readOrbitContent } from "@/lib/orbit-store";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spa Packages in Kathmandu",
  description: `Half-day and full-day spa packages at ${site.name}, Chaksibari, Kathmandu.`,
  alternates: { canonical: "/packages" },
  openGraph: { title: `${site.name} packages`, description: "Complete wellness experiences in Kathmandu." },
};

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const orbit = readOrbitContent();
  const items = orbit.packages.length ? orbit.packages : fallbackPackages;

  return (
    <>
      <PageHero
        eyebrow={orbit.pageCovers.packages.eyebrow}
        title={orbit.pageCovers.packages.title}
        tagline={orbit.pageCovers.packages.tagline}
        text={orbit.pageCovers.packages.text}
        crumbs={[{ label: "Home", href: "/" }, { label: "Packages" }]}
      />
      <PackageCatalog
        initialCategory={params.category ?? "all"}
        catalogTitle={orbit.pageCovers.packages.catalogTitle}
        catalogSubtitle={orbit.pageCovers.packages.catalogSubtitle}
        items={items}
        categories={orbit.packageCategories}
      />
      <TherapistStrip therapists={orbit.therapists} intro="Prefer someone specific? Book a package and choose your therapist on the contact form." />
    </>
  );
}
