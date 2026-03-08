"use client";

import { FormEvent, useState } from "react";

const serviceOptions = [
  "Teknik Servis",
  "Telefon/Bilgisayar Alım-Satım",
  "Fatura Ödeme",
  "Baskı & Fotokopi",
  "Yazılım Danışmanlığı",
];

export function AppointmentForm() {
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Randevu kaydediliyor...");
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      fullName: String(formData.get("fullName") || ""),
      phone: String(formData.get("phone") || ""),
      service: String(formData.get("service") || ""),
      appointmentAt: String(formData.get("appointmentAt") || ""),
      reminder: Boolean(formData.get("reminder")),
      note: String(formData.get("note") || ""),
    };

    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (!response.ok) {
      setMessage(result.error || "Randevu alınamadı.");
      return;
    }

    setMessage("Randevu oluşturuldu. Hatırlatma tercihiniz kaydedildi.");
    form.reset();
  };

  return (
    <section className="glass-card p-6">
      <h2 className="text-2xl font-bold">Randevu Sistemi</h2>
      <p className="mt-2 text-sm text-muted">Takvimden saat seçin, otomatik hatırlatma (SMS/WhatsApp) tercihini kaydedin.</p>
      <form onSubmit={handleSubmit} className="mt-5 grid gap-3 md:grid-cols-2">
        <input name="fullName" className="rounded-lg border bg-transparent px-3 py-2 text-sm" placeholder="Ad Soyad" required />
        <input name="phone" className="rounded-lg border bg-transparent px-3 py-2 text-sm" placeholder="Telefon" required />
        <select name="service" className="select-readable rounded-lg border bg-transparent px-3 py-2 text-sm" required>
          <option value="" className="bg-white text-slate-900">Hizmet seçin</option>
          {serviceOptions.map((service) => (
            <option key={service} value={service} className="bg-white text-slate-900">{service}</option>
          ))}
        </select>
        <input name="appointmentAt" type="datetime-local" className="rounded-lg border bg-transparent px-3 py-2 text-sm" required />
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input type="checkbox" name="reminder" defaultChecked />
          Otomatik hatırlatma almak istiyorum.
        </label>
        <textarea name="note" rows={3} className="rounded-lg border bg-transparent px-3 py-2 text-sm md:col-span-2" placeholder="Ek not" />
        <button className="btn-primary md:col-span-2" type="submit">Randevu Al</button>
      </form>
      {message && <p className="mt-3 text-sm text-accent">{message}</p>}
    </section>
  );
}
