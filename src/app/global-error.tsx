"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fffcf8] font-sans text-[#141210] antialiased">
        <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
          <p className="text-[11px] font-semibold tracking-[0.24em] text-[#F47B20] uppercase">Kaya Healing Spa</p>
          <h1 className="mt-4 font-serif text-3xl">This page could not load</h1>
          <p className="mt-3 text-sm leading-7 text-[#6B6B6B]">A server error occurred. Reload to try again.</p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-8 rounded-full bg-[#F47B20] px-6 py-3 text-sm font-semibold text-white"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
