import Image from "next/image";

export function Logo({ priority = false }: { size?: number; priority?: boolean }) {
  return (
    <span className="inline-flex shrink-0">
      <Image
        src="/brand/kaya-logo-hd.webp"
        alt="Kaya Healing Spa — A Complete Wellness Experience"
        width={184}
        height={184}
        priority={priority}
        unoptimized
        className="h-[58px] w-[58px] rounded-full object-contain sm:h-[64px] sm:w-[64px] lg:h-[92px] lg:w-[92px]"
      />
    </span>
  );
}
