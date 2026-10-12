export type BookingStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "cancelled"
  | "completed"
  | "no_show";

export type BookingAuditEntry = {
  at: string;
  status: BookingStatus;
  note?: string;
  by?: "system" | "admin";
};

export type PaymentStatus = "unpaid" | "partial" | "paid";

export type EmailDeliveryStatus = "pending" | "sent" | "failed" | "skipped";

export type BookingEmailDelivery = {
  status: EmailDeliveryStatus;
  resendMessageId?: string;
  attempts: number;
  lastAttemptAt?: string;
  lastError?: string;
  recipient?: string;
};

export type SpaBooking = {
  id: string;
  /** Legacy random ref; new bookings use sequential KAYA02001 in both fields */
  reference: string;
  bookingNumber?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  phone: string;
  country?: string;
  whatsapp?: string;
  serviceSlug?: string;
  serviceName?: string;
  packageSlug?: string;
  packageName?: string;
  therapistSlug?: string;
  therapistName?: string;
  durationMinutes: number;
  priceNpr: number | null;
  priceConfirmed: boolean;
  appointmentDate: string;
  appointmentTime: string;
  guests?: number;
  amountPaidNpr?: number;
  paymentStatus?: PaymentStatus;
  paymentMethod?: string;
  notes?: string;
  privacyAccepted: boolean;
  idempotencyKey?: string;
  pdfAccessToken?: string;
  emailDelivery?: BookingEmailDelivery;
  audit: BookingAuditEntry[];
};

export type BookingBlock = {
  id: string;
  date: string;
  /** HH:mm start; omit for full-day block */
  startTime?: string;
  /** HH:mm end; omit for full-day block */
  endTime?: string;
  reason?: string;
};

export type BookingSettings = {
  timezone: string;
  dayStartMinutes: number;
  lastStartMinutes: number;
  hardCloseMinutes: number;
  slotIntervalMinutes: number;
  defaultDurationMinutes: number;
  bufferMinutes: number;
  advanceBookingDays: number;
  blocks: BookingBlock[];
};
