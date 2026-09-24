"use client";

import { Logo } from "@/components/logo";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OrbitLoginPage() {
  const router = useRouter();
  const [passkey, setPasskey] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const response = await fetch("/api/orbit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passkey }),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      setMessage(body.message || "Could not open Orbit.");
      return;
    }
    router.push("/orbit");
    router.refresh();
  }

  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-[#141210] px-5">
      <form onSubmit={onSubmit} className="w-full max-w-md border border-white/10 bg-[#1c1a17] px-8 py-10 text-white">
        <Logo size={84} />
        <p className="mt-6 text-xs tracking-[0.28em] uppercase text-[#e8771a]">KAYA SPA</p>
        <h1 className="mt-3 font-serif text-4xl">Orbit</h1>
        <p className="mt-3 text-sm text-white/60">The studio opens only with the passkey set for this site.</p>
        <label className="mt-8 block text-xs tracking-[0.16em] uppercase text-white/50">
          Passkey
          <input
            type="password"
            value={passkey}
            onChange={(event) => setPasskey(event.target.value)}
            autoComplete="current-password"
            required
            className="mt-2 w-full border border-white/15 bg-transparent px-3 py-3 text-base tracking-[0.2em] text-white"
          />
        </label>
        <button type="submit" disabled={pending} className="btn-primary mt-6 w-full">
          {pending ? "Checking…" : "Enter Orbit"}
        </button>
        {message && <p className="mt-4 text-sm text-[#e8771a]">{message}</p>}
      </form>
    </main>
  );
}
