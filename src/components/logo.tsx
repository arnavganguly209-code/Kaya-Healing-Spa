import Image from "next/image";

export function Logo({ size = 56, priority = false }: { size?: number; priority?: boolean }) {
  return (
    <span className="inline-flex rounded-full bg-white p-1">
      <Image
        src="/brand/kaya-logo-hd.png"
        alt="KAYA SPA — A Complete Wellness Experience"
        width={Math.max(size * 2, 200)}
        height={Math.max(size * 2, 200)}
        priority={priority}
        unoptimized
        className="h-[68px] w-[68px] rounded-full object-cover lg:h-[92px] lg:w-[92px]"
      />
    </span>
  );
}
