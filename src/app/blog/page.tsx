import { PageHero } from "@/components/page-hero";
import { getPublishedPosts } from "@/lib/blog-store";
import { site } from "@/lib/content";
import { readOrbitContent } from "@/lib/orbit-store";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Journal",
  description: `Notes from ${site.name} on rest, recovery, and visiting the spa in Kathmandu.`,
  alternates: { canonical: "/blog" },
};

export const dynamic = "force-dynamic";

export default function BlogPage() {
  const orbit = readOrbitContent();
  const cover = orbit.pageCovers.blog;
  const posts = getPublishedPosts();

  return (
    <>
      <PageHero
        eyebrow={cover.eyebrow}
        title={cover.title}
        tagline={cover.tagline}
        text={cover.text}
        crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />
      <section className="mx-auto grid max-w-[1100px] gap-8 px-5 py-16 md:px-8">
        {posts.map((post) => (
          <article key={post.slug} className="border-t border-[#e6dfd4] pt-6">
            <Link href={`/blog/${post.slug}`} className="group block">
              <h2 className="font-serif text-3xl group-hover:text-[#F47B20]">{post.title}</h2>
              <p className="prose-quiet mt-3 max-w-2xl">{post.excerpt}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-[#F47B20]">Read article →</span>
            </Link>
          </article>
        ))}
        {!posts.length && <p className="text-sm text-[#6B6B6B]">New posts will appear here soon.</p>}
        <Link href="/contact" className="btn-primary w-fit">
          Book an Appointment
        </Link>
      </section>
    </>
  );
}
