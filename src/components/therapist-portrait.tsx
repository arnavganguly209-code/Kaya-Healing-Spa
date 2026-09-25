import Image from "next/image";

export function TherapistPortrait({
  src,
  alt,
  className = "",
  sizes = "240px",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <div
      className={`relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-[#e6dfd4] bg-[#f0ece8] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover ${src.includes("/therapists/placeholder-") ? "object-center" : "object-[50%_22%]"}`}
        sizes={sizes}
        unoptimized={src.startsWith("/uploads/") || src.startsWith("/hero/") || src.startsWith("/therapists/") || src.startsWith("/catalog/")}
      />
    </div>
  );
}
