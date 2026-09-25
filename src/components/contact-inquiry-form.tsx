"use client";

import { useState } from "react";

export function ContactInquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setError("");
    const response = await fetch("/api/contact-inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, message }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus("error");
      setError(body.message || "Could not send.");
      return;
    }
    setStatus("success");
    setMessage("");
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3">
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="w-full rounded-xl border border-[#e6dfd4] px-4 py-3 text-sm"
      />
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full rounded-xl border border-[#e6dfd4] px-4 py-3 text-sm"
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone (optional)"
        className="w-full rounded-xl border border-[#e6dfd4] px-4 py-3 text-sm"
      />
      <textarea
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        placeholder="Your question or request"
        className="w-full rounded-xl border border-[#e6dfd4] px-4 py-3 text-sm"
      />
      <button type="submit" disabled={status === "loading"} className="btn-primary w-full disabled:opacity-60">
        {status === "loading" ? "Sending…" : "Send message"}
      </button>
      {status === "success" && <p className="text-sm text-[#2f7a3d]">Thanks — we will reply soon.</p>}
      {error && <p className="text-sm text-[#c45e0a]">{error}</p>}
    </form>
  );
}
