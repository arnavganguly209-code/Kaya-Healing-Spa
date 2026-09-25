import type { ReactNode } from "react";

/** One lotus glyph — top view, readable at small tile sizes. */
export function LotusGlyph({ className }: { className?: string }) {
  const petals = Array.from({ length: 8 }, (_, i) => (
    <path
      key={i}
      d="M0 6 C-7 -4 -11 -14 0 -22 C11 -14 7 -4 0 6"
      transform={`rotate(${i * 45})`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinejoin="round"
    />
  ));
  const inner = Array.from({ length: 8 }, (_, i) => (
    <path
      key={`in-${i}`}
      d="M0 4 C-4 -2 -6 -8 0 -12 C6 -8 4 -2 0 4"
      transform={`rotate(${i * 45 + 22.5})`}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.85"
      strokeLinejoin="round"
      opacity="0.85"
    />
  ));
  return (
    <g className={className}>
      {petals}
      {inner}
      <circle r="2.2" fill="currentColor" opacity="0.5" />
    </g>
  );
}

type Props = {
  /** 1 = full page-cover strength; 0.2 = subtle footer wash */
  intensity?: number;
  /** Unique SVG pattern id when multiple instances on one page */
  idSuffix?: string;
  className?: string;
  children?: ReactNode;
  showWatermark?: boolean;
};

export function OrangeLotusBackground({
  intensity = 1,
  idSuffix = "default",
  className = "",
  children,
  showWatermark = true,
}: Props) {
  const patternId = `kaya-lotus-tile-${idSuffix}`;
  const i = Math.min(1, Math.max(0, intensity));

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          opacity: i,
          background:
            "radial-gradient(ellipse 100% 85% at 50% -10%, rgba(255,255,255,0.22) 0%, transparent 52%), radial-gradient(ellipse 80% 60% at 100% 100%, rgba(255,220,180,0.15) 0%, transparent 50%), linear-gradient(168deg, #f5924a 0%, #F47B20 38%, #e06d12 68%, #c45e0a 100%)",
        }}
      />
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" style={{ opacity: i }}>
        <defs>
          <pattern id={patternId} width="128" height="128" patternUnits="userSpaceOnUse">
            <g transform="translate(64 64)" style={{ color: "rgba(255,255,255,0.2)" }}>
              <LotusGlyph />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.08)_100%)]" style={{ opacity: i }} />
      {showWatermark && i > 0.35 ? (
        <div
          className="absolute left-1/2 top-1/2 h-[min(420px,70vw)] w-[min(420px,70vw)] -translate-x-1/2 -translate-y-1/2"
          style={{ opacity: 0.07 * i, color: "white" }}
        >
          <svg viewBox="-32 -32 64 64" className="h-full w-full">
            <LotusGlyph />
          </svg>
        </div>
      ) : null}
      {children}
    </div>
  );
}
