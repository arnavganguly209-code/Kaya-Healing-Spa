import { packages, services, site } from "@/lib/content";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/services", "/packages", "/gallery", "/contact", "/privacy", "/terms", "/cookies"].map(
    (path) => ({ url: `${site.url}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 }),
  );
  const serviceRoutes = services.map((service) => ({
    url: `${site.url}/services/${service.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const packageRoutes = packages.map((item) => ({
    url: `${site.url}/packages/${item.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...staticRoutes, ...serviceRoutes, ...packageRoutes];
}
