"use client";

import type { OrbitContent } from "@/lib/orbit-store";
import { useEffect, useRef, useState } from "react";

const sections = ["Hero", "Media", "Therapies", "Services", "Categories", "Packages", "Gallery", "Footer"] as const;

type MediaItem = { path: string; name: string; kind: "image" | "video"; size: number };

export function OrbitPanel({ initial }: { initial: OrbitContent }) {
  const [content, setContent] = useState(initial);
  const [section, setSection] = useState<(typeof sections)[number]>("Hero");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [library, setLibrary] = useState<MediaItem[]>([]);
  const [picker, setPicker] = useState<((path: string, kind: "image" | "video") => void) | null>(null);
  const contentRef = useRef(content);
  contentRef.current = content;

  useEffect(() => {
    loadLibrary();
  }, []);

  async function loadLibrary() {
    const response = await fetch("/api/orbit/media", { credentials: "same-origin" });
    const body = await response.json().catch(() => ({}));
    if (response.ok) setLibrary(body.data || []);
  }

  async function persist(next = contentRef.current) {
    setSaving(true);
    setError("");
    const response = await fetch("/api/orbit", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const body = await response.json().catch(() => ({}));
    setSaving(false);
    if (!response.ok) {
      setError(body.message || "Could not save. The live site was not changed.");
      return false;
    }
    setMessage("Live site updated.");
    return true;
  }

  function publish(next: OrbitContent) {
    setContent(next);
    contentRef.current = next;
    void persist(next);
  }

  async function upload(file: File, apply: (path: string, kind: "image" | "video") => void) {
    setError("");
    setMessage(`Uploading ${file.name}…`);
    const form = new FormData();
    form.set("file", file);
    const response = await fetch("/api/orbit/media", { method: "POST", credentials: "same-origin", body: form });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(body.message || `Upload failed for ${file.name}.`);
      setMessage("");
      return;
    }
    apply(body.path, body.kind);
    await loadLibrary();
    setMessage("Uploaded and published to the live site.");
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
          <button type="button" onClick={() => persist()} disabled={saving} className="rounded-full bg-[#F47B20] px-6 py-3 text-sm font-medium text-white hover:bg-[#e06d12] disabled:opacity-60">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
        {message && <p className="mt-3 text-sm text-[#2f8f45]">{message}</p>}
        {error && <p className="mt-3 text-sm text-[#c45e0a]">{error}</p>}
        <div className="mt-8 max-w-4xl space-y-5">
          {section === "Hero" && (
            <>
              <div className="rounded-2xl border border-[#efe8e0] bg-white p-5">
                <p className="text-sm font-semibold">Hero media</p>
                <p className="mt-1 text-sm text-[#6B6B6B]">One still photo or video, or fade 1–10 files. Uploads publish immediately.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="text-sm">
                    Mode
                    <select
                      value={hero.display}
                      onChange={(event) => publish({ ...content, hero: { ...hero, display: event.target.value as typeof hero.display } })}
                      className="mt-1 w-full rounded-xl border border-[#efe8e0] px-3 py-3"
                    >
                      <option value="still">Single image or video</option>
                      <option value="slider">Fade through media</option>
                    </select>
                  </label>
                  <label className="text-sm">
                    Animation
                    <select
                      value={hero.animation}
                      onChange={(event) => publish({ ...content, hero: { ...hero, animation: event.target.value as typeof hero.animation } })}
                      className="mt-1 w-full rounded-xl border border-[#efe8e0] px-3 py-3"
                    >
                      <option value="fade">Fade</option>
                      <option value="none">Off</option>
                    </select>
                  </label>
                </div>
                <Field label="Fade duration (ms)" value={String(hero.intervalMs)} onChange={(value) => setContent({ ...content, hero: { ...hero, intervalMs: Number(value) || 6000 } })} />
              </div>
              {hero.slides.map((slide, index) => (
                <div key={`${slide.src}-${index}`} className="space-y-3 rounded-2xl border border-[#efe8e0] bg-white p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{slide.kind === "video" ? "Video" : "Image"} {index + 1}</p>
                    {hero.slides.length > 1 && (
                      <button type="button" className="text-xs text-[#c45e0a]" onClick={() => updateSlides(hero.slides.filter((_, i) => i !== index))}>
                        Remove
                      </button>
                    )}
                  </div>
                  <Field label="Alt text" value={slide.alt} onChange={(value) => updateSlide(index, { alt: value })} />
                  <MediaField
                    label="Replace file"
                    src={slide.src}
                    kind={slide.kind}
                    onUpload={(file) => upload(file, (src, kind) => updateSlide(index, { src, kind }))}
                    onLibrary={() => setPicker((src, kind) => updateSlide(index, { src, kind }))}
                  />
                </div>
              ))}
              {hero.slides.length < 10 && (
                <button type="button" className="rounded-full border border-[#efe8e0] bg-white px-5 py-3 text-sm" onClick={() => updateSlides([...hero.slides, { src: "", alt: "KAYA SPA hero", kind: "image" }])}>
                  Add image or video
                </button>
              )}
              <div className="rounded-2xl border border-[#efe8e0] bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Hero text</p>
                  <button
                    type="button"
                    className="text-xs text-[#c45e0a]"
                    onClick={() =>
                      publish({
                        ...content,
                        hero: { ...hero, eyebrow: "", titleOrange: "", titleDark: "", subtitle: "", body: "", explore: "", book: "" },
                      })
                    }
                  >
                    Clear text
                  </button>
                </div>
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
          {section === "Media" && (
            <div className="rounded-2xl border border-[#efe8e0] bg-white p-5">
              <p className="text-sm font-semibold">Media library</p>
              <p className="mt-1 text-sm text-[#6B6B6B]">Images up to 25 MB. Videos up to 120 MB. Click a file to copy its path, or use Replace on any section.</p>
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime" className="mt-4 block text-sm" onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file, () => undefined);
              }} />
              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
                {library.map((item) => (
                  <article key={item.path} className="overflow-hidden rounded-xl border border-[#efe8e0]">
                    {item.kind === "video" ? <video src={item.path} className="h-28 w-full object-cover" muted /> : <img src={item.path} alt="" className="h-28 w-full object-cover" />}
                    <p className="truncate px-2 py-2 text-[11px] text-[#6B6B6B]">{item.name}</p>
                  </article>
                ))}
              </div>
            </div>
          )}
          {section === "Therapies" && (
            <>
              <Field label="Eyebrow" value={content.therapies.eyebrow} onChange={(value) => setContent({ ...content, therapies: { ...content.therapies, eyebrow: value } })} />
              <Field label="Title orange" value={content.therapies.titleOrange} onChange={(value) => setContent({ ...content, therapies: { ...content.therapies, titleOrange: value } })} />
              <Field label="Title dark" value={content.therapies.titleDark} onChange={(value) => setContent({ ...content, therapies: { ...content.therapies, titleDark: value } })} />
              <Area label="Intro" value={content.therapies.intro} onChange={(value) => setContent({ ...content, therapies: { ...content.therapies, intro: value } })} />
              <MediaField label="Section image" src={content.therapies.image} onUpload={(file) => upload(file, (image) => publish({ ...content, therapies: { ...content.therapies, image } }))} onLibrary={() => setPicker((image) => publish({ ...content, therapies: { ...content.therapies, image } }))} />
              {content.therapies.cards.map((card, index) => (
                <div key={index} className="space-y-3 rounded-2xl border border-[#efe8e0] bg-white p-5">
                  <Field label="Card title" value={card.title} onChange={(value) => updateCard(index, { title: value })} />
                  <Area label="Card text" value={card.text} onChange={(value) => updateCard(index, { text: value })} />
                  <MediaField label="Card image" src={card.image} onUpload={(file) => upload(file, (image) => updateCard(index, { image }))} onLibrary={() => setPicker((image) => updateCard(index, { image }))} />
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
                  <MediaField label="Image" src={service.image} onUpload={(file) => upload(file, (image) => updateService(index, { image }))} onLibrary={() => setPicker((image) => updateService(index, { image }))} />
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
                <MediaField label="Image" src={item.image} onUpload={(file) => upload(file, (image) => updatePackage(index, { image }))} onLibrary={() => setPicker((image) => updatePackage(index, { image }))} />
              </div>
            ))}
          {section === "Gallery" &&
            content.gallery.map((image, index) => (
              <div key={image.id} className="rounded-2xl border border-[#efe8e0] bg-white p-5">
                <Field label="Alt text" value={image.alt} onChange={(value) => updateGallery(index, { alt: value })} />
                <MediaField label={image.category} src={image.src} onUpload={(file) => upload(file, (src) => updateGallery(index, { src }))} onLibrary={() => setPicker((src) => updateGallery(index, { src }))} />
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
      {picker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="max-h-[80vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="font-serif text-2xl">Choose from library</p>
              <button type="button" onClick={() => setPicker(null)}>Close</button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {library.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  className="overflow-hidden rounded-xl border border-[#efe8e0]"
                  onClick={() => {
                    picker(item.path, item.kind);
                    setPicker(null);
                  }}
                >
                  {item.kind === "video" ? <video src={item.path} className="h-24 w-full object-cover" muted /> : <img src={item.path} alt="" className="h-24 w-full object-cover" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function updateSlides(slides: OrbitContent["hero"]["slides"]) {
    publish({ ...contentRef.current, hero: { ...contentRef.current.hero, slides, image: slides[0]?.src || contentRef.current.hero.image } });
  }
  function updateSlide(index: number, patch: Partial<OrbitContent["hero"]["slides"][number]>) {
    updateSlides(contentRef.current.hero.slides.map((item, i) => (i === index ? { ...item, ...patch } : item)));
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
    const cards = contentRef.current.therapies.cards.map((item, i) => (i === index ? { ...item, ...patch } : item));
    publish({ ...contentRef.current, therapies: { ...contentRef.current.therapies, cards } });
  }
  function updateService(index: number, patch: Partial<OrbitContent["services"][number]>) {
    const next = { ...contentRef.current, services: contentRef.current.services.map((item, i) => (i === index ? { ...item, ...patch } : item)) };
    if (patch.image) publish(next);
    else setContent(next);
  }
  function updatePackage(index: number, patch: Partial<OrbitContent["packages"][number]>) {
    const next = { ...contentRef.current, packages: contentRef.current.packages.map((item, i) => (i === index ? { ...item, ...patch } : item)) };
    if (patch.image) publish(next);
    else setContent(next);
  }
  function updateGallery(index: number, patch: Partial<OrbitContent["gallery"][number]>) {
    const next = { ...contentRef.current, gallery: contentRef.current.gallery.map((item, i) => (i === index ? { ...item, ...patch } : item)) };
    if (patch.src) publish(next);
    else setContent(next);
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

function MediaField({
  label,
  src,
  kind,
  onUpload,
  onLibrary,
}: {
  label: string;
  src: string;
  kind?: "image" | "video";
  onUpload: (file: File) => void;
  onLibrary: () => void;
}) {
  return (
    <div className="mt-3 text-sm">
      <p>{label}</p>
      {src && (kind === "video" || /\.(mp4|webm|mov)$/i.test(src) ? <video src={src} className="mt-2 h-28 w-44 rounded-xl object-cover" muted /> : <img src={src} alt="" className="mt-2 h-28 w-44 rounded-xl object-cover" />)}
      <div className="mt-2 flex flex-wrap gap-3">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
          className="block text-xs"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onUpload(file);
          }}
        />
        <button type="button" className="text-xs text-[#F47B20]" onClick={onLibrary}>
          Choose from library
        </button>
      </div>
    </div>
  );
}
