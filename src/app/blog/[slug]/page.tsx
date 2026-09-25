import { PageHero } from "@/components/page-hero";
import { getBlogPost, getPublishedPosts } from "@/lib/blog-store";
import { site } from "@/lib/content";
import { readOrbitContent } from "@/lib/orbit-store";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Journal" };
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: post.featuredImage ? [{ url: post.featuredImage, alt: post.featuredImageAlt || post.title }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();
  const orbit = readOrbitContent();
  const cover = orbit.pageCovers.blog;
  const paragraphs = post.content.split(/\n\n+/).filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow={cover.eyebrow}
        title={post.title}
        tagline={post.excerpt}
        text=""
        crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]}
      />
      <article className="mx-auto max-w-[760px] px-5 py-12 md:px-8">
        {post.featuredImage ? (
          <img
            src={post.featuredImage}
            alt={post.featuredImageAlt || post.title}
            className="mb-10 w-full rounded-2xl object-cover"
          />
        ) : null}
        <time dateTime={post.publishedAt} className="text-xs tracking-wide text-[#8a8175] uppercase">
          {new Date(post.publishedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
        </time>
        <div className="prose-quiet mt-6 space-y-4 text-[17px] leading-8">
          {paragraphs.map((para, index) => (
            <p key={index}>{para}</p>
          ))}
        </div>
        <Link href="/blog" className="btn-line mt-12 inline-flex">
          Back to journal
        </Link>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.seoDescription || post.excerpt,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            image: post.featuredImage ? `${site.url}${post.featuredImage}` : undefined,
            author: { "@type": "Organization", name: site.name },
            publisher: { "@type": "Organization", name: site.name },
            mainEntityOfPage: `${site.url}/blog/${post.slug}`,
          }),
        }}
      />
    </>
  );
}
