import type { Metadata } from "next";
import { CustomerPanel } from "@/components/customer/customer-panel";

export const metadata: Metadata = {
  title: "Müşteri Paneli",
  description: "Randevular, arıza geçmişi, ödeme kayıtları ve garanti ürünleri tek panelde.",
};

export default function CustomerPanelPage() {
  return (
    <main className="container-app section-space">
      <h1 className="section-title">Müşteri Paneli</h1>
      <p className="section-subtitle">Giriş sonrası randevu, arıza ve ödeme geçmişinizi görüntüleyin.</p>
      <div className="mt-6">
        <CustomerPanel />
      </div>
    </main>
  );
}
