import { siteBrand } from "@/lib/site-brand";
import Image from "next/image";

export function Logo({
  src,
  priority = false,
}: {
  src?: string;
  size?: number;
  priority?: boolean;
}) {
  const resolved = src?.trim() || siteBrand.logoWebp;
  return (
    <span className="inline-flex shrink-0">
      <Image
        src={resolved}
        alt={siteBrand.logoAlt}
        width={184}
        height={184}
        priority={priority}
        unoptimized
        className="h-[52px] w-[52px] rounded-full bg-transparent object-contain sm:h-[64px] sm:w-[64px] lg:h-[92px] lg:w-[92px]"
      />
    </span>
  );
}
