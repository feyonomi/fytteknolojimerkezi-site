import type { Metadata } from "next";
import { AppointmentForm } from "@/components/appointments/appointment-form";

export const metadata: Metadata = {
  title: "Randevu Sistemi",
  description: "Takvimden randevu oluşturun, hizmet seçin ve otomatik hatırlatma alın.",
};

export default function AppointmentPage() {
  return (
    <main className="container-app section-space">
      <h1 className="section-title">Randevu Sistemi</h1>
      <p className="section-subtitle">Hizmet türü seçin, tarih-saat belirleyin, sistem otomatik hatırlatma planlasın.</p>
      <div className="mt-6">
        <AppointmentForm />
      </div>
    </main>
  );
}
