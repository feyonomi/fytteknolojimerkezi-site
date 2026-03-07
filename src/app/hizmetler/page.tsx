import type { Metadata } from "next";
import { services } from "@/data/site";

export const metadata: Metadata = {
  title: "Hizmetler",
  description: "Fyt Teknoloji Merkezi detaylı hizmet listesi ve kapsamları.",
};

export default function ServicesPage() {
  return (
    <main className="container-app section-space">
      <h1 className="section-title">Hizmetler</h1>
      <p className="section-subtitle">Tüm hizmetlerimiz tek merkezde, hızlı ve güvenilir süreçlerle sunulur.</p>

      <div className="mt-6 space-y-3">
        {services.map((service) => (
          <details key={service.id} className="glass-card p-4" open={service.id === "teknik-servis"}>
            <summary className="cursor-pointer list-none text-lg font-semibold">{service.title}</summary>
            <p className="mt-2 text-sm text-muted">{service.description}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
              {service.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </main>
  );
}
