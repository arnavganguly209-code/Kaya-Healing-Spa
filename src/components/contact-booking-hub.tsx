"use client";

import { formApiUrl } from "@/lib/form-api";
import { TherapistCard } from "@/components/therapist-card";
import { TherapistPortrait } from "@/components/therapist-portrait";
import { formatNpr, site } from "@/lib/content";
import type { OrbitTherapist } from "@/lib/orbit-types";
import type { Service, SpaPackage } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";
type BookingMode = "service" | "package" | "therapist";
type TherapistOffering = "service" | "package";

type Props = {
  services: Service[];
  packages: SpaPackage[];
  therapists: OrbitTherapist[];
  allowTherapistBooking?: boolean;
  confirmPhone?: string;
  initial?: { service?: string; package?: string; therapist?: string; mode?: string };
};

export function ContactBookingHub({ services, packages, therapists, allowTherapistBooking = true, confirmPhone, initial }: Props) {
  const canBookTherapist = allowTherapistBooking && therapists.length > 0;
  const defaultMode: BookingMode =
    canBookTherapist && (initial?.mode === "therapist" || initial?.therapist)
      ? "therapist"
      : initial?.mode === "package" || initial?.package
        ? "package"
        : "service";

  const [mode, setMode] = useState<BookingMode>(defaultMode);

  useEffect(() => {
    if (!canBookTherapist && mode === "therapist") setMode("service");
  }, [canBookTherapist, mode]);
  const bookingModes = (
    [
      ["service", "Book a treatment"],
      ["package", "Book a package"],
      ...(canBookTherapist ? ([["therapist", "Book therapist"]] as const) : []),
    ] as const
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap" role="tablist" aria-label="Booking type">
        {bookingModes.map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={mode === key}
            onClick={() => setMode(key)}
            className={`min-h-12 rounded-full px-5 py-3 text-sm font-semibold transition ${
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
          therapists={canBookTherapist ? therapists : []}
          confirmPhone={confirmPhone}
          initialService={initial?.service}
        />
      )}
      {mode === "package" && (
        <BookingPanel
          key="package"
          kind="package"
          services={services}
          packages={packages}
          therapists={canBookTherapist ? therapists : []}
          confirmPhone={confirmPhone}
          initialPackage={initial?.package}
        />
      )}
      {canBookTherapist && mode === "therapist" && (
        <BookingPanel
          key="therapist"
          kind="therapist"
          services={services}
          packages={packages}
          therapists={therapists}
          confirmPhone={confirmPhone}
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
  confirmPhone,
  initialService,
  initialPackage,
  initialTherapist,
}: {
  kind: BookingMode;
  services: Service[];
  packages: SpaPackage[];
  therapists: OrbitTherapist[];
  confirmPhone?: string;
  initialService?: string;
  initialPackage?: string;
  initialTherapist?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const idempotencyKey = useMemo(
    () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `idem-${Date.now()}`),
    [],
  );
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
    const therapistForBooking = kind === "therapist" ? therapist || undefined : undefined;
    try {
      const privacyAccepted = data.privacyAccepted === "on" || data.privacyAccepted === "true";
      if (!privacyAccepted) {
        setStatus("error");
        setMessage("Please accept the privacy policy and booking terms.");
        return;
      }
      const response = await fetch(formApiUrl("appointments"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingType: kind === "therapist" ? (offering === "package" ? "package" : "service") : kind,
          name: data.name,
          email: data.email,
          phone: data.phone,
          country: String(data.country || "Nepal"),
          preferredDate: data.preferredDate,
          preferredTime: data.preferredTime,
          durationMinutes: 60,
          serviceSlug: outService,
          packageSlug: outPackage,
          therapistSlug: therapistForBooking,
          guests: Number(data.guests || 1),
          notes: data.notes || undefined,
          privacyAccepted: true,
          idempotencyKey,
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        const detail = Array.isArray(body.message) ? body.message.join(" ") : body.message;
        throw new Error(detail || "The request could not be sent.");
      }
      if (body.data?.reference) {
        const q = new URLSearchParams({ ref: body.data.reference });
        if (body.data.pdfToken) q.set("token", body.data.pdfToken);
        if (body.data.emailSent) q.set("emailSent", "1");
        if (body.data.emailSkipped) q.set("emailSkipped", "1");
        window.location.assign(`/booking/confirmed?${q.toString()}`);
        return;
      }
      setStatus("success");
      setMessage("Booking saved. Check your email for confirmation.");
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
    <form onSubmit={onSubmit} className="grid min-w-0 gap-5 rounded-2xl border border-[#e6dfd4] bg-white p-4 sm:p-6 md:p-8" noValidate>
      <div>
        <h2 className="font-serif text-3xl">{title}</h2>
        <p className="prose-quiet mt-2 text-sm">
          {kind === "therapist"
            ? "Select your therapist, choose a treatment or package, then add your visit details."
            : `Share your details and preferred time. We confirm by phone at ${confirmPhone || site.phone}.`}
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
      <Field name="country" label="Country" defaultValue="Nepal" required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="preferredDate" label="Preferred date" type="date" required />
        <Field name="preferredTime" label="Preferred time" type="time" required />
      </div>
      <Field name="guests" label="Number of guests" type="number" defaultValue="1" required />

      <label className="text-sm">
        Notes for the spa
        <textarea
          name="notes"
          rows={4}
          className="mt-1 w-full rounded-xl border border-[#e6dfd4] px-3 py-3"
          placeholder="Pressure, allergies, couple room, etc."
        />
      </label>

      <label className="flex gap-2 text-xs text-[#6B6B6B]">
        <input type="checkbox" name="privacyAccepted" required />
        I agree to the privacy policy and booking terms.
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
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {therapists.map((therapist) => (
          <TherapistCard
            key={therapist.slug}
            therapist={therapist}
            compact
            fullWidth
            selected={value === therapist.slug}
            onSelect={() => onChange(value === therapist.slug ? "" : therapist.slug)}
          />
        ))}
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
        className="mt-1 w-full rounded-xl border border-[#e6dfd4] px-3 py-3 text-base"
      />
    </label>
  );
}
