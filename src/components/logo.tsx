import Image from "next/image";

export function Logo({ size = 56, priority = false }: { size?: number; priority?: boolean }) {
  return (
    <Image
      src="/brand/kaya-logo.webp"
      alt="KAYA SPA — A Complete Wellness Experience"
      width={size}
      height={size}
      priority={priority}
      className="h-[64px] w-[64px] overflow-hidden rounded-full bg-transparent object-cover lg:h-[86px] lg:w-[86px]"
    />
  );
}
