import { findBookingByReference } from "@/lib/booking-store";
import { formatNpr } from "@/lib/content";
import { minutesToTime12, timeToMinutes } from "@/lib/booking-scheduler";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BookingConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  if (!ref?.trim()) notFound();
  const booking = findBookingByReference(ref.trim());
  if (!booking) notFound();

  const timeLabel = minutesToTime12(timeToMinutes(booking.appointmentTime));

  return (
    <div className="mx-auto max-w-2xl px-5 py-20 md:py-28">
      <p className="text-xs font-semibold tracking-[0.2em] text-[#F47B20] uppercase">Booking request received</p>
      <h1 className="mt-3 font-serif text-4xl text-[#141210]">Thank you</h1>
      <p className="mt-6 text-sm leading-7 text-[#4a453e]">
        Thank you for your booking request. Your request has been forwarded to our reception team for confirmation. Our team will review your preferred service, date and time and contact you using the details you provided. Thank you for choosing KAYA. For any inquiry, please contact our reception team.
      </p>
      <dl className="mt-10 space-y-3 rounded-2xl border border-[#e6dfd4] bg-[#fffdfb] p-6 text-sm">
        <div>
          <dt className="text-[#8a8175]">Reference</dt>
          <dd className="font-semibold">{booking.reference}</dd>
        </div>
        <div>
          <dt className="text-[#8a8175]">Status</dt>
          <dd className="font-semibold">Pending Reception Confirmation</dd>
        </div>
        {booking.serviceName && (
          <div>
            <dt className="text-[#8a8175]">Service</dt>
            <dd>{booking.serviceName}</dd>
          </div>
        )}
        <div>
          <dt className="text-[#8a8175]">Duration & price</dt>
          <dd>
            {booking.durationMinutes} minutes
            {booking.priceNpr && booking.priceNpr > 0 ? ` · ${formatNpr(booking.priceNpr)}` : " · price to be confirmed"}
          </dd>
        </div>
        <div>
          <dt className="text-[#8a8175]">Requested date & time</dt>
          <dd>{booking.appointmentDate} · {timeLabel}</dd>
        </div>
        {booking.therapistName && (
          <div>
            <dt className="text-[#8a8175]">Therapist</dt>
            <dd>{booking.therapistName}</dd>
          </div>
        )}
      </dl>
      <Link href="/" className="btn-primary mt-10 inline-flex">Return home</Link>
    </div>
  );
}
