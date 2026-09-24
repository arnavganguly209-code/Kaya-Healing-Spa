import Image from "next/image";

export function Logo({ size = 56, priority = false }: { size?: number; priority?: boolean }) {
  return (
    <Image
      src="/brand/kaya-logo.png"
      alt="KAYA SPA — A Complete Wellness Experience"
      width={size}
      height={size}
      priority={priority}
      className="h-16 w-16 rounded-full object-cover lg:h-[90px] lg:w-[90px]"
    />
  );
}
