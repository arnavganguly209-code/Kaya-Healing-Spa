/** Safe email error text for public booking API responses (no SMTP internals). */
export function publicBookingEmailError(error?: string): string | undefined {
  if (!error?.trim()) return undefined;
  const lower = error.toLowerCase();
  if (
    lower.includes("smtp") ||
    lower.includes("auth") ||
    lower.includes("certificate") ||
    lower.includes("password") ||
    lower.includes("credential") ||
    lower.includes("econn") ||
    lower.includes("timeout")
  ) {
    return "We could not send the confirmation email yet. Your booking is saved — contact the spa with your booking number.";
  }
  return error.length > 160 ? `${error.slice(0, 157)}…` : error;
}
