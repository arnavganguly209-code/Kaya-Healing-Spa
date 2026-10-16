import { isSpaMaintenanceHost } from "@/lib/maintenance-host";
import { siteBrand } from "@/lib/site-brand";
import { headers } from "next/headers";
import Image from "next/image";

export async function SiteMaintenance() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") || headerList.get("host");
  if (!isSpaMaintenanceHost(host)) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex min-h-[100svh] items-center justify-center overflow-y-auto overflow-x-hidden bg-[#120e0b] px-5 py-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="maintenance-title"
    >
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/hero/kaya-hero-spa-hd.png"
          alt=""
          fill
          priority
          unoptimized
          className="object-cover object-center opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#120e0b]/70 via-[#120e0b]/55 to-[#120e0b]/85" />
      </div>

      <div className="relative z-[1] my-auto flex w-full max-w-[36rem] flex-col items-center px-2 text-center">
        <Image
          src={siteBrand.logoWebp}
          alt={siteBrand.logoAlt}
          width={132}
          height={132}
          priority
          unoptimized
          className="h-24 w-24 rounded-full object-contain sm:h-32 sm:w-32"
        />
        <p className="mt-8 text-[11px] font-semibold tracking-[0.28em] text-[#F47B20] uppercase">
          Temporarily closed
        </p>
        <h1
          id="maintenance-title"
          className="display mt-4 max-w-full text-[clamp(2rem,8vw,3.4rem)] leading-[1.15] text-white"
        >
          Under maintenance
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-white/88 sm:text-lg">
          Kaya Healing Spa is taking a short pause. We will welcome you again soon.
        </p>
      </div>
    </div>
  );
}
