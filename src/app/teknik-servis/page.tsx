import type { Metadata } from "next";
import { ServiceCenter } from "@/components/service/service-center";

export const metadata: Metadata = {
  title: "Teknik Servis & Arıza Takip",
  description: "Online arıza bildirimi, takip kodu ile servis durumu ve canlı güncellemeler.",
};

export default function TechnicalServicePage() {
  return (
    <main className="container-app section-space">
      <h1 className="section-title">Teknik Servis & Arıza Takip</h1>
      <p className="section-subtitle">Online bildirim oluşturun, takip ekranından cihaz durumunu izleyin.</p>
      <div className="mt-6">
        <ServiceCenter />
      </div>
    </main>
  );
}
