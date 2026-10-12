/**
 * Isolated SMTP config / sanitizer / skip-status checks.
 * Does not send mail or touch production booking JSON.
 */
process.env.KAYA_SKIP_ENV_FILE_LOAD = "1";

function fail(message: string): never {
  throw new Error(message);
}

async function main(): Promise<void> {
const { parseEnvFileContents, runtimeEnv, smtpEnvPresent } = await import("../src/lib/runtime-env");
const { smtpConfig } = await import("../src/lib/spa-config");
const { smtpConfigured, sanitizeSmtpError, sendSmtpMail } = await import("../src/lib/smtp-mail");
const { assessBookingConfig } = await import("../src/lib/booking-config");
const { publicBookingEmailError } = await import("../src/lib/booking-public-errors");

const parsed = parseEnvFileContents("SMTP_HOST=mail.globalorbitmail.cloud\nSMTP_PASSWORD=\"wrapped\"\n# comment\nSMTP_USER=booking@kayahealingspa.com.np\n");
if (parsed.SMTP_HOST !== "mail.globalorbitmail.cloud") fail("parse host");
if (parsed.SMTP_PASSWORD !== "wrapped") fail("parse quoted password should unwrap without logging");
if (parsed.SMTP_USER !== "booking@kayahealingspa.com.np") fail("parse user");

delete process.env.SMTP_HOST;
delete process.env.SMTP_PORT;
delete process.env.SMTP_SECURE;
delete process.env.SMTP_USER;
delete process.env.SMTP_PASSWORD;
delete process.env.SMTP_FROM_EMAIL;
delete process.env.BOOKING_PDF_SECRET;
delete process.env.RESEND_API_KEY;

if (smtpConfigured()) fail("smtpConfigured should be false without credential");
if (smtpEnvPresent().password) fail("password should be absent");

const missingIssues = assessBookingConfig();
if (!missingIssues.some((i) => i.code === "SMTP_NOT_CONFIGURED")) fail("expected SMTP_NOT_CONFIGURED");
if (process.env.RESEND_API_KEY) fail("RESEND_API_KEY must remain unset");

process.env.SMTP_HOST = "mail.globalorbitmail.cloud";
process.env.SMTP_PORT = "587";
process.env.SMTP_SECURE = "false";
process.env.SMTP_USER = "booking@kayahealingspa.com.np";
process.env.SMTP_PASSWORD = "isolated-test-credential";
process.env.SMTP_FROM_EMAIL = "booking@kayahealingspa.com.np";
process.env.BOOKING_PDF_SECRET = "isolated-test-pdf-secret";

if (runtimeEnv("SMTP_PASSWORD") !== "isolated-test-credential") fail("runtimeEnv dynamic lookup failed");
if (!smtpConfigured()) fail("smtpConfigured should be true when SMTP_* are set");

const cfg = smtpConfig();
if (cfg.host !== "mail.globalorbitmail.cloud") fail("host");
if (cfg.port !== 587) fail("port");
if (cfg.secure !== false) fail("secure should be false on 587");
if (cfg.starttls !== true) fail("STARTTLS required on 587");
if (!cfg.password) fail("password should be read via runtimeEnv");

const skipped = await sendSmtpMail({
  to: "not-an-email",
  subject: "x",
  html: "<p>x</p>",
});
if (skipped.ok || skipped.error !== "Invalid recipient address") fail("invalid recipient");

const mangled = sanitizeSmtpError("SMTP is not configured (missing SMTP_PASSWORD or host)");
if (/SMTP_password=\[redacted\]/i.test(mangled)) {
  fail("sanitizer must not rewrite SMTP_PASSWORD into SMTP_password=[redacted]");
}
if (mangled.includes("isolated-test-credential")) fail("sanitizer leaked test credential");

const publicErr = publicBookingEmailError("SMTP is not configured (missing host or SMTP credential)");
if (!publicErr || publicErr.toLowerCase().includes("smtp") || publicErr.toLowerCase().includes("password")) {
  fail("public error should hide SMTP internals");
}

delete process.env.SMTP_PASSWORD;
const skipSend = await sendSmtpMail({
  to: "guest@example.invalid",
  subject: "Booking Confirmation – Kaya Healing Spa | KAYA02099",
  html: "<p>test</p>",
  attachments: [{ filename: "KAYA02099-Booking-Confirmation.pdf", content: Buffer.from("%PDF-1.4") }],
});
if (skipSend.ok) fail("send without credential must not report success");
if (!("skipped" in skipSend) || !skipSend.skipped) fail("missing credential should be skipped, not sent");

console.log("booking-smtp-runtime-runner: PASS");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
