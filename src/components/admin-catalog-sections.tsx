"use client";

import { CategoryManager } from "@/components/category-manager";
import { GalleryCategoryBank } from "@/components/gallery-category-bank";
import { CATALOG_COMING_SOON_IMAGE } from "@/lib/catalog-images";
import { defaultServices } from "@/lib/default-services";
import type { OrbitContent } from "@/lib/orbit-store";
import type { Service, SpaPackage } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";

export type CatalogAdminSlice = Pick<
  OrbitContent,
  "services" | "packages" | "categories" | "packageCategories" | "gallery"
>;

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="mt-3 block text-sm">
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-[#efe8e0] px-3 py-3" />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="mt-3 block text-sm">
      {label}
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="mt-1 w-full rounded-xl border border-[#efe8e0] px-3 py-3" />
    </label>
  );
}

function MediaField({
  label,
  src,
  onUpload,
}: {
  label: string;
  src: string;
  onUpload: (file: File) => void;
}) {
  const previewSrc = src?.startsWith("/uploads/") ? `/api/orbit/media/file?path=${encodeURIComponent(src)}` : src;
  return (
    <div className="mt-3 text-sm">
      <p className="font-medium">{label}</p>
      {src ? <img src={previewSrc} alt="" className="mt-2 h-40 w-full rounded-xl object-cover" /> : null}
      <label className="mt-2 inline-flex cursor-pointer rounded-full bg-[#F47B20] px-4 py-2 text-white">
        Upload
        <input type="file" accept="image/*" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) onUpload(f); }} />
      </label>
    </div>
  );
}

type EditorProps = {
  slice: CatalogAdminSlice;
  setSlice: (next: CatalogAdminSlice) => void;
  publish: (next: CatalogAdminSlice) => void;
  upload: (file: File, apply: (path: string) => void) => void;
};

export function AdminCategoriesEditor({ slice, setSlice, publish }: EditorProps) {
  return (
    <CategoryManager
      categories={slice.categories}
      packageCategories={slice.packageCategories}
      services={slice.services}
      packages={slice.packages}
      onChange={(next) => setSlice({ ...slice, ...next })}
      onPublish={(next) => publish({ ...slice, ...next })}
    />
  );
}

export function AdminGalleryEditor({ slice, setSlice, publish, upload }: EditorProps) {
  return (
    <GalleryCategoryBank
      gallery={slice.gallery}
      setGallery={(gallery) => setSlice({ ...slice, gallery })}
      publishGallery={(gallery) => publish({ ...slice, gallery })}
      upload={upload}
    />
  );
}

export function AdminServicesEditor({ slice, setSlice, publish, upload }: EditorProps) {
  const [open, setOpen] = useState(0);
  const base = defaultServices[0];

  function patchService(index: number, patch: Partial<Service>) {
    const services = slice.services.map((s, i) => (i === index ? { ...s, ...patch } : s));
    setSlice({ ...slice, services });
  }

  return (
    <>
      <p className="text-sm text-[#6B6B6B]">Full menu — each treatment has its own page at /services/[slug].</p>
      <button
        type="button"
        className="mt-4 rounded-full bg-[#fff7f0] px-5 py-3 text-sm font-semibold text-[#c45a0a]"
        onClick={() =>
          publish({
            ...slice,
            services: [
              ...slice.services,
              {
                ...base,
                slug: `treatment-${Date.now()}`,
                name: "New treatment",
                summary: "Short tagline",
                overview: "Full description for the treatment page.",
                image: CATALOG_COMING_SOON_IMAGE,
                category: (slice.categories[0] || "massage") as Service["category"],
              },
            ],
          })
        }
      >
        Add treatment
      </button>
      <div className="mt-6 flex flex-wrap gap-2">
        {slice.services.map((s, i) => (
          <button key={`${s.slug}-${i}`} type="button" onClick={() => setOpen(i)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${open === i ? "bg-[#171717] text-white" : "border border-[#efe8e0] bg-white"}`}>
            {s.name.slice(0, 28)}
          </button>
        ))}
      </div>
      {slice.services[open] && (
        <div className="mt-6 space-y-1 rounded-2xl border border-[#efe8e0] bg-[#fffdfb] p-5">
          {(() => {
            const s = slice.services[open];
            const index = open;
            return (
              <>
                <Link href={`/services/${s.slug}`} target="_blank" className="text-sm font-semibold text-[#F47B20] underline">Preview live page →</Link>
                <Field label="URL slug" value={s.slug} onChange={(v) => patchService(index, { slug: v })} />
                <Field label="Name" value={s.name} onChange={(v) => patchService(index, { name: v })} />
                <label className="mt-3 block text-sm">
                  Category
                  <select value={s.category} onChange={(e) => patchService(index, { category: e.target.value as Service["category"] })} className="mt-1 w-full rounded-xl border border-[#efe8e0] px-3 py-3">
                    {slice.categories.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </label>
                <Area label="Summary" value={s.summary} onChange={(v) => patchService(index, { summary: v })} />
                <Area label="Overview (detail page)" value={s.overview} onChange={(v) => patchService(index, { overview: v })} rows={6} />
                <Field label="Primary duration (minutes)" value={String(s.durationMinutes)} onChange={(v) => patchService(index, { durationMinutes: Number(v) || 0 })} />
                <Area label="Duration & price lines" value={s.durationOptions.join("\n")} onChange={(v) => patchService(index, { durationOptions: v.split("\n").map((l) => l.trim()).filter(Boolean) })} />
                <Field label="Price from (NPR)" value={String(s.priceFromNpr)} onChange={(v) => patchService(index, { priceFromNpr: Number(v) || 0 })} />
                <Area label="Benefits (one per line)" value={s.benefits.join("\n")} onChange={(v) => patchService(index, { benefits: v.split("\n").map((l) => l.trim()).filter(Boolean) })} />
                <Area label="What to expect (one per line)" value={s.expect.join("\n")} onChange={(v) => patchService(index, { expect: v.split("\n").map((l) => l.trim()).filter(Boolean) })} />
                <MediaField label="Image" src={s.image} onUpload={(file) => upload(file, (image) => publish({ ...slice, services: slice.services.map((x, i) => (i === index ? { ...x, image } : x)) }))} />
                <Field label="Image alt" value={s.imageAlt} onChange={(v) => patchService(index, { imageAlt: v })} />
                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" className="rounded-full bg-[#F47B20] px-5 py-2.5 text-sm font-semibold text-white" onClick={() => publish(slice)}>Save services to live site</button>
                  <button type="button" className="text-sm text-red-700 underline" onClick={() => publish({ ...slice, services: slice.services.filter((_, i) => i !== index) })}>Remove treatment</button>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </>
  );
}

export function AdminPackagesEditor({ slice, setSlice, publish, upload }: EditorProps) {
  const [open, setOpen] = useState(0);
  const template = slice.packages[0] || {
    slug: "new-package",
    name: "New package",
    category: slice.packageCategories[0] || "wellness",
    summary: "",
    description: "",
    durationLabel: "",
    priceNpr: 0,
    priceIsPlaceholder: true as const,
    items: [],
    image: CATALOG_COMING_SOON_IMAGE,
    imageAlt: "",
  };

  function patchPackage(index: number, patch: Partial<SpaPackage>) {
    const packages = slice.packages.map((p, i) => (i === index ? { ...p, ...patch } : p));
    setSlice({ ...slice, packages });
  }

  return (
    <>
      <p className="text-sm text-[#6B6B6B]">Each package has a detail page at /packages/[slug].</p>
      <button type="button" className="mt-4 rounded-full bg-[#fff7f0] px-5 py-3 text-sm font-semibold text-[#c45a0a]" onClick={() => publish({ ...slice, packages: [...slice.packages, { ...template, slug: `package-${Date.now()}`, name: "New package" }] })}>Add package</button>
      <div className="mt-6 flex flex-wrap gap-2">
        {slice.packages.map((p, i) => (
          <button key={`${p.slug}-${i}`} type="button" onClick={() => setOpen(i)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${open === i ? "bg-[#171717] text-white" : "border border-[#efe8e0] bg-white"}`}>{p.name.slice(0, 28)}</button>
        ))}
      </div>
      {slice.packages[open] && (
        <div className="mt-6 rounded-2xl border border-[#efe8e0] bg-[#fffdfb] p-5">
          {(() => {
            const p = slice.packages[open];
            const index = open;
            return (
              <>
                <Link href={`/packages/${p.slug}`} target="_blank" className="text-sm font-semibold text-[#F47B20] underline">Preview live page →</Link>
                <Field label="URL slug" value={p.slug} onChange={(v) => patchPackage(index, { slug: v })} />
                <Field label="Name" value={p.name} onChange={(v) => patchPackage(index, { name: v })} />
                <label className="mt-3 block text-sm">
                  Category
                  <select value={p.category || slice.packageCategories[0]} onChange={(e) => patchPackage(index, { category: e.target.value })} className="mt-1 w-full rounded-xl border border-[#efe8e0] px-3 py-3">
                    {slice.packageCategories.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </label>
                <Area label="Summary" value={p.summary} onChange={(v) => patchPackage(index, { summary: v })} />
                <Area label="Description" value={p.description} onChange={(v) => patchPackage(index, { description: v })} rows={6} />
                <Field label="Duration label" value={p.durationLabel} onChange={(v) => patchPackage(index, { durationLabel: v })} />
                <Field label="Price (NPR)" value={String(p.priceNpr)} onChange={(v) => patchPackage(index, { priceNpr: Number(v) || 0 })} />
                <Field label="Compare-at NPR (optional)" value={String(p.compareAtNpr ?? "")} onChange={(v) => patchPackage(index, { compareAtNpr: Number(v) || undefined })} />
                <Area label="Items (Name | detail per line)" value={p.items.map((item) => `${item.name} | ${item.detail}`).join("\n")} onChange={(v) => patchPackage(index, { items: v.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => { const [name, detail] = line.split("|").map((x) => x.trim()); return { name: name || "Item", detail: detail || "" }; }) })} />
                <MediaField label="Image" src={p.image} onUpload={(file) => upload(file, (image) => publish({ ...slice, packages: slice.packages.map((x, i) => (i === index ? { ...x, image } : x)) }))} />
                <Field label="Image alt" value={p.imageAlt} onChange={(v) => patchPackage(index, { imageAlt: v })} />
                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" className="rounded-full bg-[#F47B20] px-5 py-2.5 text-sm font-semibold text-white" onClick={() => publish(slice)}>Save packages to live site</button>
                  <button type="button" className="text-sm text-red-700 underline" onClick={() => publish({ ...slice, packages: slice.packages.filter((_, i) => i !== index) })}>Remove package</button>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </>
  );
}
