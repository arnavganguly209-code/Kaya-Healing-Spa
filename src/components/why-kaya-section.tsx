import Image from "next/image";
import { Flower2, Heart, Leaf, ShieldCheck, Sparkles, Users } from "lucide-react";
import type { OrbitWhyKaya } from "@/lib/orbit-store";

function StonesIcon({ className = "text-[#F47B20]", size = 22 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <ellipse cx="12" cy="6" rx="5" ry="2.2" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="12" cy="12" rx="6.2" ry="2.4" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="12" cy="18" rx="7.2" ry="2.6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

const highlightIcons = [Leaf, Flower2, Heart, StonesIcon];
const pillarIcons = [ShieldCheck, Leaf, Users, Sparkles];

export function WhyKayaSection({ data }: { data: OrbitWhyKaya }) {
  const unoptimized = data.image.startsWith("/uploads/");

  return (
    <section className="bg-[#faf7f2] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          <div className="relative mx-auto w-full max-w-[480px] lg:max-w-none">
            <div
              className="relative aspect-[4/5] w-full overflow-hidden border-[5px] border-[#F47B20] shadow-[0_24px_64px_rgba(244,123,32,0.14)]"
              style={{ borderRadius: "58% 42% 48% 52% / 52% 48% 52% 48%" }}
            >
              <Image
                src={data.image}
                alt={data.imageAlt}
                fill
                unoptimized={unoptimized}
                className="object-cover"
                sizes="(min-width: 1024px) 42vw, 480px"
              />
            </div>
          </div>

          <div>
            <p className="flex items-center justify-center gap-4 text-center text-[11px] font-medium tracking-[0.26em] text-[#9a8f84] uppercase lg:justify-start">
              <span className="hidden h-px w-10 bg-[#dccfc4] lg:block" />
              {data.eyebrow}
              <span className="hidden h-px w-10 bg-[#dccfc4] lg:block" />
            </p>
            <h2
              className="mt-5 text-center text-[38px] leading-[0.95] font-semibold tracking-[-0.03em] sm:text-[44px] lg:text-left lg:text-[52px]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              <span className="text-[#F47B20]">{data.titleOrange}</span>
              <br />
              <span className="text-[#1a1614]">{data.titleDark}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-center text-sm leading-7 text-[#5c564f] sm:text-[15px] lg:mx-0 lg:text-left">
              {data.intro}
            </p>

            <ul className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10">
              {data.highlights.map((item, index) => {
                const Icon = highlightIcons[index % highlightIcons.length];
                return (
                  <li key={`${item.title}-${index}`} className="flex gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f3e8dc] text-[#F47B20]">
                      {Icon === StonesIcon ? <StonesIcon size={22} /> : <Icon size={22} strokeWidth={1.5} />}
                    </span>
                    <span>
                      <span className="block font-serif text-[17px] font-semibold text-[#1a1614]">{item.title}</span>
                      <span className="mt-1 block text-[13px] leading-[1.55] text-[#6d665e]">{item.text}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <ul className="mt-16 grid gap-10 border-t border-[#ebe3da] pt-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-8 lg:divide-x lg:divide-[#ebe3da]">
          {data.pillars.map((item, index) => {
            const Icon = pillarIcons[index % pillarIcons.length];
            return (
              <li key={`${item.title}-${index}`} className="flex flex-col items-center px-2 text-center lg:px-6">
                <Icon className="text-[#F47B20]" size={28} strokeWidth={1.4} />
                <h3 className="mt-4 font-serif text-xl font-semibold text-[#1a1614]">{item.title}</h3>
                <p className="mt-2 max-w-[220px] text-[13px] leading-[1.55] text-[#6d665e]">{item.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
