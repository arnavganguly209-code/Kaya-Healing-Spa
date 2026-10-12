import type { Service } from "@/lib/types";
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
