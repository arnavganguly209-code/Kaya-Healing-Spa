"use client";

import type { OrbitContent } from "@/lib/orbit-store";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const sections = ["Hero", "Therapies", "Services", "Categories", "Packages", "Gallery", "Footer"] as const;

export function OrbitPanel({ initial }: { initial: OrbitContent }) {
  const router = useRouter();
  const [content, setContent] = useState(initial);
  const [section, setSection] = useState<(typeof sections)[number]>("Hero");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const imageFields = useMemo(() => collectImages(content), [content]);

  async function save() {
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/orbit", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    setMessage(response.ok ? "Saved. The live site uses this copy now." : "Could not save.");
    if (response.ok) router.refresh();
  }

  async function upload(file: File, apply: (path: string) => void) {
    const form = new FormData();
    form.set("file", file);
    const response = await fetch("/api/orbit", { method: "PATCH", body: form });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(body.message || "Upload failed.");
      return;
    }
    apply(body.path);
    setMessage("Image uploaded. Save to publish it.");
  }

  async function logout() {
    await fetch("/api/orbit", { method: "DELETE" });
    router.push("/orbit/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-[100svh] bg-[#f6f1e8] text-[#141210]">
      <aside className="flex w-64 shrink-0 flex-col bg-[#141210] text-white">
        <div className="border-b border-white/10 px-5 py-6">
          <p className="text-xs tracking-[0.22em] uppercase text-[#e8771a]">KAYA SPA</p>
          <p className="mt-2 font-serif text-3xl">Orbit</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {sections.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSection(item)}
              className={`px-3 py-3 text-left text-sm ${section === item ? "bg-white/10 text-[#e8771a]" : "text-white/75"}`}
            >
              {item}
            </button>
          ))}
        </nav>
        <button type="button" onClick={logout} className="m-3 border border-white/20 px-3 py-2 text-xs tracking-[0.14em] uppercase">
          Sign out
        </button>
      </aside>
      <section className="min-w-0 flex-1 px-6 py-8 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-serif text-4xl">{section}</h1>
          <button type="button" onClick={save} disabled={saving} className="btn-primary">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
        {message && <p className="mt-3 text-sm text-[#2f8f45]">{message}</p>}
        <div className="mt-8 max-w-3xl space-y-5">
          {section === "Hero" && (
            <>
              <Field label="Eyebrow" value={content.hero.eyebrow} onChange={(value) => setContent({ ...content, hero: { ...content.hero, eyebrow: value } })} />
              <Field label="Title orange" value={content.hero.titleOrange} onChange={(value) => setContent({ ...content, hero: { ...content.hero, titleOrange: value } })} />
              <Field label="Title dark" value={content.hero.titleDark} onChange={(value) => setContent({ ...content, hero: { ...content.hero, titleDark: value } })} />
              <Field label="Subtitle" value={content.hero.subtitle} onChange={(value) => setContent({ ...content, hero: { ...content.hero, subtitle: value } })} />
              <Area label="Intro" value={content.hero.body} onChange={(value) => setContent({ ...content, hero: { ...content.hero, body: value } })} />
              <Field label="Explore button" value={content.hero.explore} onChange={(value) => setContent({ ...content, hero: { ...content.hero, explore: value } })} />
              <Field label="Book button" value={content.hero.book} onChange={(value) => setContent({ ...content, hero: { ...content.hero, book: value } })} />
              <ImageField label="Hero image" src={content.hero.image} onUpload={(file) => upload(file, (image) => setContent({ ...content, hero: { ...content.hero, image } }))} />
              {content.hero.features.map((feature, index) => (
                <div key={index} className="grid gap-3 border border-[#e6dfd4] bg-white p-4 md:grid-cols-2">
                  <Field label={`Feature ${index + 1} title`} value={feature.title} onChange={(value) => updateFeature(index, { title: value })} />
                  <Field label="Text" value={feature.text} onChange={(value) => updateFeature(index, { text: value })} />
                </div>
              ))}
            </>
          )}
          {section === "Therapies" && (
            <>
              <Field label="Eyebrow" value={content.therapies.eyebrow} onChange={(value) => setContent({ ...content, therapies: { ...content.therapies, eyebrow: value } })} />
              <Field label="Title orange" value={content.therapies.titleOrange} onChange={(value) => setContent({ ...content, therapies: { ...content.therapies, titleOrange: value } })} />
              <Field label="Title dark" value={content.therapies.titleDark} onChange={(value) => setContent({ ...content, therapies: { ...content.therapies, titleDark: value } })} />
              <Area label="Intro" value={content.therapies.intro} onChange={(value) => setContent({ ...content, therapies: { ...content.therapies, intro: value } })} />
              <ImageField label="Section image" src={content.therapies.image} onUpload={(file) => upload(file, (image) => setContent({ ...content, therapies: { ...content.therapies, image } }))} />
              {content.therapies.cards.map((card, index) => (
                <div key={index} className="space-y-3 border border-[#e6dfd4] bg-white p-4">
                  <Field label="Card title" value={card.title} onChange={(value) => updateCard(index, { title: value })} />
                  <Area label="Card text" value={card.text} onChange={(value) => updateCard(index, { text: value })} />
                  <ImageField label="Card image" src={card.image} onUpload={(file) => upload(file, (image) => updateCard(index, { image }))} />
                </div>
              ))}
            </>
          )}
          {section === "Services" && (
            <>
              <button type="button" className="btn-line" onClick={() => setContent({ ...content, services: [...content.services, { ...content.services[0], slug: `service-${Date.now()}`, name: "New treatment", summary: "Describe this treatment." }] })}>
                Add treatment
              </button>
              {content.services.map((service, index) => (
                <div key={service.slug} className="space-y-3 border border-[#e6dfd4] bg-white p-4">
                  <Field label="Name" value={service.name} onChange={(value) => updateService(index, { name: value })} />
                  <Field label="Category" value={service.category} onChange={(value) => updateService(index, { category: value as typeof service.category })} />
                  <Area label="Summary" value={service.summary} onChange={(value) => updateService(index, { summary: value })} />
                  <Field label="Price from NPR" value={String(service.priceFromNpr)} onChange={(value) => updateService(index, { priceFromNpr: Number(value) || 0 })} />
                  <ImageField label="Image" src={service.image} onUpload={(file) => upload(file, (image) => updateService(index, { image }))} />
                </div>
              ))}
            </>
          )}
          {section === "Categories" && (
            <>
              <button type="button" className="btn-line" onClick={() => setContent({ ...content, categories: [...content.categories, "new-category"] })}>
                Add category
              </button>
              {content.categories.map((category, index) => (
                <Field
                  key={index}
                  label={`Category ${index + 1}`}
                  value={category}
                  onChange={(value) => {
                    const categories = [...content.categories];
                    categories[index] = value;
                    setContent({ ...content, categories });
                  }}
                />
              ))}
            </>
          )}
          {section === "Packages" &&
            content.packages.map((item, index) => (
              <div key={item.slug} className="space-y-3 border border-[#e6dfd4] bg-white p-4">
                <Field label="Name" value={item.name} onChange={(value) => updatePackage(index, { name: value })} />
                <Area label="Summary" value={item.summary} onChange={(value) => updatePackage(index, { summary: value })} />
                <Field label="Price NPR" value={String(item.priceNpr)} onChange={(value) => updatePackage(index, { priceNpr: Number(value) || 0 })} />
                <ImageField label="Image" src={item.image} onUpload={(file) => upload(file, (image) => updatePackage(index, { image }))} />
              </div>
            ))}
          {section === "Gallery" &&
            content.gallery.map((image, index) => (
              <div key={image.id} className="border border-[#e6dfd4] bg-white p-4">
                <Field label="Alt text" value={image.alt} onChange={(value) => updateGallery(index, { alt: value })} />
                <ImageField label={image.category} src={image.src} onUpload={(file) => upload(file, (src) => updateGallery(index, { src }))} />
              </div>
            ))}
          {section === "Footer" && (
            <>
              <Field label="Phone" value={content.phone} onChange={(value) => setContent({ ...content, phone: value })} />
              <Field label="Email" value={content.email} onChange={(value) => setContent({ ...content, email: value })} />
              <Area label="Footer description" value={content.footerText} onChange={(value) => setContent({ ...content, footerText: value })} />
            </>
          )}
          {section === "Hero" && (
            <p className="text-xs text-[#8a8175]">{imageFields.length} images across the site can be replaced from these sections.</p>
          )}
        </div>
      </section>
    </div>
  );

  function updateFeature(index: number, patch: Partial<OrbitContent["hero"]["features"][number]>) {
    const features = content.hero.features.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setContent({ ...content, hero: { ...content.hero, features } });
  }
  function updateCard(index: number, patch: Partial<OrbitContent["therapies"]["cards"][number]>) {
    const cards = content.therapies.cards.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setContent({ ...content, therapies: { ...content.therapies, cards } });
  }
  function updateService(index: number, patch: Partial<OrbitContent["services"][number]>) {
    const next = content.services.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setContent({ ...content, services: next });
  }
  function updatePackage(index: number, patch: Partial<OrbitContent["packages"][number]>) {
    const next = content.packages.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setContent({ ...content, packages: next });
  }
  function updateGallery(index: number, patch: Partial<OrbitContent["gallery"][number]>) {
    const next = content.gallery.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setContent({ ...content, gallery: next });
  }
}

function collectImages(content: OrbitContent) {
  return [content.hero.image, content.therapies.image, ...content.therapies.cards.map((card) => card.image), ...content.services.map((service) => service.image), ...content.gallery.map((image) => image.src)];
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full border border-[#e6dfd4] bg-white px-3 py-3" />
    </label>
  );
}

function Area({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className="mt-1 w-full border border-[#e6dfd4] bg-white px-3 py-3" />
    </label>
  );
}

function ImageField({ label, src, onUpload }: { label: string; src: string; onUpload: (file: File) => void }) {
  return (
    <div className="text-sm">
      <p>{label}</p>
      {src && <img src={src} alt="" className="mt-2 h-28 w-44 object-cover" />}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="mt-2 block text-xs"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onUpload(file);
        }}
      />
    </div>
  );
}
