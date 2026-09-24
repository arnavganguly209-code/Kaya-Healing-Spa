import { site } from "@/lib/content";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    sitemap: `${site.url}/sitemap.xml`,
    rules: [{ userAgent: "*", allow: "/", disallow: "/orbit" }],
  };
}
