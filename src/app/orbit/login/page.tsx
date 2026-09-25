"use client";

import { Logo } from "@/components/logo";
import { site } from "@/lib/content";
import { useState } from "react";

export default function OrbitLoginPage() {
  const [passkey, setPasskey] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const response = await fetch("/api/orbit", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passkey: passkey.trim() }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setPending(false);
      setMessage(body.message || "Could not open Orbit.");
      return;
    }
    window.location.assign("/orbit");
  }

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#fffdf9] text-[#171717]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,123,32,0.12),transparent_42%),linear-gradient(180deg,#fffdf9_0%,#f7f2ea_100%)]" />
      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl items-center justify-center px-5 py-12 lg:justify-between lg:px-10">
        <div className="hidden max-w-md lg:block">
          <p className="text-[11px] font-medium tracking-[0.28em] text-[#F47B20] uppercase">{site.name.toUpperCase()}</p>
          <h1 className="mt-4 font-serif text-6xl leading-[0.95] text-[#171717]">The studio for the living site.</h1>
          <p className="mt-5 text-[15px] leading-7 text-[#6B6B6B]">
            Change hero copy, photographs, slides, and the rest of the house from one quiet dashboard.
          </p>
        </div>
        <form onSubmit={onSubmit} className="w-full max-w-[440px] rounded-[28px] border border-[#efe8e0] bg-white px-8 py-10 shadow-[0_24px_70px_rgba(23,23,23,0.08)]">
          <Logo size={84} />
          <p className="mt-6 text-[11px] font-medium tracking-[0.28em] text-[#F47B20] uppercase">Orbit</p>
          <h2 className="mt-2 font-serif text-4xl text-[#171717]">Welcome back</h2>
          <p className="mt-3 text-sm leading-6 text-[#6B6B6B]">Enter the site passkey to edit {site.name}.</p>
          <label className="mt-8 block text-[11px] font-medium tracking-[0.18em] text-[#8a8a8a] uppercase">
            Passkey
            <input
              type="password"
              value={passkey}
              onChange={(event) => setPasskey(event.target.value)}
              autoComplete="current-password"
              required
              className="mt-2 w-full rounded-2xl border border-[#efe8e0] bg-[#fffdfb] px-4 py-3.5 text-base tracking-[0.18em] text-[#171717] outline-none focus:border-[#F47B20]"
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="mt-6 w-full rounded-full bg-[#F47B20] py-3.5 text-sm font-medium text-white transition hover:bg-[#e06d12] disabled:opacity-60"
          >
            {pending ? "Opening…" : "Enter Orbit"}
          </button>
          {message && <p className="mt-4 text-sm text-[#c45e0a]">{message}</p>}
        </form>
      </div>
    </main>
  );
}
