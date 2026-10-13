"use client";

import { catalogImageUnoptimized, catalogPublicSrc, isUploadedMedia } from "@/lib/catalog-media";
import Image from "next/image";

export function CatalogPhoto({
  src,
  alt,
  className = "object-cover",
  sizes = "50vw",
  fill = true,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  fill?: boolean;
}) {
  const resolved = catalogPublicSrc(src);
  if (isUploadedMedia(resolved)) {
    const imgClass = fill ? `absolute inset-0 h-full w-full ${className}` : `h-full w-full ${className}`;
    return (
      // Uploaded files must bypass next/image — optimizer often 400s them on VPS.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={resolved} alt={alt} className={imgClass} />
    );
  }
  return (
    <Image
      src={resolved}
      alt={alt}
      fill={fill}
      unoptimized={catalogImageUnoptimized(resolved)}
      className={className}
      sizes={sizes}
    />
  );
}
