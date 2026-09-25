import { site } from "@/lib/content";
import { siteBrand } from "@/lib/site-brand";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Kaya Spa",
    description: `${site.tagline} — luxury spa in Kathmandu.`,
    start_url: "/",
    display: "standalone",
    background_color: "#fffcf8",
    theme_color: "#F47B20",
    icons: [
      {
        src: siteBrand.logo192,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: siteBrand.logoPng,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: siteBrand.logoPng,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
