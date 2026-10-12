/** Server-side mail environment (no secrets logged). Booking confirmations use Resend only. */

export function smtpConfig() {
  const host = process.env.SMTP_HOST?.trim() || "mail.globalorbitmail.cloud";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER?.trim() || "booking@kayahealingspa.com.np";
  const password = process.env.SMTP_PASSWORD?.trim();
  const secure = process.env.SMTP_SECURE === "true";
  return { host, port, user, password, secure, starttls: !secure && port === 587 };
}

export function smtpConfigured(): boolean {
  const { host, user, password } = smtpConfig();
  return Boolean(host && user && password);
}
