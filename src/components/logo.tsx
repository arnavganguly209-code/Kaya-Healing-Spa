import Image from "next/image";

export function Logo({ size = 56, priority = false }: { size?: number; priority?: boolean }) {
  return (
    <Image
      src="/brand/kaya-logo.png"
      alt="KAYA SPA — A Complete Wellness Experience"
      width={size}
      height={size}
      priority={priority}
      className="h-[70px] w-[70px] bg-transparent object-contain lg:h-[99px] lg:w-[99px]"
    />
  );
}
