import { PageHero } from "@/components/page-hero";
import { site } from "@/lib/content";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Journal",
  description: `Notes from ${site.name} on rest, recovery, and visiting the spa in Kathmandu.`,
  alternates: { canonical: "/blog" },
};

const posts = [
  {
    title: "How to arrive for a treatment",
    text: "Come a little early, leave the day at the door, and tell us the pressure you want. The hour works better when it is not rushed.",
  },
  {
    title: "After a trek",
    text: "Legs and lower back usually want the longer recovery session. Heat can come first. Stretching stays optional.",
  },
  {
    title: "What a package is for",
    text: "A package is a sequence with rest between treatments. It is for a morning or a day, not a stack of appointments with no pause.",
  },
];

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Journal"
        title="Notes from the spa"
        text="Short pieces on how a visit works. New writing will be added here."
        image="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2000&q=80"
        crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />
      <section className="mx-auto grid max-w-[1100px] gap-8 px-5 py-16 md:px-8">
        {posts.map((post) => (
          <article key={post.title} className="border-t border-[#e6dfd4] pt-6">
            <h2 className="font-serif text-3xl">{post.title}</h2>
            <p className="prose-quiet mt-3 max-w-2xl">{post.text}</p>
          </article>
        ))}
        <Link href="/contact" className="btn-primary w-fit">Book an Appointment</Link>
      </section>
    </>
  );
}
