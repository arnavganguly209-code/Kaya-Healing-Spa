import { GalleryGrid } from "@/components/gallery-grid";
import { PageHero } from "@/components/page-hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spa Gallery",
  description: "Photographs of treatment rooms, rituals, and quiet details at KAYA SPA in Kathmandu.",
  alternates: { canonical: "/gallery" },
  openGraph: { title: "KAYA SPA gallery", description: "Interiors, treatments, and wellness details." },
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Rooms, rituals, details"
        text="A look at the atmosphere of the spa. Photographs will be replaced with KAYA’s own rooms as they are ready."
        image="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=2000&q=80"
        crumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />
      <GalleryGrid />
    </>
  );
}
