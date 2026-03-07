import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { businessInfo } from "@/data/site";

export const metadata: Metadata = {
  title: "İletişim & Hakkımızda",
  description: "Fyt Teknoloji Merkezi iletişim bilgileri, adres, çalışma saatleri ve hakkımızda.",
};

export default function ContactPage() {
  return (
    <main className="container-app section-space space-y-6">
      <section className="glass-card p-6">
        <h1 className="section-title">İletişim & Hakkımızda</h1>
        <p className="section-subtitle">
          {businessInfo.name}, Bayraklı İzmir’de teknoloji ürünleri, teknik servis ve dijital çözümleri tek merkezde sunar.
        </p>
        <div className="mt-4 grid gap-2 text-sm text-muted">
          <p>Adres: {businessInfo.address}</p>
          <p>Telefon: 0541 299 19 23 (WhatsApp aktif)</p>
          <p>Çalışma Saatleri: {businessInfo.workingHours}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card overflow-hidden">
          <iframe
            title="Fyt Teknoloji Merkezi Konum"
            src="https://www.google.com/maps?q=1921%20Sokak%20No%204D%20Bayrakli%20Izmir&output=embed"
            width="100%"
            height="360"
            loading="lazy"
            style={{ border: 0 }}
          />
        </div>

        <ContactForm />
      </section>
    </main>
  );
}
