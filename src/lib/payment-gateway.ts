/**
 * Payment gateway integration scaffold.
 * Live Global IME (or other) checkout requires merchant credentials — not configured in repo.
 */

export type PaymentInitiateResult =
  | { mode: "pay_at_spa"; message: string }
  | { mode: "redirect"; checkoutUrl: string; transactionId: string }
  | { mode: "unavailable"; reason: string };

export function isOnlineGatewayConfigured(): boolean {
  return Boolean(
    process.env.GLOBAL_IME_MERCHANT_ID?.trim() &&
      process.env.GLOBAL_IME_API_KEY?.trim() &&
      process.env.GLOBAL_IME_API_SECRET?.trim(),
  );
}

export async function initiateOnlinePayment(_input: {
  amountNpr: number;
  merchantReference: string;
  customerEmail: string;
}): Promise<PaymentInitiateResult> {
  if (!isOnlineGatewayConfigured()) {
    return {
      mode: "pay_at_spa",
      message: "Online payment is not enabled. Pay at the spa on arrival.",
    };
  }
  // Merchant-specific API wiring belongs here once official IME Global Pay API docs and credentials are provided.
  return {
    mode: "unavailable",
    reason: "Global IME gateway credentials are present but checkout integration is not yet implemented. Use pay at spa.",
  };
}

export function verifyGatewayWebhookSignature(_rawBody: string, _signatureHeader: string | null): boolean {
  if (!isOnlineGatewayConfigured()) return false;
  return false;
}
