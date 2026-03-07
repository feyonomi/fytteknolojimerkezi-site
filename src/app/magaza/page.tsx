import type { Metadata } from "next";
import { ProductCatalog } from "@/components/shop/product-catalog";

export const metadata: Metadata = {
  title: "Mağaza / Ürünler",
  description: "Yeni ve ikinci el telefon, bilgisayar, tablet ve aksesuar ürünleri.",
};

export default function StorePage() {
  return (
    <main className="container-app section-space">
      <h1 className="section-title">Mağaza / Ürünler</h1>
      <p className="section-subtitle">Filtreli ürün listesi, teklif alma ve ikinci el satış formu.</p>
      <div className="mt-6">
        <ProductCatalog />
      </div>
    </main>
  );
}
