import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site Haritası & Wireframe",
  description: "Fyt Teknoloji Merkezi projesinin site haritası, wireframe özeti ve sayfa mimarisi.",
};

const siteMap = [
  "Ana Sayfa",
  "Hizmetler",
  "Mağaza / Ürünler",
  "Teknik Servis & Arıza Takip",
  "Randevu Sistemi",
  "Müşteri Paneli",
  "Admin CRM & Çağrı Yönetimi",
  "Fatura Ödeme",
  "Baskı & Fotokopi",
  "Yazılım & Mobil Uygulama",
  "İletişim & Hakkımızda",
  "Blog",
];

export default function ProjectPlanPage() {
  return (
    <main className="container-app section-space space-y-7">
      <section className="glass-card p-6">
        <h1 className="section-title">Site Haritası</h1>
        <p className="section-subtitle">Modern, mobil uyumlu ve SEO odaklı yapıda tüm zorunlu sayfalar planlandı.</p>
        <ul className="mt-4 grid gap-2 text-sm md:grid-cols-2">
          {siteMap.map((item) => (
            <li key={item} className="rounded-lg border p-2">• {item}</li>
          ))}
        </ul>
      </section>

      <section className="glass-card p-6">
        <h2 className="text-2xl font-bold">Ana Sayfa Wireframe Özeti</h2>
        <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <article className="rounded-lg border p-3">
            <h3 className="font-semibold">1) Hero</h3>
            <p className="text-muted">Büyük mağaza görseli + slogan + iki CTA (Randevu / Ürünler).</p>
          </article>
          <article className="rounded-lg border p-3">
            <h3 className="font-semibold">2) Hizmet Kartları</h3>
            <p className="text-muted">Tüm hizmetleri hızlı keşif için grid yapıda gösterim.</p>
          </article>
          <article className="rounded-lg border p-3">
            <h3 className="font-semibold">3) Popüler Ürünler</h3>
            <p className="text-muted">Öne çıkan telefon/bilgisayar/aksesuar ürünleri.</p>
          </article>
          <article className="rounded-lg border p-3">
            <h3 className="font-semibold">4) Güven Alanı</h3>
            <p className="text-muted">Müşteri yorumları + “Neden Biz?” başlığı altında güven metrikleri.</p>
          </article>
          <article className="rounded-lg border p-3 md:col-span-2">
            <h3 className="font-semibold">5) Konum & WhatsApp</h3>
            <p className="text-muted">Harita embed, adres/telefon ve sabit WhatsApp butonu ile hızlı iletişim.</p>
          </article>
        </div>
      </section>

      <section className="glass-card p-6">
        <h2 className="text-2xl font-bold">Admin Panel Wireframe Özeti</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">
          <li>Üstte hızlı müşteri arama alanı (telefon bazlı, tek anahtar).</li>
          <li>Müşteri kartında ad-soyad, arıza geçmişi, ürün & garanti geçmişi, fatura ödemeleri.</li>
          <li>Personel notları ve çağrı kaydı ekleme formu.</li>
          <li>Gerçek zamanlı güncellemelere hazır Supabase tablo yapısı.</li>
        </ul>
      </section>
    </main>
  );
}
