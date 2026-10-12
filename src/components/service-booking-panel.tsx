"use client";

import { formApiUrl } from "@/lib/form-api";
import { parseServiceDurationOptions, priceLabel } from "@/lib/service-pricing";
import type { OrbitTherapist } from "@/lib/orbit-types";
import type { Service } from "@/lib/types";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const CONFIRMATION_PATH = "/booking/confirmed";

export function ServiceBookingPanel({ service, therapists }: { service: Service; therapists: OrbitTherapist[] }) {
  const durationOptions = useMemo(() => parseServiceDurationOptions(service), [service]);
  const [durationMinutes, setDurationMinutes] = useState(durationOptions[0]?.minutes ?? 60);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [slotLabels, setSlotLabels] = useState<string[]>([]);
  const [therapistSlug, setTherapistSlug] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Nepal");
  const [notes, setNotes] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const selectedPrice = durationOptions.find((o) => o.minutes === durationMinutes)?.priceNpr ?? null;

  useEffect(() => {
    if (!date) {
      setSlots([]);
      setSlotLabels([]);
      return;
    }
    const params = new URLSearchParams({
      date,
      durationMinutes: String(durationMinutes),
    });
    if (therapistSlug) params.set("therapistSlug", therapistSlug);
    void fetch(`/api/bookings/availability?${params}`)
      .then((r) => r.json())
      .then((body) => {
        if (body.data?.slots) {
          setSlots(body.data.slots);
          setSlotLabels(body.data.labels ?? body.data.slots);
          if (time && !body.data.slots.includes(time)) setTime("");
        }
      });
  }, [date, durationMinutes, therapistSlug, time]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const res = await fetch(formApiUrl("appointments"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingType: "service",
        serviceSlug: service.slug,
        durationMinutes,
        priceNpr: selectedPrice,
        name,
        email,
        phone,
        country,
        preferredDate: date,
        preferredTime: time,
        therapistSlug: therapistSlug || undefined,
        notes,
        privacyAccepted: privacy,
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus("error");
      setMessage(body.message || "Could not submit request.");
      return;
    }
    if (body.data?.reference) {
      window.location.assign(`${CONFIRMATION_PATH}?ref=${encodeURIComponent(body.data.reference)}`);
      return;
    }
    setStatus("error");
    setMessage("Request saved but no reference returned. Please contact reception.");
  }

  return (
    <aside id="book" className="h-fit scroll-mt-28 rounded-2xl border border-[#e6dfd4] bg-[#fffdfb] p-6 shadow-[0_16px_48px_rgba(20,18,16,0.08)] lg:sticky lg:top-28">
      <p className="text-xs font-semibold tracking-[0.18em] text-[#F47B20] uppercase">Book this treatment</p>
      <h2 className="mt-2 font-serif text-2xl text-[#141210]">{service.name}</h2>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium">
          Duration
          <select
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-[#e6dfd4] px-3 py-3"
          >
            {durationOptions.map((o) => (
              <option key={o.minutes} value={o.minutes}>
                {o.label} — {priceLabel(o)}
              </option>
            ))}
          </select>
        </label>

        {therapists.length > 0 && (
          <label className="block text-sm font-medium">
            Therapist
            <select value={therapistSlug} onChange={(e) => setTherapistSlug(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-3">
              <option value="">Any available therapist</option>
              {therapists.map((t) => (
                <option key={t.slug} value={t.slug}>{t.name}</option>
              ))}
            </select>
          </label>
        )}

        <label className="block text-sm font-medium">
          Date
          <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-3" />
        </label>

        <label className="block text-sm font-medium">
          Time
          <select required value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-3" disabled={!slots.length}>
            <option value="">{slots.length ? "Select a time" : "Choose a date first"}</option>
            {slots.map((slot, i) => (
              <option key={slot} value={slot}>{slotLabels[i] || slot}</option>
            ))}
          </select>
        </label>

        <Field label="Full name" value={name} onChange={setName} required />
        <Field label="Country" value={country} onChange={setCountry} required />
        <Field label="WhatsApp / phone" value={phone} onChange={setPhone} required />
        <Field label="Email" value={email} onChange={setEmail} required type="email" />
        <label className="block text-sm font-medium">
          Message (optional)
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border px-3 py-3" />
        </label>
        <label className="flex gap-2 text-xs text-[#6B6B6B]">
          <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} required />
          I agree to the <Link href="/privacy" className="underline">privacy policy</Link> and <Link href="/terms" className="underline">booking terms</Link>.
        </label>

        <p className="text-sm font-semibold text-[#141210]">
          {selectedPrice && selectedPrice > 0 ? `Selected price: NPR ${selectedPrice.toLocaleString()}` : "Price to be confirmed by reception"}
        </p>

        <button type="submit" className="btn-primary w-full" disabled={status === "loading"}>
          {status === "loading" ? "Sending request…" : "Request appointment"}
        </button>
        {message && <p className="text-sm text-red-700">{message}</p>}
      </form>
      <p className="mt-4 text-xs text-[#8a8175]">Request only — reception will confirm your appointment.</p>
    </aside>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-3" />
    </label>
  );
}
