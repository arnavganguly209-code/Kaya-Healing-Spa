"use client";

import { displayBookingNumber } from "@/lib/booking-number";
import { formatNpr } from "@/lib/content";
import type { SpaBooking } from "@/lib/booking-types";
import { useMemo, useState } from "react";

function dueAmount(b: SpaBooking) {
  const total = b.priceNpr ?? 0;
  const paid = b.amountPaidNpr ?? 0;
  return total > 0 ? Math.max(0, total - paid) : 0;
}

export function AdminBookingsSection({
  bookings,
  onStatusChange,
  onRefresh,
}: {
  bookings: SpaBooking[];
  onStatusChange: (id: string, status: SpaBooking["status"]) => Promise<void>;
  onRefresh: () => void;
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [emailFilter, setEmailFilter] = useState<string>("all");
  const [selected, setSelected] = useState<SpaBooking | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 15;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      const emailStatus = b.emailDelivery?.status ?? "pending";
      if (emailFilter !== "all" && emailStatus !== emailFilter) return false;
      if (!q) return true;
      const hay = `${displayBookingNumber(b)} ${b.name} ${b.email} ${b.phone} ${b.serviceName ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [bookings, query, statusFilter, emailFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const slice = filtered.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <>
      <p className="text-sm text-[#6B6B6B]">Search, filter, and download PDF confirmations. Legacy bookings without KAYA##### numbers are shown as-is.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
          placeholder="Search booking no., name, email…"
          className="min-w-[220px] flex-1 rounded-xl border px-3 py-2 text-sm"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border px-3 py-2 text-sm">
          <option value="all">All statuses</option>
          {["pending", "confirmed", "rejected", "cancelled", "completed", "no_show"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={emailFilter} onChange={(e) => setEmailFilter(e.target.value)} className="rounded-xl border px-3 py-2 text-sm">
          <option value="all">All email states</option>
          {["pending", "sent", "failed", "skipped"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button type="button" className="rounded-xl border px-3 py-2 text-sm" onClick={onRefresh}>Refresh</button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[#efe8e0]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#faf8f5] text-xs uppercase tracking-wide text-[#8a8175]">
            <tr>
              <th className="px-3 py-3">Booking #</th>
              <th className="px-3 py-3">Customer</th>
              <th className="px-3 py-3">Service</th>
              <th className="px-3 py-3">Appointment</th>
              <th className="px-3 py-3">Total</th>
              <th className="px-3 py-3">Due</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Email</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((b) => (
              <tr key={b.id} className="border-t border-[#f0ece8]">
                <td className="px-3 py-3 font-semibold">{displayBookingNumber(b)}</td>
                <td className="px-3 py-3">
                  <div>{b.name}</div>
                  <div className="text-xs text-[#8a8175]">{b.email}</div>
                </td>
                <td className="px-3 py-3">{b.serviceName || b.packageName || "—"}<br /><span className="text-xs">{b.durationMinutes} min · {b.guests ?? 1} guest(s)</span></td>
                <td className="px-3 py-3 text-xs">{b.appointmentDate}<br />{b.appointmentTime}</td>
                <td className="px-3 py-3">{b.priceNpr && b.priceNpr > 0 ? formatNpr(b.priceNpr) : "TBC"}</td>
                <td className="px-3 py-3">{b.priceNpr && b.priceNpr > 0 ? formatNpr(dueAmount(b)) : "—"}</td>
                <td className="px-3 py-3">
                  <select
                    value={b.status}
                    className="rounded border px-2 py-1 text-xs"
                    onChange={(e) => onStatusChange(b.id, e.target.value as SpaBooking["status"])}
                  >
                    {["pending", "confirmed", "rejected", "cancelled", "completed", "no_show"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-3 text-xs">{b.emailDelivery?.status ?? "pending"}</td>
                <td className="px-3 py-3">
                  <button type="button" className="text-xs font-semibold text-[#F47B20] hover:underline" onClick={() => setSelected(b)}>
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!slice.length && <p className="p-6 text-sm text-[#8a8175]">No bookings match.</p>}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span>{filtered.length} booking(s)</span>
        <div className="flex gap-2">
          <button type="button" disabled={page <= 0} className="rounded border px-3 py-1 disabled:opacity-40" onClick={() => setPage((p) => p - 1)}>Prev</button>
          <span>{page + 1} / {pageCount}</span>
          <button type="button" disabled={page >= pageCount - 1} className="rounded border px-3 py-1 disabled:opacity-40" onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-serif text-2xl">{displayBookingNumber(selected)}</h3>
              <button type="button" className="text-sm text-[#8a8175]" onClick={() => setSelected(null)}>Close</button>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div><dt className="text-[#8a8175]">Customer</dt><dd>{selected.name} · {selected.email} · {selected.phone}</dd></div>
              <div><dt className="text-[#8a8175]">Appointment</dt><dd>{selected.appointmentDate} {selected.appointmentTime} · {selected.durationMinutes} min</dd></div>
              <div><dt className="text-[#8a8175]">Service</dt><dd>{selected.serviceName || selected.packageName}</dd></div>
              <div><dt className="text-[#8a8175]">Pricing</dt><dd>Total {selected.priceNpr ? formatNpr(selected.priceNpr) : "TBC"} · Paid {formatNpr(selected.amountPaidNpr ?? 0)} · Due {selected.priceNpr ? formatNpr(dueAmount(selected)) : "—"}</dd></div>
              <div><dt className="text-[#8a8175]">Email</dt><dd>{selected.emailDelivery?.status} {(selected.emailDelivery?.providerMessageId || selected.emailDelivery?.resendMessageId) ? `· ${selected.emailDelivery?.providerMessageId || selected.emailDelivery?.resendMessageId}` : ""}{selected.emailDelivery?.lastError ? ` · ${selected.emailDelivery.lastError}` : ""}</dd></div>
              {selected.notes && <div><dt className="text-[#8a8175]">Notes</dt><dd>{selected.notes}</dd></div>}
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`/api/admin/bookings/pdf?id=${encodeURIComponent(selected.id)}`} className="btn-primary text-sm">Download PDF</a>
              <a href={`/api/admin/bookings/pdf?id=${encodeURIComponent(selected.id)}&variant=invoice`} className="btn-line text-sm">Download invoice</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
