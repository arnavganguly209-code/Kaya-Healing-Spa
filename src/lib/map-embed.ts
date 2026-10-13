import { site } from "@/lib/content";

/** Turns a Maps URL or place name into a Google embed `q` value. */
export function mapQueryParam(raw: string | undefined): string {
  const fallback = site.mapEmbedQuery;
  const value = (raw || "").trim() || fallback;
  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      const q = url.searchParams.get("q") || url.searchParams.get("query");
      if (q) return encodeURIComponent(q);
      const place = url.pathname.match(/\/place\/([^/]+)/);
      if (place?.[1]) return place[1];
    } catch {
      /* use encoded URL */
    }
    return encodeURIComponent(value);
  }
  if (!value.includes(" ") && value.includes("+")) return value;
  return encodeURIComponent(value);
}

export function mapEmbedUrl(raw?: string): string {
  return `https://maps.google.com/maps?q=${mapQueryParam(raw)}&z=15&output=embed`;
}
