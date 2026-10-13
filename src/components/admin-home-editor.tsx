"use client";

import type { OrbitContent } from "@/lib/orbit-store";
import { useMemo, useState } from "react";

export type AdminHomeSlice = Pick<OrbitContent, "hero" | "therapies" | "whyKaya" | "homeAbout" | "homePage">;

const tabs = ["Hero", "Therapies", "Why Kaya", "Home about", "Sections & CTA"] as const;

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="mt-3 block text-sm">
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-[#efe8e0] px-3 py-3" />
    </label>
  );
}

function Area({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
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
  onRemove,
}: {
  label: string;
  src: string;
  onUpload: (file: File) => void;
  onRemove?: () => void;
}) {
  const previewSrc = src || "";
  return (
    <div className="mt-4 rounded-xl border border-[#efe8e0] bg-[#fffdfb] p-4">
      <p className="text-sm font-semibold">{label}</p>
      {src ? (
        <img src={previewSrc} alt="" className="mt-2 max-h-48 w-full rounded-lg object-cover" />
      ) : (
        <p className="mt-2 text-xs text-[#8a8175]">No image — upload to show on the live home page.</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <label className="inline-flex cursor-pointer rounded-full bg-[#F47B20] px-4 py-2 text-sm font-semibold text-white">
          Upload / replace
          <input type="file" accept="image/*,video/mp4,video/webm" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) onUpload(f); }} />
        </label>
        {src && onRemove ? (
          <button type="button" className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-700" onClick={onRemove}>
            Remove image
          </button>
        ) : null}
      </div>
      {src ? <p className="mt-2 truncate text-[11px] text-[#8a8175]">{src}</p> : null}
    </div>
  );
}

type Props = {
  slice: AdminHomeSlice;
  setSlice: (next: AdminHomeSlice) => void;
  publish: (next: AdminHomeSlice) => void;
  upload: (file: File, apply: (path: string) => void) => void;
};

export function AdminHomeEditor({ slice, setSlice, publish, upload }: Props) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Hero");
  const heroSlides = useMemo(() => {
    if (slice.hero.slides?.length) return slice.hero.slides;
    return [{ src: slice.hero.image, alt: slice.hero.alt, kind: "image" as const }];
  }, [slice.hero]);

  function patchHero(patch: Partial<AdminHomeSlice["hero"]>) {
    setSlice({ ...slice, hero: { ...slice.hero, ...patch } });
  }

  function updateSlides(slides: AdminHomeSlice["hero"]["slides"]) {
    const hero = { ...slice.hero, slides, image: slides[0]?.src || slice.hero.image, alt: slides[0]?.alt || slice.hero.alt };
    publish({ ...slice, hero });
  }

  return (
    <div>
      <p className="text-sm text-[#6B6B6B]">Edit every home page section. Uploads show a preview; use <strong>Publish all changes</strong> or section save buttons to go live.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide ${tab === t ? "bg-[#171717] text-white" : "border border-[#efe8e0] bg-white"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Hero" && (
        <div className="mt-6">
          <Field label="Title (orange)" value={slice.hero.titleOrange} onChange={(v) => patchHero({ titleOrange: v })} />
          <Field label="Title (dark)" value={slice.hero.titleDark} onChange={(v) => patchHero({ titleDark: v })} />
          <Area label="Subtitle" value={slice.hero.subtitle} onChange={(v) => patchHero({ subtitle: v })} />
          {heroSlides.map((slide, index) => (
            <div key={index} className="mt-4 rounded-2xl border border-[#efe8e0] p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Hero media {index + 1}</p>
                {heroSlides.length > 1 && (
                  <button type="button" className="text-xs text-red-700 underline" onClick={() => updateSlides(heroSlides.filter((_, i) => i !== index))}>
                    Remove slide
                  </button>
                )}
              </div>
              <Field label="Alt text" value={slide.alt} onChange={(v) => {
                const slides = heroSlides.map((s, i) => (i === index ? { ...s, alt: v } : s));
                patchHero({ slides, image: slides[0]?.src || slice.hero.image });
              }} />
              <MediaField
                label="Background image or video"
                src={slide.src}
                onUpload={(file) => upload(file, (path) => {
                  const kind = file.type.startsWith("video/") ? ("video" as const) : ("image" as const);
                  const slides = heroSlides.map((s, i) => (i === index ? { ...s, src: path, kind } : s));
                  updateSlides(slides);
                })}
                onRemove={() => {
                  const slides = heroSlides.map((s, i) => (i === index ? { ...s, src: "" } : s));
                  setSlice({ ...slice, hero: { ...slice.hero, slides } });
                }}
              />
            </div>
          ))}
          {heroSlides.length < 10 && (
            <button type="button" className="mt-3 rounded-full border px-4 py-2 text-sm" onClick={() => updateSlides([...heroSlides, { src: "", alt: "Kaya hero", kind: "image" }])}>
              Add hero slide
            </button>
          )}
          <p className="mt-6 font-semibold">Feature boxes</p>
          {slice.hero.features.map((f, i) => (
            <div key={i} className="mt-3 rounded-xl border p-4">
              <Field label="Title" value={f.title} onChange={(v) => {
                const features = slice.hero.features.map((x, j) => (j === i ? { ...x, title: v } : x));
                patchHero({ features });
              }} />
              <Field label="Text" value={f.text} onChange={(v) => {
                const features = slice.hero.features.map((x, j) => (j === i ? { ...x, text: v } : x));
                patchHero({ features });
              }} />
            </div>
          ))}
          <button type="button" className="mt-6 rounded-full bg-[#F47B20] px-5 py-2.5 text-sm font-semibold text-white" onClick={() => publish(slice)}>
            Save hero to live site
          </button>
        </div>
      )}

      {tab === "Therapies" && (
        <div className="mt-6">
          <Field label="Eyebrow" value={slice.therapies.eyebrow} onChange={(v) => setSlice({ ...slice, therapies: { ...slice.therapies, eyebrow: v } })} />
          <Field label="Title orange" value={slice.therapies.titleOrange} onChange={(v) => setSlice({ ...slice, therapies: { ...slice.therapies, titleOrange: v } })} />
          <Field label="Title dark" value={slice.therapies.titleDark} onChange={(v) => setSlice({ ...slice, therapies: { ...slice.therapies, titleDark: v } })} />
          <Area label="Intro" value={slice.therapies.intro} onChange={(v) => setSlice({ ...slice, therapies: { ...slice.therapies, intro: v } })} />
          <MediaField
            label="Section header image"
            src={slice.therapies.image}
            onUpload={(file) => upload(file, (image) => publish({ ...slice, therapies: { ...slice.therapies, image } }))}
            onRemove={() => publish({ ...slice, therapies: { ...slice.therapies, image: "" } })}
          />
          <p className="mt-6 font-semibold">Treatment cards</p>
          {slice.therapies.cards.map((card, index) => (
            <div key={index} className="mt-4 rounded-2xl border p-4">
              <div className="flex justify-between">
                <p className="text-sm font-semibold">Card {index + 1}</p>
                <button type="button" className="text-xs text-red-700 underline" onClick={() => publish({ ...slice, therapies: { ...slice.therapies, cards: slice.therapies.cards.filter((_, i) => i !== index) } })}>
                  Remove card
                </button>
              </div>
              <Field label="Title" value={card.title} onChange={(v) => {
                const cards = slice.therapies.cards.map((c, i) => (i === index ? { ...c, title: v } : c));
                setSlice({ ...slice, therapies: { ...slice.therapies, cards } });
              }} />
              <Area label="Text" value={card.text} onChange={(v) => {
                const cards = slice.therapies.cards.map((c, i) => (i === index ? { ...c, text: v } : c));
                setSlice({ ...slice, therapies: { ...slice.therapies, cards } });
              }} />
              <Field label="Link" value={card.href} onChange={(v) => {
                const cards = slice.therapies.cards.map((c, i) => (i === index ? { ...c, href: v } : c));
                setSlice({ ...slice, therapies: { ...slice.therapies, cards } });
              }} />
              <MediaField
                label="Card image"
                src={card.image}
                onUpload={(file) => upload(file, (image) => {
                  const cards = slice.therapies.cards.map((c, i) => (i === index ? { ...c, image } : c));
                  publish({ ...slice, therapies: { ...slice.therapies, cards } });
                })}
                onRemove={() => {
                  const cards = slice.therapies.cards.map((c, i) => (i === index ? { ...c, image: "" } : c));
                  publish({ ...slice, therapies: { ...slice.therapies, cards } });
                }}
              />
            </div>
          ))}
          <button type="button" className="mt-4 rounded-full border px-4 py-2 text-sm" onClick={() => setSlice({
            ...slice,
            therapies: {
              ...slice.therapies,
              cards: [...slice.therapies.cards, { title: "New card", text: "", image: "", href: "/services", alt: "", buttonLabel: "Learn More", category: "massage" }],
            },
          })}>
            Add therapy card
          </button>
          <button type="button" className="mt-6 rounded-full bg-[#F47B20] px-5 py-2.5 text-sm font-semibold text-white" onClick={() => publish(slice)}>
            Save therapies to live site
          </button>
        </div>
      )}

      {tab === "Why Kaya" && (
        <div className="mt-6">
          <Field label="Eyebrow" value={slice.whyKaya.eyebrow} onChange={(v) => setSlice({ ...slice, whyKaya: { ...slice.whyKaya, eyebrow: v } })} />
          <Field label="Title orange" value={slice.whyKaya.titleOrange} onChange={(v) => setSlice({ ...slice, whyKaya: { ...slice.whyKaya, titleOrange: v } })} />
          <Field label="Title dark" value={slice.whyKaya.titleDark} onChange={(v) => setSlice({ ...slice, whyKaya: { ...slice.whyKaya, titleDark: v } })} />
          <Area label="Intro" value={slice.whyKaya.intro} onChange={(v) => setSlice({ ...slice, whyKaya: { ...slice.whyKaya, intro: v } })} />
          <MediaField
            label="Main photo"
            src={slice.whyKaya.image}
            onUpload={(file) => upload(file, (image) => publish({ ...slice, whyKaya: { ...slice.whyKaya, image } }))}
            onRemove={() => publish({ ...slice, whyKaya: { ...slice.whyKaya, image: "" } })}
          />
          {slice.whyKaya.highlights.map((item, index) => (
            <div key={`h-${index}`} className="mt-3 rounded-xl border p-4">
              <Field label={`Highlight ${index + 1} title`} value={item.title} onChange={(v) => {
                const highlights = slice.whyKaya.highlights.map((h, i) => (i === index ? { ...h, title: v } : h));
                setSlice({ ...slice, whyKaya: { ...slice.whyKaya, highlights } });
              }} />
              <Area label="Text" value={item.text} onChange={(v) => {
                const highlights = slice.whyKaya.highlights.map((h, i) => (i === index ? { ...h, text: v } : h));
                setSlice({ ...slice, whyKaya: { ...slice.whyKaya, highlights } });
              }} />
            </div>
          ))}
          <button type="button" className="mt-6 rounded-full bg-[#F47B20] px-5 py-2.5 text-sm font-semibold text-white" onClick={() => publish(slice)}>
            Save Why Kaya to live site
          </button>
        </div>
      )}

      {tab === "Home about" && (
        <div className="mt-6">
          <Field label="Eyebrow" value={slice.homeAbout.eyebrow} onChange={(v) => setSlice({ ...slice, homeAbout: { ...slice.homeAbout, eyebrow: v } })} />
          <Field label="Title" value={slice.homeAbout.title} onChange={(v) => setSlice({ ...slice, homeAbout: { ...slice.homeAbout, title: v } })} />
          <Area label="Paragraph 1" value={slice.homeAbout.paragraph1} onChange={(v) => setSlice({ ...slice, homeAbout: { ...slice.homeAbout, paragraph1: v } })} />
          <Area label="Paragraph 2" value={slice.homeAbout.paragraph2} onChange={(v) => setSlice({ ...slice, homeAbout: { ...slice.homeAbout, paragraph2: v } })} />
          <MediaField
            label="Photo"
            src={slice.homeAbout.image}
            onUpload={(file) => upload(file, (image) => publish({ ...slice, homeAbout: { ...slice.homeAbout, image } }))}
            onRemove={() => publish({ ...slice, homeAbout: { ...slice.homeAbout, image: "" } })}
          />
          <button type="button" className="mt-6 rounded-full bg-[#F47B20] px-5 py-2.5 text-sm font-semibold text-white" onClick={() => publish(slice)}>
            Save home about to live site
          </button>
        </div>
      )}

      {tab === "Sections & CTA" && (
        <div className="mt-6">
          <p className="font-semibold">Orange visit band</p>
          <Field label="Title" value={slice.homePage.visit.title} onChange={(v) => setSlice({ ...slice, homePage: { ...slice.homePage, visit: { ...slice.homePage.visit, title: v } } })} />
          <Area label="Intro" value={slice.homePage.visit.intro} onChange={(v) => setSlice({ ...slice, homePage: { ...slice.homePage, visit: { ...slice.homePage.visit, intro: v } } })} />
          <MediaField
            label="Visit section photo"
            src={slice.homePage.visit.image}
            onUpload={(file) => upload(file, (path) => publish({ ...slice, homePage: { ...slice.homePage, visit: { ...slice.homePage.visit, image: path } } }))}
            onRemove={() => publish({ ...slice, homePage: { ...slice.homePage, visit: { ...slice.homePage.visit, image: "" } } })}
          />
          <p className="mt-6 font-semibold">Section headings</p>
          <Field label="Services eyebrow" value={slice.homePage.servicesEyebrow} onChange={(v) => setSlice({ ...slice, homePage: { ...slice.homePage, servicesEyebrow: v } })} />
          <Field label="Services title" value={slice.homePage.servicesTitle} onChange={(v) => setSlice({ ...slice, homePage: { ...slice.homePage, servicesTitle: v } })} />
          <Field label="Packages eyebrow" value={slice.homePage.packagesEyebrow} onChange={(v) => setSlice({ ...slice, homePage: { ...slice.homePage, packagesEyebrow: v } })} />
          <Field label="Packages title" value={slice.homePage.packagesTitle} onChange={(v) => setSlice({ ...slice, homePage: { ...slice.homePage, packagesTitle: v } })} />
          <Field label="Gallery title" value={slice.homePage.galleryTitle} onChange={(v) => setSlice({ ...slice, homePage: { ...slice.homePage, galleryTitle: v } })} />
          <p className="mt-6 font-semibold">Closing CTA</p>
          <Field label="Title" value={slice.homePage.cta.title} onChange={(v) => setSlice({ ...slice, homePage: { ...slice.homePage, cta: { ...slice.homePage.cta, title: v } } })} />
          <Area label="Text" value={slice.homePage.cta.text} onChange={(v) => setSlice({ ...slice, homePage: { ...slice.homePage, cta: { ...slice.homePage.cta, text: v } } })} />
          <MediaField
            label="CTA background image"
            src={slice.homePage.cta.backgroundImage}
            onUpload={(file) => upload(file, (path) => publish({ ...slice, homePage: { ...slice.homePage, cta: { ...slice.homePage.cta, backgroundImage: path } } }))}
            onRemove={() => publish({ ...slice, homePage: { ...slice.homePage, cta: { ...slice.homePage.cta, backgroundImage: "" } } })}
          />
          <p className="mt-6 font-semibold">Benefits strip</p>
          {slice.homePage.benefits.map((item, index) => (
            <div key={index} className="mt-2 rounded-xl border p-3">
              <Field label="Title" value={item.title} onChange={(v) => {
                const benefits = slice.homePage.benefits.map((b, i) => (i === index ? { ...b, title: v } : b));
                setSlice({ ...slice, homePage: { ...slice.homePage, benefits } });
              }} />
              <Area label="Text" value={item.text} onChange={(v) => {
                const benefits = slice.homePage.benefits.map((b, i) => (i === index ? { ...b, text: v } : b));
                setSlice({ ...slice, homePage: { ...slice.homePage, benefits } });
              }} rows={2} />
            </div>
          ))}
          <button type="button" className="mt-6 rounded-full bg-[#F47B20] px-5 py-2.5 text-sm font-semibold text-white" onClick={() => publish(slice)}>
            Save home sections to live site
          </button>
        </div>
      )}
    </div>
  );
}
