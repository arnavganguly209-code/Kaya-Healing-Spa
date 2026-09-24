import { Logo } from "@/components/logo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page is not part of the KAYA SPA website.",
};

export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] flex-col items-center justify-center bg-[#141210] px-6 text-center text-white">
      <Logo size={88} />
      <p className="mt-8 text-xs tracking-[0.24em] uppercase text-[#e8771a]">404</p>
      <h1 className="display mt-4 max-w-xl text-5xl md:text-6xl">Your moment of calm took a wrong turn.</h1>
      <p className="mt-4 max-w-md text-white/70">The page you requested is not here. The spa, thankfully, still is.</p>
      <Link href="/" className="btn-primary mt-8">Return Home</Link>
    </section>
  );
}
