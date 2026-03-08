"use client";

import { FormEvent, useState } from "react";
import { submitLead } from "@/lib/client-leads";

export function ContactForm() {
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Mesajınız gönderiliyor...");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const fullName = String(formData.get("fullName") || "");
    const phone = String(formData.get("phone") || "");
    const email = String(formData.get("email") || "");
    const content = String(formData.get("content") || "");

    try {
      const result = await submitLead({
        type: "contact",
        fullName,
        phone,
        message: `İletişim formu mesajı: ${content}`,
        meta: { email, content },
      });

      setMessage(`Mesajınız alındı. Referans kodu: ${result.referenceCode}`);
      form.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Mesaj gönderilemedi.");
    }
  };

  return (
    <form className="glass-card grid gap-3 p-6" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold">Mesaj Gönder</h2>
      <input name="fullName" className="rounded-lg border bg-transparent px-3 py-2 text-sm" placeholder="Ad Soyad" required />
      <input name="phone" className="rounded-lg border bg-transparent px-3 py-2 text-sm" placeholder="Telefon" required />
      <input name="email" className="rounded-lg border bg-transparent px-3 py-2 text-sm" placeholder="E-posta" type="email" />
      <textarea name="content" className="rounded-lg border bg-transparent px-3 py-2 text-sm" rows={5} placeholder="Mesajınız" required />
      <button className="btn-primary" type="submit">Gönder</button>
      {message && <p className="text-sm text-accent">{message}</p>}
    </form>
  );
}
