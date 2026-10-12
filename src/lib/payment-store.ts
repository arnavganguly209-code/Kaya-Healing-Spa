import { withDataFileLock } from "@/lib/data-file-lock";
import type { PaymentTransaction, PaymentTransactionStatus } from "@/lib/billing-types";
import { dataFilePath, readJsonFile, writeJsonFileAtomic } from "@/lib/json-file";

const path = dataFilePath("payment-transactions.json");

export function readPaymentTransactions(): PaymentTransaction[] {
  return readJsonFile(path, () => []);
}

export function createPayAtSpaTransaction(input: {
  bookingId: string;
  invoiceId?: string;
  invoiceNumber?: string;
  amountNpr: number;
  merchantReference: string;
}) {
  return withDataFileLock("payment-data", () => {
    const list = readPaymentTransactions();
    const dup = list.find((t) => t.merchantReference === input.merchantReference && t.status === "pending");
    if (dup) return dup;

    const now = new Date().toISOString();
    const tx: PaymentTransaction = {
      id: `pay-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      bookingId: input.bookingId,
      invoiceId: input.invoiceId,
      invoiceNumber: input.invoiceNumber,
      gateway: "pay_at_spa",
      merchantReference: input.merchantReference,
      amountNpr: input.amountNpr,
      currency: "NPR",
      status: "pending",
      createdAt: now,
      updatedAt: now,
      audit: [{ at: now, status: "pending", note: "Pay at spa — no online charge" }],
    };
    list.unshift(tx);
    writeJsonFileAtomic(path, list.slice(0, 10000));
    return tx;
  });
}

export function updatePaymentStatus(id: string, status: PaymentTransactionStatus, note?: string, gatewayTransactionId?: string) {
  return withDataFileLock("payment-data", () => {
    const list = readPaymentTransactions();
    const i = list.findIndex((t) => t.id === id);
    if (i < 0) return null;
    const now = new Date().toISOString();
    const next = {
      ...list[i],
      status,
      updatedAt: now,
      verifiedAt: status === "succeeded" ? now : list[i].verifiedAt,
      gatewayTransactionId: gatewayTransactionId || list[i].gatewayTransactionId,
      audit: [...list[i].audit, { at: now, status, note }],
    };
    list[i] = next;
    writeJsonFileAtomic(path, list);
    return next;
  });
}
