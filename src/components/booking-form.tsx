"use client";

import { packages, services } from "@/lib/content";
import { useState } from "react";

const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
const useExternalApi = apiBase.startsWith("https://") && !apiBase.includes("localhost") && !apiBase.includes("127.0.0.1");

function endpoint(path: "/appointments" | "/newsletter") {
  return useExternalApi ? `${apiBase}${path}` : `/api${path}`;
}

type Status = "idle" | "loading" | "success" | "error";

export function BookingForm({ service, packageSlug }: { service?: string; packageSlug?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.service && !data.packageSlug) {
      setStatus("error");
      setMessage("Choose a treatment or a package.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch(endpoint("/appointments"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          preferredDate: data.preferredDate,
          preferredTime: data.preferredTime,
          serviceSlug: data.service || undefined,
          packageSlug: data.packageSlug || undefined,
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
      setMessage("Your request is with the spa. This is not a confirmed booking until KAYA SPA replies.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 bg-white p-6 md:p-8" noValidate>
      <Field name="name" label="Name" required />
      <Field name="email" label="Email" type="email" required />
      <Field name="phone" label="Phone" type="tel" required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="preferredDate" label="Preferred date" type="date" required />
        <Field name="preferredTime" label="Preferred time" type="time" required />
      </div>
      <label className="text-sm">
        Service
        <select name="service" defaultValue={service ?? ""} className="mt-1 w-full border border-[#e6dfd4] px-3 py-3">
          <option value="">No single treatment</option>
          {services.map((item) => (
            <option key={item.slug} value={item.slug}>{item.name}</option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        Package
        <select name="packageSlug" defaultValue={packageSlug ?? ""} className="mt-1 w-full border border-[#e6dfd4] px-3 py-3">
          <option value="">No package</option>
          {packages.map((item) => (
            <option key={item.slug} value={item.slug}>{item.name}</option>
          ))}
        </select>
      </label>
      <Field name="guests" label="Number of guests" type="number" defaultValue="1" required />
      <label className="text-sm">
        Special request
        <textarea name="notes" rows={4} className="mt-1 w-full border border-[#e6dfd4] px-3 py-3" />
      </label>
      <button type="submit" className="btn-primary" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Request Appointment"}
      </button>
      {message && (
        <p role="status" className={`text-sm ${status === "error" ? "text-red-700" : "text-[#2f8f45]"}`}>
          {message}
        </p>
      )}
    </form>
  );
}

export function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");
    setStatus("loading");
    try {
      const response = await fetch(endpoint("/newsletter"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.message || "Could not subscribe.");
      setStatus("success");
      setMessage("You are on the list.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not subscribe.");
    }
  }

  return (
    <form id="newsletter" onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
      <label className="flex-1 text-sm">
        <span className="sr-only">Email</span>
        <input name="email" type="email" required placeholder="Email address" className="w-full border border-[#e6dfd4] px-3 py-3" />
      </label>
      <button className="btn-primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Joining…" : "Subscribe"}
      </button>
      {message && <p className="w-full text-sm">{message}</p>}
    </form>
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
    <label className="text-sm">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        min={type === "number" ? 1 : undefined}
        className="mt-1 w-full border border-[#e6dfd4] px-3 py-3"
      />
    </label>
  );
}
