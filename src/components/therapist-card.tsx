import { TherapistPortrait } from "@/components/therapist-portrait";
import type { OrbitTherapist } from "@/lib/orbit-types";
import Link from "next/link";

export function TherapistCard({
  therapist,
  compact,
  selected,
  onSelect,
  fullWidth,
}: {
  therapist: OrbitTherapist;
  compact?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  /** Use in grids (e.g. contact form) instead of horizontal carousel cards */
  fullWidth?: boolean;
}) {
  const inner = (
    <>
      <div className={compact ? "p-2 pb-0" : "p-4 pb-0"}>
        <TherapistPortrait src={therapist.photo} alt={therapist.photoAlt} sizes={compact ? "168px" : "260px"} />
      </div>
      <div className={`flex flex-1 flex-col ${compact ? "p-3 pt-2" : "p-5 pt-4"}`}>
        {!compact && (
          <p className="text-[11px] font-semibold tracking-[0.16em] text-[#F47B20] uppercase">{therapist.title}</p>
        )}
        <h3 className={`font-serif text-[#171717] ${compact ? "text-lg leading-tight" : "mt-1 text-2xl"}`}>{therapist.name}</h3>
        <p className="mt-1 text-xs font-medium text-[#6B6B6B]">{therapist.experience}</p>
        <p className={`prose-quiet mt-2 flex-1 text-[#4a4a4a] ${compact ? "text-xs leading-snug line-clamp-3" : "text-sm leading-relaxed"}`}>
          {therapist.description}
        </p>
        {!compact && !onSelect && (
          <Link
            href={`/contact?therapist=${encodeURIComponent(therapist.slug)}&mode=therapist`}
            className="btn-primary mt-4 w-full text-center sm:mt-5"
          >
            Book therapist
          </Link>
        )}
      </div>
    </>
  );

  const frame = fullWidth
    ? `flex w-full flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_12px_32px_rgba(23,23,23,0.06)] ${
        selected ? "border-[#F47B20] ring-2 ring-[#F47B20]/35" : "border-[#e6dfd4]"
      }`
    : `flex w-[min(78vw,240px)] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_12px_32px_rgba(23,23,23,0.06)] sm:w-[260px] ${
        selected ? "border-[#F47B20] ring-2 ring-[#F47B20]/35" : "border-[#e6dfd4]"
      }`;

  if (onSelect) {
    return (
      <button type="button" onClick={onSelect} className={`${frame} text-left transition hover:border-[#F47B20]/60`}>
        {inner}
      </button>
    );
  }

  return <article className={frame}>{inner}</article>;
}
