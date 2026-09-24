export type AppointmentRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  guests: number;
  notes?: string;
  serviceSlug?: string;
  packageSlug?: string;
  createdAt: string;
};

export const memory = {
  appointments: [] as AppointmentRecord[],
  newsletter: [] as { email: string; createdAt: string }[],
  messages: [] as { name: string; email: string; message: string; createdAt: string }[],
};
