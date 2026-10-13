import type { Service, SpaPackage } from "@/lib/types";
import { formatNpr } from "@/lib/content";

export type ServiceDurationOption = {
  minutes: number;
  label: string;
  priceNpr: number | null;
};

const durationLine = /(\d+)\s*min(?:ute)?s?[^0-9]*(?:NPR|Rs\.?|रू)?\s*([\d,]+)/i;
const minutesOnly = /(\d+)\s*min/i;

export function parseServiceDurationOptions(service: Service): ServiceDurationOption[] {
  const fromLines = service.durationOptions
    .map((line) => {
      const priced = line.match(durationLine);
      if (priced) {
        return {
          minutes: Number(priced[1]),
          label: line.trim(),
          priceNpr: Number(priced[2].replace(/,/g, "")) || null,
        };
      }
      const mins = line.match(minutesOnly);
      if (mins) {
        return {
          minutes: Number(mins[1]),
          label: line.trim(),
          priceNpr: service.priceFromNpr > 0 ? service.priceFromNpr : null,
        };
      }
      return null;
    })
    .filter(Boolean) as ServiceDurationOption[];

  if (fromLines.length) return fromLines;

  if (service.durationMinutes > 0) {
    return [
      {
        minutes: service.durationMinutes,
        label: `${service.durationMinutes} minutes`,
        priceNpr: service.priceFromNpr > 0 ? service.priceFromNpr : null,
      },
    ];
  }
  return [
    { minutes: 60, label: "60 minutes", priceNpr: service.priceFromNpr > 0 ? service.priceFromNpr : null },
    { minutes: 90, label: "90 minutes", priceNpr: null },
  ];
}

export function priceLabel(option: ServiceDurationOption) {
  if (option.priceNpr == null || option.priceNpr <= 0) return "Price to be confirmed at reception";
  return formatNpr(option.priceNpr);
}

export function minutesFromDurationLabel(label: string, fallback = 120) {
  const hours = Number(label.match(/(\d+)\s*hour/i)?.[1] || 0);
  const mins = Number(label.match(/(\d+)\s*min/i)?.[1] || 0);
  const total = hours * 60 + mins;
  return total > 0 ? total : fallback;
}

export function parsePackageDurationOptions(pkg: SpaPackage): ServiceDurationOption[] {
  const durationMinutes = pkg.durationMinutes && pkg.durationMinutes > 0
    ? pkg.durationMinutes
    : minutesFromDurationLabel(pkg.durationLabel);
  const stub: Service = {
    slug: pkg.slug,
    name: pkg.name,
    category: "wellness",
    summary: pkg.summary,
    overview: pkg.overview || pkg.description,
    durationMinutes,
    durationOptions: pkg.durationOptions?.length ? pkg.durationOptions : [],
    priceFromNpr: pkg.priceNpr,
    priceIsPlaceholder: true,
    benefits: pkg.benefits || [],
    expect: pkg.expect || [],
    recommendedFor: [],
    preparation: [],
    image: pkg.image,
    imageAlt: pkg.imageAlt,
  };
  const parsed = parseServiceDurationOptions(stub);
  if (parsed.length === 1 && parsed[0].minutes === 60 && durationMinutes !== 60 && !pkg.durationOptions?.length) {
    return [
      {
        minutes: durationMinutes,
        label: pkg.durationLabel || `${durationMinutes} minutes`,
        priceNpr: pkg.priceNpr > 0 ? pkg.priceNpr : null,
      },
    ];
  }
  return parsed;
}
