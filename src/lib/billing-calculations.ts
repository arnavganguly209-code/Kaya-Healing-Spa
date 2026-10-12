import type { BillingLineItem } from "@/lib/billing-types";

export function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

export function computeLineTotal(item: Omit<BillingLineItem, "lineTotalNpr">): number {
  const gross = item.quantity * item.unitPriceNpr;
  const afterDiscount = gross - (item.discountNpr ?? 0);
  const tax = item.taxRatePercent ? afterDiscount * (item.taxRatePercent / 100) : 0;
  return roundMoney(Math.max(0, afterDiscount + tax));
}

export function computeInvoiceTotals(
  lineItems: BillingLineItem[],
  invoiceTaxRatePercent: number,
  amountPaidNpr: number,
) {
  const subtotalNpr = roundMoney(lineItems.reduce((s, l) => s + l.quantity * l.unitPriceNpr, 0));
  const discountNpr = roundMoney(lineItems.reduce((s, l) => s + (l.discountNpr ?? 0), 0));
  const taxable = Math.max(0, subtotalNpr - discountNpr);
  const taxNpr = invoiceTaxRatePercent > 0 ? roundMoney(taxable * (invoiceTaxRatePercent / 100)) : 0;
  const totalNpr = roundMoney(taxable + taxNpr);
  const amountPaid = roundMoney(amountPaidNpr);
  const balanceDueNpr = roundMoney(Math.max(0, totalNpr - amountPaid));
  return { subtotalNpr, discountNpr, taxNpr, totalNpr, amountPaidNpr: amountPaid, balanceDueNpr };
}

export function defaultTaxRatePercent(): number {
  const raw = process.env.BILLING_TAX_RATE_PERCENT?.trim();
  if (!raw) return 0;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}
