/** Normalize HTML time / slot values to HH:mm (24h). */
export function normalizeAppointmentTime(time: string): string {
  const t = time.trim();
  const match = t.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return t;
  const h = Math.min(23, Math.max(0, Number(match[1])));
  const m = Math.min(59, Math.max(0, Number(match[2])));
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
