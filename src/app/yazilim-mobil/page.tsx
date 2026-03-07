import type { Metadata } from "next";
import { SoftwareRequestForm } from "@/components/software/software-request-form";

export const metadata: Metadata = {
  title: "Yazılım & Mobil Uygulama",
  description: "Web sitesi, özel yazılım ve Android/iOS mobil uygulama geliştirme hizmetleri.",
};

const portfolio = [
  {
    title: "Servis Takip Uygulaması",
    description: "Teknik servis süreçlerinde online bildirim ve canlı durum takibi.",
  },
  {
    title: "Kurumsal E-Ticaret Sitesi",
    description: "Ürün yönetimi, sipariş takibi ve SEO odaklı satış altyapısı.",
  },
  {
    title: "Mobil Randevu Sistemi",
    description: "Müşteri randevu akışı ve otomatik hatırlatma entegrasyonu.",
  },
];

export default function SoftwareMobilePage() {
  return (
    <main className="container-app section-space space-y-6">
      <section>
        <h1 className="section-title">Yazılım & Mobil Uygulama</h1>
        <p className="section-subtitle">İhtiyaca özel proje geliştirme, UI/UX tasarım ve sürdürülebilir teknik destek.</p>
      </section>

      <section className="grid-auto">
        {portfolio.map((item) => (
          <article key={item.title} className="glass-card p-5">
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-muted">{item.description}</p>
          </article>
        ))}
      </section>

      <SoftwareRequestForm />
    </main>
  );
}
