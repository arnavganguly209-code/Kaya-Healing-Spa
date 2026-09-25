import { getPublishedPosts } from "@/lib/blog-store";
import { site } from "@/lib/content";
import { readOrbitContent } from "@/lib/orbit-store";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const orbit = readOrbitContent();
  const staticRoutes = ["", "/about", "/services", "/packages", "/gallery", "/blog", "/contact", "/privacy", "/terms", "/cookies"].map(
    (path) => ({
      url: `${site.url}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : path === "/terms" || path === "/privacy" ? 0.4 : 0.7,
    }),
  );
  const serviceRoutes = orbit.services.map((service) => ({
    url: `${site.url}/services/${service.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const packageRoutes = orbit.packages.map((item) => ({
    url: `${site.url}/packages/${item.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const blogRoutes = getPublishedPosts().map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.55,
  }));
  return [...staticRoutes, ...serviceRoutes, ...packageRoutes, ...blogRoutes];
}
