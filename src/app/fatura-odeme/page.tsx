import type { Metadata } from "next";
import { BillPaymentForm } from "@/components/billing/bill-payment-form";

export const metadata: Metadata = {
  title: "Fatura Ödeme",
  description: "Elektrik, su, doğalgaz, internet ve diğer fatura ödeme işlemleri.",
};

export default function BillPaymentPage() {
  return (
    <main className="container-app section-space">
      <h1 className="section-title">Fatura Ödeme</h1>
      <p className="section-subtitle">Tür seçin, formu doldurun veya mağazada hızlı ödeme tercih edin.</p>
      <div className="mt-6">
        <BillPaymentForm />
      </div>
    </main>
  );
}
