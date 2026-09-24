import Image from "next/image";

export function Logo({ priority = false }: { size?: number; priority?: boolean }) {
  return (
    <span className="inline-flex shrink-0 rounded-full bg-white p-1 shadow-[0_4px_14px_rgba(23,23,23,0.06)]">
      <Image
        src="/brand/kaya-logo-hd.webp"
        alt="KAYA SPA — A Complete Wellness Experience"
        width={184}
        height={184}
        priority={priority}
        unoptimized
        className="h-[68px] w-[68px] rounded-full object-contain lg:h-[92px] lg:w-[92px]"
      />
    </span>
  );
}
