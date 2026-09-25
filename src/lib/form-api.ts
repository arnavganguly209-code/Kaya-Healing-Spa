/** Booking and contact forms always post to this site's Next.js API routes. */
export function formApiUrl(segment: "appointments" | "newsletter" | "contact-inquiry") {
  return `/api/${segment}`;
}
