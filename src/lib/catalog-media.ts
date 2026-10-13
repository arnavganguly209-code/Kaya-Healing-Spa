export function isUploadedMedia(src: string) {
  return src.startsWith("/uploads/");
}

export function catalogImageUnoptimized(src: string) {
  return isUploadedMedia(src) || src.startsWith("/catalog/") || src.startsWith("/hero/") || src.startsWith("/brand/");
}

export function catalogPublicSrc(src: string) {
  const path = src?.trim() || "";
  if (!path) return "/catalog/coming-soon.webp";
  return path;
}
