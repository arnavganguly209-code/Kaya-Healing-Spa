"use client";

import { NAV_MENU_TYPE } from "@/lib/nav-menu-type";

export function FilterChips({
  items,
  value,
  onChange,
  label,
}: {
  items: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  label: string;
}) {
  return (
    <div className="relative -mx-4 md:mx-0">
      <div
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-wrap md:justify-center md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label={label}
      >
        {items.map((item) => {
          const selected = value === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(item.id)}
              className={`snap-start shrink-0 rounded-full px-5 py-3 ${NAV_MENU_TYPE} transition ${
                selected
                  ? "bg-[#F47B20] text-white shadow-[0_8px_24px_rgba(244,123,32,0.28)]"
                  : "border border-[#e6dfd4] bg-white text-[#141210] hover:border-[#F47B20]/40 hover:text-[#F47B20]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
