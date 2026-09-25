"use client";

import type { BlogPost } from "@/lib/blog-store";
import type { AdminInquiry } from "@/lib/admin-store";
import type { OrbitContent } from "@/lib/orbit-store";
import { defaultServices } from "@/lib/default-services";
import { site } from "@/lib/content";
import { SocialIcon, socialPlatformLabels } from "@/components/social-icons";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type AdminData = {
  hero: OrbitContent["hero"];
  footerBrand: string;
  footerText: string;
  phone: string;
  whatsapp: string;
  email: string;
  socialLinks: OrbitContent["socialLinks"];
  extraSocialLinks: OrbitContent["extraSocialLinks"];
  services: OrbitContent["services"];
  packages: OrbitContent["packages"];
  therapists: OrbitContent["therapists"];
  categories: string[];
  packageCategories: string[];
};

const sections = ["Dashboard", "Hero", "Footer", "Services", "Packages", "Therapists", "Blog", "Inquiries", "Account"] as const;

export function AdminPanel({ initial }: { initial: AdminData }) {
  const [content, setContent] = useState(initial);
  const [section, setSection] = useState<(typeof sections)[number]>("Dashboard");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postIndex, setPostIndex] = useState(0);
  const [account, setAccount] = useState({ username: "kaya", currentPassword: "", password: "", password2: "" });
  const contentRef = useRef(content);
  contentRef.current = content;

  useEffect(() => {
    if (section === "Inquiries") void loadInquiries();
    if (section === "Blog") void loadPosts();
    if (section === "Account") {
      void fetch("/api/admin/credentials", { credentials: "same-origin" })
        .then((r) => r.json().then((body) => ({ ok: r.ok, body })))
        .then(({ ok, body }) => {
          if (ok && body.data?.username) setAccount((prev) => ({ ...prev, username: body.data.username }));
        });
    }
  }, [section]);

  async function loadInquiries() {
    const res = await fetch("/api/admin/inquiries", { credentials: "same-origin" });
    const body = await res.json().catch(() => ({}));
    if (res.ok) setInquiries(body.data || []);
  }

  async function loadPosts() {
    const res = await fetch("/api/admin/blog", { credentials: "same-origin" });
    const body = await res.json().catch(() => ({}));
    if (res.ok) setPosts(body.data || []);
  }

  async function persist(next = contentRef.current) {
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const body = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(body.message || "Could not save.");
      return false;
    }
    setMessage("Live site updated.");
    return true;
  }

  function publish(next: AdminData) {
    setContent(next);
    contentRef.current = next;
    void persist(next);
  }

  async function upload(file: File, apply: (path: string) => void) {
    const form = new FormData();
    form.set("file", file);
    const res = await fetch("/api/admin/media", { method: "POST", credentials: "same-origin", body: form });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.path) {
      setError(body.message || "Upload failed.");
      return;
    }
    apply(body.path);
  }

  async function savePosts(next: BlogPost[]) {
    setSaving(true);
    const res = await fetch("/api/admin/blog", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ posts: next }),
    });
    setSaving(false);
    if (res.ok) {
      setPosts(next);
      setMessage("Blog saved.");
    } else setError("Blog save failed.");
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE", credentials: "same-origin" });
    window.location.assign("/admin/login");
  }

  const unread = inquiries.filter((i) => !i.read).length;
  const hero = content.hero;

  return (
    <div className="min-h-[100svh] bg-[#fffdf9] text-[#171717]">
      <header className="sticky top-0 z-40 border-b border-[#efe8e0] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#F47B20] uppercase">Kaya Admin</p>
            <p className="font-serif text-xl">Content dashboard</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="text-sm text-[#6B6B6B] hover:text-[#F47B20]">
              View site
            </Link>
            <button type="button" onClick={() => void persist()} disabled={saving} className="rounded-full bg-[#F47B20] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
              {saving ? "Saving…" : "Publish"}
            </button>
            <button type="button" onClick={logout} className="rounded-full border border-[#efe8e0] px-4 py-2 text-sm">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-8 md:grid-cols-[220px_1fr] md:px-8">
        <nav className="flex flex-row flex-wrap gap-2 md:flex-col md:gap-1">
          {sections.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSection(item)}
              className={`rounded-full px-4 py-2 text-left text-sm font-semibold md:rounded-xl ${
                section === item ? "bg-[#F47B20] text-white" : "bg-white text-[#171717] hover:bg-[#f6f1e8]"
              }`}
            >
              {item}
              {item === "Inquiries" && unread > 0 ? ` (${unread})` : ""}
            </button>
          ))}
        </nav>

        <section className="min-w-0 rounded-[24px] border border-[#efe8e0] bg-white p-6 md:p-8">
          {message && <p className="mb-4 text-sm text-[#2f7a3d]">{message}</p>}
          {error && <p className="mb-4 text-sm text-[#c45e0a]">{error}</p>}

          {section === "Dashboard" && (
            <>
              <h2 className="font-serif text-3xl">Welcome, {site.name}</h2>
              <p className="mt-2 text-sm text-[#6B6B6B]">Manage hero, footer, services, packages, therapists, blog, and booking requests. Full Orbit access is separate at /orbit.</p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                <li className="rounded-2xl bg-[#fff7f0] p-5">
                  <p className="text-3xl font-bold text-[#F47B20]">{content.services.length}</p>
                  <p className="text-sm">Services</p>
                </li>
                <li className="rounded-2xl bg-[#fff7f0] p-5">
                  <p className="text-3xl font-bold text-[#F47B20]">{content.packages.length}</p>
                  <p className="text-sm">Packages</p>
                </li>
                <li className="rounded-2xl bg-[#fff7f0] p-5">
                  <p className="text-3xl font-bold text-[#F47B20]">{posts.length || "—"}</p>
                  <p className="text-sm">Blog posts (open Blog tab to load)</p>
                </li>
                <li className="rounded-2xl bg-[#fff7f0] p-5">
                  <p className="text-3xl font-bold text-[#F47B20]">{unread || "0"}</p>
                  <p className="text-sm">Unread inquiries</p>
                </li>
              </ul>
            </>
          )}

          {section === "Hero" && (
            <>
              <p className="text-sm text-[#6B6B6B]">Home hero image, titles, and the four feature boxes.</p>
              {hero.slides.map((slide, index) => (
                <div key={index} className="mt-6 rounded-2xl border border-[#efe8e0] p-4">
                  <Field label="Slide image path" value={slide.src} onChange={(v) => {
                    const slides = [...hero.slides];
                    slides[index] = { ...slides[index], src: v };
                    publish({ ...content, hero: { ...hero, slides, image: slides[0]?.src || hero.image } });
                  }} />
                  <MediaField label="Upload slide" src={slide.src} onUpload={(f) => upload(f, (path) => {
                    const slides = [...hero.slides];
                    slides[index] = { ...slides[index], src: path };
                    publish({ ...content, hero: { ...hero, slides, image: slides[0]?.src || hero.image } });
                  })} />
                </div>
              ))}
              <Field label="Title (orange)" value={hero.titleOrange} onChange={(v) => setContent({ ...content, hero: { ...hero, titleOrange: v } })} />
              <Field label="Title (dark)" value={hero.titleDark} onChange={(v) => setContent({ ...content, hero: { ...hero, titleDark: v } })} />
              <Area label="Subtitle" value={hero.subtitle} onChange={(v) => setContent({ ...content, hero: { ...hero, subtitle: v } })} />
              <p className="mt-6 font-semibold">Feature boxes</p>
              {hero.features.map((f, i) => (
                <div key={i} className="mt-3 rounded-xl border border-[#efe8e0] p-4">
                  <Field label="Title" value={f.title} onChange={(v) => {
                    const features = hero.features.map((x, j) => (j === i ? { ...x, title: v } : x));
                    setContent({ ...content, hero: { ...hero, features } });
                  }} />
                  <Field label="Text" value={f.text} onChange={(v) => {
                    const features = hero.features.map((x, j) => (j === i ? { ...x, text: v } : x));
                    setContent({ ...content, hero: { ...hero, features } });
                  }} />
                </div>
              ))}
            </>
          )}

          {section === "Footer" && (
            <>
              <Field label="Brand name" value={content.footerBrand} onChange={(v) => setContent({ ...content, footerBrand: v })} />
              <Area label="Footer description" value={content.footerText} onChange={(v) => setContent({ ...content, footerText: v })} />
              <Field label="Phone" value={content.phone} onChange={(v) => setContent({ ...content, phone: v })} />
              <Field label="WhatsApp" value={content.whatsapp} onChange={(v) => setContent({ ...content, whatsapp: v })} />
              <Field label="Email" value={content.email} onChange={(v) => setContent({ ...content, email: v })} />
              <p className="mt-6 font-semibold">Social & review icons</p>
              <p className="text-sm text-[#6B6B6B]">Upload a custom icon per platform or add extra footer links.</p>
              {content.socialLinks.map((link, index) => (
                <div key={link.id} className="mt-3 rounded-xl border border-[#efe8e0] p-4">
                  <div className="flex items-center gap-3">
                    <SocialIcon id={link.id} iconSrc={link.iconSrc} />
                    <p className="text-sm font-semibold">{socialPlatformLabels[link.id]}</p>
                  </div>
                  <Field label="URL" value={link.url} onChange={(v) => {
                    const socialLinks = content.socialLinks.map((item, i) => (i === index ? { ...item, url: v } : item));
                    setContent({ ...content, socialLinks });
                  }} />
                  <MediaField label="Custom icon" src={link.iconSrc || ""} onUpload={(f) => upload(f, (path) => {
                    const socialLinks = content.socialLinks.map((item, i) => (i === index ? { ...item, iconSrc: path } : item));
                    publish({ ...content, socialLinks });
                  })} />
                  <label className="mt-2 flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={link.enabled} onChange={(e) => {
                      const socialLinks = content.socialLinks.map((item, i) => (i === index ? { ...item, enabled: e.target.checked } : item));
                      setContent({ ...content, socialLinks });
                    }} />
                    Show in footer
                  </label>
                </div>
              ))}
              <button type="button" className="mt-4 rounded-full border px-4 py-2 text-sm" onClick={() => setContent({
                ...content,
                extraSocialLinks: [...(content.extraSocialLinks || []), { id: `extra-${Date.now()}`, label: "New link", url: "", iconSrc: "", enabled: true }],
              })}>
                Add footer icon
              </button>
              {(content.extraSocialLinks || []).map((link, index) => (
                <div key={link.id} className="mt-3 rounded-xl border p-4">
                  <Field label="Label" value={link.label} onChange={(v) => {
                    const extraSocialLinks = content.extraSocialLinks.map((item, i) => (i === index ? { ...item, label: v } : item));
                    setContent({ ...content, extraSocialLinks });
                  }} />
                  <Field label="URL" value={link.url} onChange={(v) => {
                    const extraSocialLinks = content.extraSocialLinks.map((item, i) => (i === index ? { ...item, url: v } : item));
                    setContent({ ...content, extraSocialLinks });
                  }} />
                  <MediaField label="Icon" src={link.iconSrc} onUpload={(f) => upload(f, (path) => {
                    const extraSocialLinks = content.extraSocialLinks.map((item, i) => (i === index ? { ...item, iconSrc: path } : item));
                    publish({ ...content, extraSocialLinks });
                  })} />
                  <button type="button" className="mt-2 text-xs text-[#c45e0a] underline" onClick={() => setContent({
                    ...content,
                    extraSocialLinks: content.extraSocialLinks.filter((_, i) => i !== index),
                  })}>
                    Remove
                  </button>
                </div>
              ))}
            </>
          )}

          {section === "Services" && (
            <>
              <button type="button" className="rounded-full border px-4 py-2 text-sm" onClick={() => publish({
                ...content,
                services: [...content.services, { ...defaultServices[0], slug: `treatment-${Date.now()}`, name: "New treatment" }],
              })}>
                Add service
              </button>
              {content.services.map((s, index) => (
                <div key={`${s.slug}-${index}`} className="mt-4 space-y-2 rounded-2xl border p-4">
                  <Field label="Slug" value={s.slug} onChange={(v) => {
                    const services = content.services.map((x, i) => (i === index ? { ...x, slug: v } : x));
                    setContent({ ...content, services });
                  }} />
                  <Field label="Name" value={s.name} onChange={(v) => {
                    const services = content.services.map((x, i) => (i === index ? { ...x, name: v } : x));
                    setContent({ ...content, services });
                  }} />
                  <Area label="Summary" value={s.summary} onChange={(v) => {
                    const services = content.services.map((x, i) => (i === index ? { ...x, summary: v } : x));
                    setContent({ ...content, services });
                  }} />
                  <Area label="Overview" value={s.overview} onChange={(v) => {
                    const services = content.services.map((x, i) => (i === index ? { ...x, overview: v } : x));
                    setContent({ ...content, services });
                  }} />
                  <Field label="Price from NPR" value={String(s.priceFromNpr)} onChange={(v) => {
                    const services = content.services.map((x, i) => (i === index ? { ...x, priceFromNpr: Number(v) || 0 } : x));
                    setContent({ ...content, services });
                  }} />
                  <MediaField label="Image" src={s.image} onUpload={(f) => upload(f, (path) => {
                    const services = content.services.map((x, i) => (i === index ? { ...x, image: path } : x));
                    publish({ ...content, services });
                  })} />
                </div>
              ))}
            </>
          )}

          {section === "Packages" && (
            <>
              <button type="button" className="rounded-full border px-4 py-2 text-sm" onClick={() => publish({
                ...content,
                packages: [...content.packages, { ...content.packages[0], slug: `package-${Date.now()}`, name: "New package" }],
              })}>
                Add package
              </button>
              {content.packages.map((p, index) => (
                <div key={`${p.slug}-${index}`} className="mt-4 space-y-2 rounded-2xl border p-4">
                  <Field label="Slug" value={p.slug} onChange={(v) => {
                    const packages = content.packages.map((x, i) => (i === index ? { ...x, slug: v } : x));
                    setContent({ ...content, packages });
                  }} />
                  <Field label="Name" value={p.name} onChange={(v) => {
                    const packages = content.packages.map((x, i) => (i === index ? { ...x, name: v } : x));
                    setContent({ ...content, packages });
                  }} />
                  <Area label="Summary" value={p.summary} onChange={(v) => {
                    const packages = content.packages.map((x, i) => (i === index ? { ...x, summary: v } : x));
                    setContent({ ...content, packages });
                  }} />
                  <Field label="Price NPR" value={String(p.priceNpr)} onChange={(v) => {
                    const packages = content.packages.map((x, i) => (i === index ? { ...x, priceNpr: Number(v) || 0 } : x));
                    setContent({ ...content, packages });
                  }} />
                  <MediaField label="Image" src={p.image} onUpload={(f) => upload(f, (path) => {
                    const packages = content.packages.map((x, i) => (i === index ? { ...x, image: path } : x));
                    publish({ ...content, packages });
                  })} />
                </div>
              ))}
            </>
          )}

          {section === "Therapists" && (
            <>
              <button type="button" className="rounded-full border px-4 py-2 text-sm" onClick={() => publish({
                ...content,
                therapists: [...content.therapists, { ...content.therapists[0], slug: `therapist-${Date.now()}`, name: "New therapist" }],
              })}>
                Add therapist
              </button>
              {content.therapists.map((t, index) => (
                <div key={`${t.slug}-${index}`} className="mt-4 space-y-2 rounded-2xl border p-4">
                  <Field label="Name" value={t.name} onChange={(v) => {
                    const therapists = content.therapists.map((x, i) => (i === index ? { ...x, name: v } : x));
                    setContent({ ...content, therapists });
                  }} />
                  <Field label="Title" value={t.title} onChange={(v) => {
                    const therapists = content.therapists.map((x, i) => (i === index ? { ...x, title: v } : x));
                    setContent({ ...content, therapists });
                  }} />
                  <Area label="Bio" value={t.description} onChange={(v) => {
                    const therapists = content.therapists.map((x, i) => (i === index ? { ...x, description: v } : x));
                    setContent({ ...content, therapists });
                  }} />
                  <MediaField label="Photo" src={t.photo} onUpload={(f) => upload(f, (path) => {
                    const therapists = content.therapists.map((x, i) => (i === index ? { ...x, photo: path } : x));
                    publish({ ...content, therapists });
                  })} />
                </div>
              ))}
            </>
          )}

          {section === "Blog" && !posts.length && <p className="text-sm text-[#6B6B6B]">Loading posts…</p>}
          {section === "Blog" && posts.length > 0 && posts[postIndex] && (
            <>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="rounded-full bg-[#F47B20] px-4 py-2 text-sm text-white" onClick={() => {
                  const now = new Date().toISOString();
                  const next = [{ slug: `post-${Date.now()}`, title: "New post", excerpt: "", content: "", seoTitle: "", seoDescription: "", focusKeyword: "", publishedAt: now, updatedAt: now, status: "draft" as const, featuredImage: "", featuredImageAlt: "" }, ...posts];
                  setPosts(next);
                  setPostIndex(0);
                }}>
                  New post
                </button>
                {posts.map((p, i) => (
                  <button key={p.slug} type="button" className={`rounded-full px-3 py-1 text-xs ${i === postIndex ? "bg-[#171717] text-white" : "border"}`} onClick={() => setPostIndex(i)}>
                    {p.title.slice(0, 24)}
                  </button>
                ))}
              </div>
              {(() => {
                const post = posts[postIndex];
                const patch = (part: Partial<BlogPost>) => {
                  const next = posts.map((p, i) => (i === postIndex ? { ...p, ...part, updatedAt: new Date().toISOString() } : p));
                  setPosts(next);
                };
                return (
                  <div className="mt-6 space-y-2">
                    <Field label="Title" value={post.title} onChange={(v) => patch({ title: v })} />
                    <Field label="URL slug" value={post.slug} onChange={(v) => patch({ slug: v })} />
                    <Area label="Excerpt" value={post.excerpt} onChange={(v) => patch({ excerpt: v })} />
                    <Area label="Content (paragraphs separated by blank lines)" value={post.content} onChange={(v) => patch({ content: v })} rows={12} />
                    <Field label="SEO title" value={post.seoTitle} onChange={(v) => patch({ seoTitle: v })} />
                    <Area label="SEO meta description" value={post.seoDescription} onChange={(v) => patch({ seoDescription: v })} />
                    <Field label="Focus keyword" value={post.focusKeyword} onChange={(v) => patch({ focusKeyword: v })} />
                    <label className="block text-sm">
                      Status
                      <select value={post.status} onChange={(e) => patch({ status: e.target.value as BlogPost["status"] })} className="mt-1 w-full rounded-xl border px-3 py-2">
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </label>
                    <MediaField label="Featured image" src={post.featuredImage} onUpload={(f) => upload(f, (path) => patch({ featuredImage: path }))} />
                    <button type="button" className="mt-4 rounded-full bg-[#171717] px-5 py-2 text-sm text-white" onClick={() => void savePosts(posts)}>
                      Save blog
                    </button>
                  </div>
                );
              })()}
            </>
          )}

          {section === "Inquiries" && (
            <>
              <button type="button" className="rounded-full border px-4 py-2 text-sm" onClick={async () => {
                await fetch("/api/admin/inquiries", { method: "PATCH", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ markAllRead: true }) });
                loadInquiries();
              }}>
                Mark all read
              </button>
              <ul className="mt-6 space-y-4">
                {inquiries.map((inq) => (
                  <li key={inq.id} className={`rounded-2xl border p-4 ${inq.read ? "opacity-70" : "border-[#F47B20]/40 bg-[#fff7f0]"}`}>
                    <p className="text-[11px] font-semibold tracking-wide text-[#F47B20] uppercase">{inq.type}</p>
                    <p className="font-semibold">{inq.summary}</p>
                    <p className="text-sm text-[#6B6B6B]">{inq.name} · {inq.phone} · {inq.email}</p>
                    <p className="mt-1 text-xs text-[#8a8175]">{new Date(inq.createdAt).toLocaleString()}</p>
                    <pre className="mt-2 max-h-32 overflow-auto rounded bg-[#f6f1e8] p-2 text-xs">{JSON.stringify(inq.payload, null, 2)}</pre>
                  </li>
                ))}
                {!inquiries.length && <p className="text-sm text-[#6B6B6B]">No inquiries yet.</p>}
              </ul>
            </>
          )}

          {section === "Account" && (
            <>
              <p className="text-sm text-[#6B6B6B]">Change your Admin login. Orbit owners can also change this under Orbit → Admin portal.</p>
              <Field label="User ID" value={account.username} onChange={(v) => setAccount({ ...account, username: v })} />
              <Field label="Current password" value={account.currentPassword} onChange={(v) => setAccount({ ...account, currentPassword: v })} />
              <Field label="New password" value={account.password} onChange={(v) => setAccount({ ...account, password: v })} />
              <Field label="Confirm new password" value={account.password2} onChange={(v) => setAccount({ ...account, password2: v })} />
              <button type="button" className="mt-4 rounded-full bg-[#F47B20] px-5 py-2 text-sm text-white" onClick={async () => {
                if (account.password && account.password !== account.password2) {
                  setError("Passwords do not match.");
                  return;
                }
                const res = await fetch("/api/admin/credentials", {
                  method: "PUT",
                  credentials: "same-origin",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ username: account.username, password: account.password || undefined, currentPassword: account.currentPassword }),
                });
                const body = await res.json().catch(() => ({}));
                if (res.ok) setMessage("Login updated.");
                else setError(body.message || "Could not update.");
              }}>
                Update login
              </button>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="mt-3 block text-sm">
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-[#efe8e0] px-3 py-3" />
    </label>
  );
}

function Area({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return (
    <label className="mt-3 block text-sm">
      {label}
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="mt-1 w-full rounded-xl border border-[#efe8e0] px-3 py-3" />
    </label>
  );
}

function MediaField({ label, src, onUpload }: { label: string; src: string; onUpload: (file: File) => void }) {
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
