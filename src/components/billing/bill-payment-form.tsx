"use client";

import { FormEvent, useState } from "react";
import { billTypes } from "@/data/site";

export function BillPaymentForm() {
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Talebiniz kaydediliyor...");
    const formData = new FormData(event.currentTarget);

    const payload = {
      fullName: String(formData.get("fullName") || ""),
      phone: String(formData.get("phone") || ""),
      billType: String(formData.get("billType") || ""),
      institution: String(formData.get("institution") || ""),
      amount: Number(formData.get("amount") || 0),
      note: String(formData.get("note") || ""),
      preferredMethod: String(formData.get("preferredMethod") || ""),
    };

    const response = await fetch("/api/bill-payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (!response.ok) {
      setMessage(result.error || "Talep alınamadı.");
      return;
    }

    setMessage("Talebiniz alındı. Uygun kanal üzerinden sizinle iletişime geçeceğiz.");
    event.currentTarget.reset();
  };

  return (
    <section className="glass-card p-6">
      <h2 className="text-2xl font-bold">Fatura Ödeme Sayfası</h2>
      <p className="mt-2 text-sm text-muted">İsterseniz online form bırakın, isterseniz dükkana gelerek hızlı ödeme yapın.</p>

      <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
        <input name="fullName" className="rounded-lg border bg-transparent px-3 py-2 text-sm" placeholder="Ad Soyad" required />
        <input name="phone" className="rounded-lg border bg-transparent px-3 py-2 text-sm" placeholder="Telefon" required />
        <select name="billType" className="rounded-lg border bg-transparent px-3 py-2 text-sm" required>
          <option value="">Fatura türü seçin</option>
          {billTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <input name="institution" className="rounded-lg border bg-transparent px-3 py-2 text-sm" placeholder="Kurum adı" required />
        <input name="amount" type="number" min={0} step="0.01" className="rounded-lg border bg-transparent px-3 py-2 text-sm" placeholder="Tutar" required />
        <select name="preferredMethod" className="rounded-lg border bg-transparent px-3 py-2 text-sm" required>
          <option value="">Ödeme yöntemi</option>
          <option value="Online">Online Ön Talep</option>
          <option value="Magaza">Mağazada Ödeme</option>
        </select>
        <textarea name="note" rows={3} className="rounded-lg border bg-transparent px-3 py-2 text-sm md:col-span-2" placeholder="Abone no / açıklama" />
        <button className="btn-primary md:col-span-2" type="submit">Ödeme Talebi Oluştur</button>
      </form>

      {message && <p className="mt-3 text-sm text-accent">{message}</p>}
    </section>
  );
}
