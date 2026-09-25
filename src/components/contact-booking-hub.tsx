"use client";

import { TherapistPortrait } from "@/components/therapist-portrait";
import { formatNpr, site } from "@/lib/content";
import type { OrbitTherapist } from "@/lib/orbit-types";
import type { Service, SpaPackage } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
const useExternalApi = apiBase.startsWith("https://") && !apiBase.includes("localhost") && !apiBase.includes("127.0.0.1");

function endpoint(path: "/appointments" | "/newsletter") {
  return useExternalApi ? `${apiBase}${path}` : `/api${path}`;
}

type Status = "idle" | "loading" | "success" | "error";
type BookingMode = "service" | "package" | "therapist";
type TherapistOffering = "service" | "package";

type Props = {
  services: Service[];
  packages: SpaPackage[];
  therapists: OrbitTherapist[];
  initial?: { service?: string; package?: string; therapist?: string; mode?: string };
};

export function ContactBookingHub({ services, packages, therapists, initial }: Props) {
  const defaultMode: BookingMode =
    initial?.mode === "therapist" || initial?.therapist
      ? "therapist"
      : initial?.mode === "package" || initial?.package
        ? "package"
        : "service";

  const [mode, setMode] = useState<BookingMode>(defaultMode);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Booking type">
        {(
          [
            ["service", "Book a treatment"],
            ["package", "Book a package"],
            ["therapist", "Book therapist"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={mode === key}
            onClick={() => setMode(key)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              mode === key ? "bg-[#F47B20] text-white" : "border border-[#e6dfd4] bg-white text-[#171717]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {mode === "service" && (
        <BookingPanel
          key="service"
          kind="service"
          services={services}
          packages={packages}
          therapists={therapists}
          initialService={initial?.service}
          initialTherapist={initial?.therapist}
        />
      )}
      {mode === "package" && (
        <BookingPanel
          key="package"
          kind="package"
          services={services}
          packages={packages}
          therapists={therapists}
          initialPackage={initial?.package}
          initialTherapist={initial?.therapist}
        />
      )}
      {mode === "therapist" && (
        <BookingPanel
          key="therapist"
          kind="therapist"
          services={services}
          packages={packages}
          therapists={therapists}
          initialService={initial?.service}
          initialPackage={initial?.package}
          initialTherapist={initial?.therapist}
        />
      )}
    </div>
  );
}

function BookingPanel({
  kind,
  services,
  packages,
  therapists,
  initialService,
  initialPackage,
  initialTherapist,
}: {
  kind: BookingMode;
  services: Service[];
  packages: SpaPackage[];
  therapists: OrbitTherapist[];
  initialService?: string;
  initialPackage?: string;
  initialTherapist?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [therapistSlug, setTherapistSlug] = useState(initialTherapist ?? "");
  const [offering, setOffering] = useState<TherapistOffering>(() =>
    initialPackage && !initialService ? "package" : "service",
  );

  useEffect(() => {
    if (initialTherapist) setTherapistSlug(initialTherapist);
  }, [initialTherapist]);

  const title =
    kind === "service"
      ? "Treatment appointment"
      : kind === "package"
        ? "Package appointment"
        : "Book with your therapist";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const serviceSlug = String(data.service || "");
    const packageSlug = String(data.packageSlug || "");
    const therapist = String(data.therapistSlug || therapistSlug || "");

    if (kind === "service" && !serviceSlug) {
      setStatus("error");
      setMessage("Choose a treatment.");
      return;
    }
    if (kind === "package" && !packageSlug) {
      setStatus("error");
      setMessage("Choose a package.");
      return;
    }
    if (kind === "therapist") {
      if (!therapist) {
        setStatus("error");
        setMessage("Choose a therapist.");
        return;
      }
      if (offering === "service" && !serviceSlug) {
        setStatus("error");
        setMessage("Choose a treatment for this booking.");
        return;
      }
      if (offering === "package" && !packageSlug) {
        setStatus("error");
        setMessage("Choose a package for this booking.");
        return;
      }
    }

    setStatus("loading");
    setMessage("");
    let outService: string | undefined;
    let outPackage: string | undefined;
    if (kind === "therapist") {
      outService = offering === "service" ? serviceSlug || undefined : undefined;
      outPackage = offering === "package" ? packageSlug || undefined : undefined;
    } else if (kind === "service") {
      outService = serviceSlug || undefined;
    } else {
      outPackage = packageSlug || undefined;
    }
    try {
      const response = await fetch(endpoint("/appointments"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingType: kind,
          name: data.name,
          email: data.email,
          phone: data.phone,
          preferredDate: data.preferredDate,
          preferredTime: data.preferredTime,
          serviceSlug: outService,
          packageSlug: outPackage,
          therapistSlug: therapist || undefined,
          guests: Number(data.guests || 1),
          notes: data.notes || undefined,
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        const detail = Array.isArray(body.message) ? body.message.join(" ") : body.message;
        throw new Error(detail || "The request could not be sent.");
      }
      setStatus("success");
      setMessage(`Your request is with the spa. This is not confirmed until ${site.name} replies by phone or email.`);
      form.reset();
      setTherapistSlug(initialTherapist ?? "");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  const selectedTherapist = useMemo(
    () => therapists.find((item) => item.slug === therapistSlug),
    [therapists, therapistSlug],
  );

  return (
    <form onSubmit={onSubmit} className="grid gap-5 rounded-2xl border border-[#e6dfd4] bg-white p-6 md:p-8" noValidate>
      <div>
        <h2 className="font-serif text-3xl">{title}</h2>
        <p className="prose-quiet mt-2 text-sm">
          {kind === "therapist"
            ? "Select your therapist, choose a treatment or package, then add your visit details."
            : `Share your details and preferred time. We confirm by phone at ${site.phone}.`}
        </p>
      </div>

      {kind === "therapist" && (
        <>
          <TherapistPicker therapists={therapists} value={therapistSlug} onChange={setTherapistSlug} required />
          <input type="hidden" name="therapistSlug" value={therapistSlug} />
          {selectedTherapist && (
            <div className="flex gap-4 rounded-xl bg-[#f6f1e8] p-4">
              <div className="w-24 shrink-0">
                <TherapistPortrait src={selectedTherapist.photo} alt={selectedTherapist.photoAlt} sizes="96px" />
              </div>
              <div className="min-w-0 text-sm">
                <p className="font-serif text-xl">{selectedTherapist.name}</p>
                <p className="text-[#6B6B6B]">{selectedTherapist.experience}</p>
                <p className="prose-quiet mt-2">{selectedTherapist.description}</p>
              </div>
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">What would you like to book?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(
                [
                  ["service", "A treatment"],
                  ["package", "A package"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setOffering(key)}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium ${
                    offering === key ? "bg-[#141210] text-white" : "border border-[#e6dfd4] bg-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {offering === "service" ? (
            <label className="text-sm font-medium">
              Treatment
              <select
                name="service"
                defaultValue={initialService ?? ""}
                required
                className="mt-1 w-full rounded-xl border border-[#e6dfd4] px-3 py-3"
              >
                <option value="">Select treatment</option>
                {services.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name} — from {formatNpr(item.priceFromNpr)}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label className="text-sm font-medium">
              Package
              <select
                name="packageSlug"
                defaultValue={initialPackage ?? ""}
                required
                className="mt-1 w-full rounded-xl border border-[#e6dfd4] px-3 py-3"
              >
                <option value="">Select package</option>
                {packages.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name} — {formatNpr(item.priceNpr)}
                  </option>
                ))}
              </select>
            </label>
          )}
        </>
      )}

      {kind === "service" && (
        <label className="text-sm font-medium">
          Treatment
          <select name="service" defaultValue={initialService ?? ""} required className="mt-1 w-full rounded-xl border border-[#e6dfd4] px-3 py-3">
            <option value="">Choose treatment</option>
            {services.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name} — from {formatNpr(item.priceFromNpr)}
              </option>
            ))}
          </select>
        </label>
      )}

      {kind === "package" && (
        <label className="text-sm font-medium">
          Package
          <select name="packageSlug" defaultValue={initialPackage ?? ""} required className="mt-1 w-full rounded-xl border border-[#e6dfd4] px-3 py-3">
            <option value="">Choose package</option>
            {packages.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name} — {formatNpr(item.priceNpr)}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="border-t border-[#efe8e0] pt-5">
        <p className="text-sm font-semibold text-[#171717]">Your details</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Full name" required />
        <Field name="phone" label="Phone" type="tel" required />
      </div>
      <Field name="email" label="Email" type="email" required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="preferredDate" label="Preferred date" type="date" required />
        <Field name="preferredTime" label="Preferred time" type="time" required />
      </div>
      <Field name="guests" label="Number of guests" type="number" defaultValue="1" required />

      {(kind === "service" || kind === "package") && therapists.length > 0 && (
        <>
          <p className="text-sm font-semibold text-[#171717]">Preferred therapist (optional)</p>
          <TherapistPicker therapists={therapists} value={therapistSlug} onChange={setTherapistSlug} />
          <input type="hidden" name="therapistSlug" value={therapistSlug} />
        </>
      )}

      <label className="text-sm">
        Notes for the spa
        <textarea
          name="notes"
          rows={4}
          className="mt-1 w-full rounded-xl border border-[#e6dfd4] px-3 py-3"
          placeholder="Pressure, allergies, couple room, etc."
        />
      </label>

      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Request appointment"}
      </button>
      {message && (
        <p role="status" className={`text-sm ${status === "error" ? "text-red-700" : "text-[#2f8f45]"}`}>
          {message}
        </p>
      )}
    </form>
  );
}

function TherapistPicker({
  therapists,
  value,
  onChange,
  required,
}: {
  therapists: OrbitTherapist[];
  value: string;
  onChange: (slug: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <p className="text-sm font-medium">
        {required ? "Choose therapist" : "Therapist preference"}
        {required ? " *" : ""}
      </p>
      <div className="mt-3 flex gap-4 overflow-x-auto pb-2 snap-x">
        {therapists.map((therapist) => {
          const active = value === therapist.slug;
          return (
            <button
              key={therapist.slug}
              type="button"
              onClick={() => onChange(active ? "" : therapist.slug)}
              className={`w-[168px] shrink-0 snap-start rounded-xl border p-2 text-left transition ${
                active ? "border-[#F47B20] ring-2 ring-[#F47B20]/30" : "border-[#e6dfd4] bg-white"
              }`}
            >
              <TherapistPortrait src={therapist.photo} alt={therapist.photoAlt} sizes="168px" />
              <span className="block px-1 pb-1 pt-3">
                <span className="block font-serif text-lg leading-tight">{therapist.name}</span>
                <span className="mt-1 block text-[11px] text-[#6B6B6B]">{therapist.experience}</span>
                <span className="mt-1 block text-xs leading-snug text-[#8a8175] line-clamp-2">{therapist.description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="text-sm font-medium">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        min={type === "number" ? 1 : undefined}
        className="mt-1 w-full rounded-xl border border-[#e6dfd4] px-3 py-3"
      />
    </label>
  );
}
