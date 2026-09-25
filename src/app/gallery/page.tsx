import { GalleryGrid } from "@/components/gallery-grid";
import { PageHero } from "@/components/page-hero";
import { site } from "@/lib/content";
import { readOrbitContent } from "@/lib/orbit-store";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spa Gallery",
  description: `Photographs of treatment rooms, rituals, and quiet details at ${site.name} in Kathmandu.`,
  alternates: { canonical: "/gallery" },
  openGraph: { title: `${site.name} gallery`, description: "Interiors, treatments, and wellness details." },
};

export default function GalleryPage() {
  const orbit = readOrbitContent();
  const cover = orbit.pageCovers.gallery;
  const images = orbit.gallery;
  return (
    <>
      <PageHero
        eyebrow={cover.eyebrow}
        title={cover.title}
        tagline={cover.tagline}
        text={cover.text}
        crumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />
      <GalleryGrid items={images} />
    </>
  );
}
