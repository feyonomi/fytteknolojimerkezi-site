"use client";

import { FormEvent, useState } from "react";

type TrackingResult = {
  trackingCode: string;
  status: string;
  updatedAt: string;
  note: string;
};

export function ServiceCenter() {
  const [trackingCode, setTrackingCode] = useState("");
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  const handleReportSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage("Kaydediliyor...");

    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: String(formData.get("fullName") || ""),
      phone: String(formData.get("phone") || ""),
      device: String(formData.get("device") || ""),
      issue: String(formData.get("issue") || ""),
    };

    const response = await fetch("/api/service-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      setFormMessage(result.error || "Bir hata oluştu.");
      return;
    }

    setFormMessage(`Kayıt oluşturuldu. Takip kodu: ${result.trackingCode}`);
    event.currentTarget.reset();
  };

  const handleTrackingSearch = async () => {
    if (!trackingCode.trim()) {
      return;
    }

    setLoading(true);
    const response = await fetch(`/api/service-orders/${trackingCode.trim()}`);
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setTrackingResult(null);
      return;
    }

    setTrackingResult(result);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="glass-card p-6">
        <h2 className="text-xl font-bold">Online Arıza Bildirimi</h2>
        <p className="mt-2 text-sm text-muted">Formu doldurun, sistem anında takip kodu üretsin.</p>

        <form onSubmit={handleReportSubmit} className="mt-4 grid gap-3">
          <input name="fullName" className="rounded-lg border bg-transparent px-3 py-2 text-sm" placeholder="Ad Soyad" required />
          <input name="phone" className="rounded-lg border bg-transparent px-3 py-2 text-sm" placeholder="Telefon" required />
          <input name="device" className="rounded-lg border bg-transparent px-3 py-2 text-sm" placeholder="Cihaz (örn. iPhone 12)" required />
          <textarea name="issue" className="rounded-lg border bg-transparent px-3 py-2 text-sm" rows={4} placeholder="Arıza açıklaması" required />
          <button className="btn-primary" type="submit">Arıza Kaydı Oluştur</button>
        </form>

        {formMessage && <p className="mt-3 text-sm text-accent">{formMessage}</p>}
      </section>

      <section className="glass-card p-6">
        <h2 className="text-xl font-bold">Arıza Takip Ekranı</h2>
        <p className="mt-2 text-sm text-muted">Takip kodunuzu girin, güncel durumu gerçek zamanlı izleyin.</p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm"
            placeholder="Örn: FYT-1001"
            value={trackingCode}
            onChange={(event) => setTrackingCode(event.target.value.toUpperCase())}
          />
          <button className="btn-secondary" type="button" onClick={handleTrackingSearch}>
            {loading ? "Sorgulanıyor..." : "Durumu Sorgula"}
          </button>
        </div>

        {trackingResult && (
          <article className="mt-5 rounded-lg border p-4">
            <p className="text-xs text-muted">Takip Kodu</p>
            <p className="font-semibold">{trackingResult.trackingCode}</p>
            <p className="mt-2 text-xs text-muted">Durum</p>
            <p className="font-semibold text-accent">{trackingResult.status}</p>
            <p className="mt-2 text-xs text-muted">Not</p>
            <p className="text-sm">{trackingResult.note}</p>
            <p className="mt-2 text-xs text-muted">Son Güncelleme: {new Date(trackingResult.updatedAt).toLocaleString("tr-TR")}</p>
          </article>
        )}
      </section>
    </div>
  );
}
