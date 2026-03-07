import type { Metadata } from "next";
import { PrintOrderForm } from "@/components/print/print-order-form";

export const metadata: Metadata = {
  title: "Baskı & Fotokopi",
  description: "Dosya yükleme, adet seçimi ve otomatik fiyat hesaplama ile baskı siparişi.",
};

export default function PrintCopyPage() {
  return (
    <main className="container-app section-space">
      <h1 className="section-title">Baskı & Fotokopi</h1>
      <p className="section-subtitle">Tarama, renkli/siyah baskı, tez/ödev çıktısı ve kurumsal baskı desteği.</p>
      <div className="mt-6">
        <PrintOrderForm />
      </div>
    </main>
  );
}
