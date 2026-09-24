"use client";

import type { OrbitContent } from "@/lib/orbit-store";
import { useState } from "react";
import { useRouter } from "next/navigation";

const sections = ["Hero", "Therapies", "Services", "Categories", "Packages", "Gallery", "Footer"] as const;

export function OrbitPanel({ initial }: { initial: OrbitContent }) {
  const router = useRouter();
  const [content, setContent] = useState(initial);
  const [section, setSection] = useState<(typeof sections)[number]>("Hero");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/orbit", {
      method: "PUT",
      credentials: "same-origin",
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
    const response = await fetch("/api/orbit", { method: "PATCH", credentials: "same-origin", body: form });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(body.message || "Upload failed.");
      return;
    }
    apply(body.path);
    setMessage("Image uploaded. Save to publish it.");
  }

  async function logout() {
    await fetch("/api/orbit", { method: "DELETE", credentials: "same-origin" });
    window.location.assign("/orbit/login");
  }

  const hero = content.hero;

  return (
    <div className="flex min-h-[100svh] bg-[#f7f2ea] text-[#171717]">
      <aside className="flex w-64 shrink-0 flex-col bg-[#171717] text-white">
        <div className="px-6 py-8">
          <p className="text-[11px] tracking-[0.28em] text-[#F47B20] uppercase">KAYA SPA</p>
          <p className="mt-2 font-serif text-4xl">Orbit</p>
          <p className="mt-2 text-xs text-white/50">Edit the living site</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {sections.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSection(item)}
              className={`rounded-xl px-4 py-3 text-left text-sm ${section === item ? "bg-white/10 text-[#F47B20]" : "text-white/70 hover:text-white"}`}
            >
              {item}
            </button>
          ))}
        </nav>
        <button type="button" onClick={logout} className="m-4 rounded-full border border-white/15 px-4 py-2 text-xs tracking-[0.16em] uppercase">
          Sign out
        </button>
      </aside>
      <section className="min-w-0 flex-1 px-6 py-8 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-[0.22em] text-[#F47B20] uppercase">Studio</p>
            <h1 className="mt-1 font-serif text-4xl">{section}</h1>
          </div>
          <button type="button" onClick={save} disabled={saving} className="rounded-full bg-[#F47B20] px-6 py-3 text-sm font-medium text-white hover:bg-[#e06d12] disabled:opacity-60">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
        {message && <p className="mt-3 text-sm text-[#2f8f45]">{message}</p>}
        <div className="mt-8 max-w-4xl space-y-5">
          {section === "Hero" && (
            <>
              <div className="rounded-2xl border border-[#efe8e0] bg-white p-5">
                <p className="text-sm font-semibold">Hero photographs</p>
                <p className="mt-1 text-sm text-[#6B6B6B]">Keep one still image, or add up to 8 slides.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="text-sm">
                    Display
                    <select
                      value={hero.display}
                      onChange={(event) => setContent({ ...content, hero: { ...hero, display: event.target.value as typeof hero.display } })}
                      className="mt-1 w-full rounded-xl border border-[#efe8e0] px-3 py-3"
                    >
                      <option value="still">Still image</option>
                      <option value="slider">Slider</option>
                    </select>
                  </label>
                  <label className="text-sm">
                    Animation
                    <select
                      value={hero.animation}
                      onChange={(event) => setContent({ ...content, hero: { ...hero, animation: event.target.value as typeof hero.animation } })}
                      className="mt-1 w-full rounded-xl border border-[#efe8e0] px-3 py-3"
                    >
                      <option value="fade">Fade</option>
                      <option value="slide">Slide</option>
                      <option value="none">None</option>
                    </select>
                  </label>
                </div>
                <Field
                  label="Slide duration (ms)"
                  value={String(hero.intervalMs)}
                  onChange={(value) => setContent({ ...content, hero: { ...hero, intervalMs: Number(value) || 6000 } })}
                />
              </div>
              {hero.slides.map((slide, index) => (
                <div key={`${slide.src}-${index}`} className="space-y-3 rounded-2xl border border-[#efe8e0] bg-white p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Slide {index + 1}</p>
                    {hero.slides.length > 1 && (
                      <button type="button" className="text-xs text-[#c45e0a]" onClick={() => updateSlides(hero.slides.filter((_, i) => i !== index))}>
                        Remove
                      </button>
                    )}
                  </div>
                  <Field label="Alt text" value={slide.alt} onChange={(value) => updateSlide(index, { alt: value })} />
                  <ImageField label="Photograph" src={slide.src} onUpload={(file) => upload(file, (src) => updateSlide(index, { src }))} />
                </div>
              ))}
              {hero.slides.length < 8 && (
                <button
                  type="button"
                  className="rounded-full border border-[#efe8e0] bg-white px-5 py-3 text-sm"
                  onClick={() => updateSlides([...hero.slides, { src: hero.image, alt: hero.alt }])}
                >
                  Add slide
                </button>
              )}
              <div className="rounded-2xl border border-[#efe8e0] bg-white p-5">
                <Field label="Eyebrow" value={hero.eyebrow} onChange={(value) => setContent({ ...content, hero: { ...hero, eyebrow: value } })} />
                <Field label="Title orange" value={hero.titleOrange} onChange={(value) => setContent({ ...content, hero: { ...hero, titleOrange: value } })} />
                <Field label="Title dark" value={hero.titleDark} onChange={(value) => setContent({ ...content, hero: { ...hero, titleDark: value } })} />
                <Field label="Subtitle" value={hero.subtitle} onChange={(value) => setContent({ ...content, hero: { ...hero, subtitle: value } })} />
                <Area label="Intro" value={hero.body} onChange={(value) => setContent({ ...content, hero: { ...hero, body: value } })} />
                <Field label="Explore button" value={hero.explore} onChange={(value) => setContent({ ...content, hero: { ...hero, explore: value } })} />
                <Field label="Book button" value={hero.book} onChange={(value) => setContent({ ...content, hero: { ...hero, book: value } })} />
              </div>
              {hero.points.map((point, index) => (
                <div key={index} className="grid gap-3 rounded-2xl border border-[#efe8e0] bg-white p-5 md:grid-cols-2">
                  <Field label={`Point ${index + 1} title`} value={point.title} onChange={(value) => updatePoint(index, { title: value })} />
                  <Field label="Line" value={point.text} onChange={(value) => updatePoint(index, { text: value })} />
                </div>
              ))}
              {hero.features.map((feature, index) => (
                <div key={index} className="grid gap-3 rounded-2xl border border-[#efe8e0] bg-white p-5 md:grid-cols-2">
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
                <div key={index} className="space-y-3 rounded-2xl border border-[#efe8e0] bg-white p-5">
                  <Field label="Card title" value={card.title} onChange={(value) => updateCard(index, { title: value })} />
                  <Area label="Card text" value={card.text} onChange={(value) => updateCard(index, { text: value })} />
                  <ImageField label="Card image" src={card.image} onUpload={(file) => upload(file, (image) => updateCard(index, { image }))} />
                </div>
              ))}
            </>
          )}
          {section === "Services" && (
            <>
              <button type="button" className="rounded-full border border-[#efe8e0] bg-white px-5 py-3 text-sm" onClick={() => setContent({ ...content, services: [...content.services, { ...content.services[0], slug: `service-${Date.now()}`, name: "New treatment", summary: "Describe this treatment." }] })}>
                Add treatment
              </button>
              {content.services.map((service, index) => (
                <div key={service.slug} className="space-y-3 rounded-2xl border border-[#efe8e0] bg-white p-5">
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
              <button type="button" className="rounded-full border border-[#efe8e0] bg-white px-5 py-3 text-sm" onClick={() => setContent({ ...content, categories: [...content.categories, "new-category"] })}>
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
              <div key={item.slug} className="space-y-3 rounded-2xl border border-[#efe8e0] bg-white p-5">
                <Field label="Name" value={item.name} onChange={(value) => updatePackage(index, { name: value })} />
                <Area label="Summary" value={item.summary} onChange={(value) => updatePackage(index, { summary: value })} />
                <Field label="Price NPR" value={String(item.priceNpr)} onChange={(value) => updatePackage(index, { priceNpr: Number(value) || 0 })} />
                <ImageField label="Image" src={item.image} onUpload={(file) => upload(file, (image) => updatePackage(index, { image }))} />
              </div>
            ))}
          {section === "Gallery" &&
            content.gallery.map((image, index) => (
              <div key={image.id} className="rounded-2xl border border-[#efe8e0] bg-white p-5">
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
        </div>
      </section>
    </div>
  );

  function updateSlides(slides: OrbitContent["hero"]["slides"]) {
    setContent({ ...content, hero: { ...content.hero, slides, image: slides[0]?.src || content.hero.image } });
  }
  function updateSlide(index: number, patch: Partial<OrbitContent["hero"]["slides"][number]>) {
    updateSlides(content.hero.slides.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }
  function updatePoint(index: number, patch: Partial<OrbitContent["hero"]["points"][number]>) {
    const points = content.hero.points.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setContent({ ...content, hero: { ...content.hero, points } });
  }
  function updateFeature(index: number, patch: Partial<OrbitContent["hero"]["features"][number]>) {
    const features = content.hero.features.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setContent({ ...content, hero: { ...content.hero, features } });
  }
  function updateCard(index: number, patch: Partial<OrbitContent["therapies"]["cards"][number]>) {
    const cards = content.therapies.cards.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setContent({ ...content, therapies: { ...content.therapies, cards } });
  }
  function updateService(index: number, patch: Partial<OrbitContent["services"][number]>) {
    setContent({ ...content, services: content.services.map((item, i) => (i === index ? { ...item, ...patch } : item)) });
  }
  function updatePackage(index: number, patch: Partial<OrbitContent["packages"][number]>) {
    setContent({ ...content, packages: content.packages.map((item, i) => (i === index ? { ...item, ...patch } : item)) });
  }
  function updateGallery(index: number, patch: Partial<OrbitContent["gallery"][number]>) {
    setContent({ ...content, gallery: content.gallery.map((item, i) => (i === index ? { ...item, ...patch } : item)) });
  }
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="mt-3 block text-sm">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-xl border border-[#efe8e0] bg-white px-3 py-3" />
    </label>
  );
}

function Area({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="mt-3 block text-sm">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className="mt-1 w-full rounded-xl border border-[#efe8e0] bg-white px-3 py-3" />
    </label>
  );
}

function ImageField({ label, src, onUpload }: { label: string; src: string; onUpload: (file: File) => void }) {
  return (
    <div className="mt-3 text-sm">
      <p>{label}</p>
      {src && <img src={src} alt="" className="mt-2 h-28 w-44 rounded-xl object-cover" />}
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
