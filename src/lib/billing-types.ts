export type InvoiceStatus = "draft" | "pending" | "partially_paid" | "paid" | "overdue" | "cancelled" | "refunded";

export type BillingLineItem = {
  description: string;
  quantity: number;
  unitPriceNpr: number;
  durationMinutes?: number;
  discountNpr?: number;
  taxRatePercent?: number;
  lineTotalNpr: number;
};

export type SpaInvoice = {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  bookingNumber: string;
  status: InvoiceStatus;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  lineItems: BillingLineItem[];
  subtotalNpr: number;
  discountNpr: number;
  taxNpr: number;
  taxRatePercent: number;
  totalNpr: number;
  amountPaidNpr: number;
  balanceDueNpr: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
};

export type PaymentTransactionStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "expired"
  | "refunded";

export type PaymentTransaction = {
  id: string;
  bookingId: string;
  invoiceId?: string;
  invoiceNumber?: string;
  gateway: "pay_at_spa" | "global_ime" | "manual";
  gatewayTransactionId?: string;
  merchantReference: string;
  amountNpr: number;
  currency: string;
  status: PaymentTransactionStatus;
  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
  refundAmountNpr?: number;
  lastError?: string;
  audit: { at: string; status: PaymentTransactionStatus; note?: string }[];
};
