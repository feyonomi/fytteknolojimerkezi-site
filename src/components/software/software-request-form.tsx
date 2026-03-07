"use client";

import { FormEvent, useState } from "react";
import { submitLead } from "@/lib/client-leads";

export function SoftwareRequestForm() {
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Talep gönderiliyor...");

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") || "");
    const phone = String(formData.get("phone") || "");
    const email = String(formData.get("email") || "");
    const projectType = String(formData.get("projectType") || "");
    const budget = String(formData.get("budget") || "Belirtilmedi");
    const deadline = String(formData.get("deadline") || "Belirtilmedi");
    const details = String(formData.get("details") || "");

    try {
      const result = await submitLead({
        type: "software",
        fullName,
        phone,
        message: `${projectType} talebi | Bütçe: ${budget} | Teslim: ${deadline} | Detay: ${details}`,
        meta: {
          email,
          projectType,
          budget,
          deadline,
          details,
        },
      });
      setMessage(`Talep alındı. Referans kodu: ${result.referenceCode}`);
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Talep gönderilemedi.");
    }
  };

  return (
    <section className="glass-card p-6">
      <h2 className="text-2xl font-bold">Proje Talep Formu</h2>
      <p className="mt-2 text-sm text-muted">Web sitesi, mobil uygulama veya özel yazılım talebinizi detaylandırın.</p>

      <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
        <input name="fullName" className="rounded-lg border bg-transparent px-3 py-2 text-sm" placeholder="Ad Soyad" required />
        <input name="phone" className="rounded-lg border bg-transparent px-3 py-2 text-sm" placeholder="Telefon" required />
        <input name="email" className="rounded-lg border bg-transparent px-3 py-2 text-sm" placeholder="E-posta" type="email" required />
        <select name="projectType" className="rounded-lg border bg-transparent px-3 py-2 text-sm" required>
          <option value="">Proje Türü</option>
          <option>Kurumsal Web Sitesi</option>
          <option>E-Ticaret</option>
          <option>Android Uygulama</option>
          <option>iOS Uygulama</option>
          <option>Özel Yazılım</option>
        </select>
        <input name="budget" className="rounded-lg border bg-transparent px-3 py-2 text-sm" placeholder="Tahmini Bütçe" />
        <input name="deadline" className="rounded-lg border bg-transparent px-3 py-2 text-sm" placeholder="Teslim Süresi Beklentisi" />
        <textarea name="details" className="rounded-lg border bg-transparent px-3 py-2 text-sm md:col-span-2" rows={5} placeholder="Proje detayı, hedef kullanıcı, istenen modüller" required />
        <button className="btn-primary md:col-span-2" type="submit">Proje Talebi Gönder</button>
      </form>
      {message && <p className="mt-3 text-sm text-accent">{message}</p>}
    </section>
  );
}
