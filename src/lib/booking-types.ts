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

export type SpaBooking = {
  id: string;
  reference: string;
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
  notes?: string;
  privacyAccepted: boolean;
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
