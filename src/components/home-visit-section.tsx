import { OrangeLotusBackground } from "@/components/orange-lotus-background";
import type { OrbitHomePage } from "@/lib/orbit-store";
import { Flower2 } from "lucide-react";
import Image from "next/image";

export function HomeVisitSection({ visit }: { visit: OrbitHomePage["visit"] }) {
  const unoptimized = visit.image.startsWith("/uploads/");

  return (
    <section className="relative isolate overflow-hidden bg-[#c45e0a]">
      <OrangeLotusBackground idSuffix="home-massage" intensity={1} />
      <div className="relative z-[1] mx-auto max-w-[1440px] px-5 py-20 md:px-8 lg:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="relative lg:col-span-7">
            <div className="relative aspect-[4/5] max-h-[620px] w-full overflow-hidden rounded-[2rem] shadow-[0_32px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/40 ring-offset-4 ring-offset-[#e06d12]/30 md:rounded-[2.25rem]">
              <Image
                src={visit.image}
                alt={visit.imageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 52vw, 100vw"
                unoptimized={unoptimized}
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_45%,rgba(0,0,0,0.12)_100%)]" />
            </div>
          </div>

          <div className="lg:col-span-5 lg:-ml-8 xl:-ml-14">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/50 bg-[#fffcf8] p-9 shadow-[0_28px_70px_rgba(20,12,8,0.28)] md:p-11">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F47B20] via-[#ffd4b0] to-[#F47B20]" />
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff3e8] text-[#F47B20] shadow-inner">
                <Flower2 strokeWidth={1.35} size={22} />
              </div>
              <h2 className="display mt-6 text-[clamp(2.25rem,4vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-[#141210]">
                {visit.title}
              </h2>
              <p className="mt-5 text-[16px] leading-[1.75] text-[#4a453e]">{visit.intro}</p>
              <ul className="mt-10 space-y-7">
                {visit.pillars.map((item) => (
                  <li key={item.title} className="border-l-[3px] border-[#F47B20] pl-5">
                    <p className="text-[11px] font-bold tracking-[0.24em] text-[#c45e0a] uppercase">{item.title}</p>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-[#2a2520]">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
