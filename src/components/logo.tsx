import Image from "next/image";

export function Logo({ size = 56, priority = false }: { size?: number; priority?: boolean }) {
  return (
    <Image
      src="/brand/kaya-logo.jpg"
      alt="KAYA SPA — A Complete Wellness Experience"
      width={size}
      height={size}
      priority={priority}
      className="rounded-full object-cover"
    />
  );
}
