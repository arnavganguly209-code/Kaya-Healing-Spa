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
        eyebrow="Packages"
        title="Complete wellness experiences"
        text="Sequences with rest built in. Choose a category, then book with your preferred therapist."
        image="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=2000&q=80"
        crumbs={[{ label: "Home", href: "/" }, { label: "Packages" }]}
      />
      <PackageCatalog
        initialCategory={params.category ?? "all"}
        items={items}
        categories={orbit.packageCategories}
      />
      <TherapistStrip therapists={orbit.therapists} intro="Prefer someone specific? Book a package and choose your therapist on the contact form." />
    </>
  );
}
