import { displayBookingNumber, findBookingByReference } from "@/lib/booking-store";
import { formatNpr } from "@/lib/content";
import { minutesToTime12, timeToMinutes } from "@/lib/booking-scheduler";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BookingConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; token?: string; emailSent?: string; emailSkipped?: string }>;
}) {
  const params = await searchParams;
  const ref = params.ref?.trim();
  if (!ref) notFound();
  const booking = findBookingByReference(ref);
  if (!booking) notFound();

  const number = displayBookingNumber(booking);
  const token = params.token?.trim() || booking.pdfAccessToken || "";
  const timeLabel = minutesToTime12(timeToMinutes(booking.appointmentTime));
  const total = booking.priceNpr ?? 0;
  const paid = booking.amountPaidNpr ?? 0;
  const due = total > 0 ? Math.max(0, total - paid) : 0;
  const emailSent = params.emailSent === "1" || booking.emailDelivery?.status === "sent";
  const emailSkipped = params.emailSkipped === "1" || booking.emailDelivery?.status === "skipped";
  const pdfHref = token ? `/api/bookings/pdf?ref=${encodeURIComponent(number)}&token=${encodeURIComponent(token)}` : null;

  return (
    <div className="mx-auto max-w-2xl px-5 py-20 md:py-28">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f5e9] text-2xl text-[#2f8f45]" aria-hidden>
        ✓
      </div>
      <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-[#F47B20] uppercase">Booking confirmed</p>
      <h1 className="mt-3 font-serif text-4xl text-[#141210]">Thank you for booking with Kaya Healing Spa</h1>
      <p className="mt-6 text-sm leading-7 text-[#4a453e]">
        Thank you for choosing Kaya Healing Spa. Your booking has been received successfully. Please keep your booking number for reference and present it at reception when you arrive. Payment will be collected at the spa.
      </p>

      <div className="mt-8 rounded-2xl border-2 border-[#F47B20]/30 bg-[#fff7f0] p-6 text-center">
        <p className="text-xs font-semibold tracking-[0.16em] text-[#8a8175] uppercase">Booking number</p>
        <p className="mt-2 font-serif text-3xl font-bold text-[#F47B20]">{number}</p>
      </div>

      <dl className="mt-8 space-y-3 rounded-2xl border border-[#e6dfd4] bg-[#fffdfb] p-6 text-sm">
        <div>
          <dt className="text-[#8a8175]">Guest</dt>
          <dd className="font-semibold">{booking.name}</dd>
        </div>
        {(booking.serviceName || booking.packageName) && (
          <div>
            <dt className="text-[#8a8175]">Service</dt>
            <dd>{booking.serviceName || booking.packageName}</dd>
          </div>
        )}
        <div>
          <dt className="text-[#8a8175]">Appointment</dt>
          <dd>{booking.appointmentDate} · {timeLabel}</dd>
        </div>
        <div>
          <dt className="text-[#8a8175]">Guests</dt>
          <dd>{booking.guests ?? 1}</dd>
        </div>
        <div>
          <dt className="text-[#8a8175]">Total</dt>
          <dd>{total > 0 ? formatNpr(total) : "To be confirmed at reception"}</dd>
        </div>
        <div>
          <dt className="text-[#8a8175]">Due at spa</dt>
          <dd className="font-semibold">{total > 0 ? formatNpr(due) : "—"}</dd>
        </div>
        <div>
          <dt className="text-[#8a8175]">Payment</dt>
          <dd>Pay at the spa — no online payment collected</dd>
        </div>
      </dl>

      {emailSent ? (
        <p className="mt-6 text-sm text-[#2f8f45]">A confirmation email with PDF attachment was sent to {booking.email}.</p>
      ) : emailSkipped ? (
        <p className="mt-6 text-sm text-[#8a8175]">
          Your reservation is saved. Email confirmation is not configured on the server yet — please save your booking number or download the PDF below.
        </p>
      ) : (
        <p className="mt-6 text-sm text-amber-900">
          Your reservation is saved. We could not send the confirmation email yet — please download your PDF or contact reception with booking number {number}.
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-4">
        {pdfHref ? (
          <a href={pdfHref} className="btn-primary inline-flex">
            Download booking PDF
          </a>
        ) : null}
        <Link href="/" className="btn-line inline-flex">Return to website</Link>
      </div>
    </div>
  );
}
