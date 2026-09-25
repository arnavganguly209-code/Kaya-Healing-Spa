"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-[11px] font-semibold tracking-[0.24em] text-[#F47B20] uppercase">Kaya Healing Spa</p>
      <h1 className="mt-4 font-serif text-3xl text-[#141210]">This page could not load</h1>
      <p className="mt-3 text-sm leading-7 text-[#6B6B6B]">
        Something went wrong on our server. Please try again — your visit details are safe.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => reset()} className="rounded-full bg-[#F47B20] px-6 py-3 text-sm font-semibold text-white">
          Reload page
        </button>
        <Link href="/" className="rounded-full border border-[#e6dfd4] px-6 py-3 text-sm font-semibold text-[#141210]">
          Go home
        </Link>
        <Link href="/contact" className="rounded-full border border-[#e6dfd4] px-6 py-3 text-sm font-semibold text-[#141210]">
          Contact us
        </Link>
      </div>
    </div>
  );
}
