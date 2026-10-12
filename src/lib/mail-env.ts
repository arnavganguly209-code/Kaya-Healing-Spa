/** Server-side mail environment (booking + billing emails use SMTP). */
import { smtpConfigured } from "@/lib/smtp-mail";
import { smtpConfig } from "@/lib/spa-config";

export { smtpConfig, smtpConfigured };
