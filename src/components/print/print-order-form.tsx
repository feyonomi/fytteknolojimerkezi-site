"use client";

import { FormEvent, useMemo, useState } from "react";
import { submitLead } from "@/lib/client-leads";

const unitPrices = {
  siyah: 2,
  renkli: 5,
};

export function PrintOrderForm() {
  const [copyCount, setCopyCount] = useState(1);
  const [printType, setPrintType] = useState<"siyah" | "renkli">("siyah");
  const [pageCount, setPageCount] = useState(1);
  const [message, setMessage] = useState("");

  const totalPrice = useMemo(() => copyCount * pageCount * unitPrices[printType], [copyCount, pageCount, printType]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Talep gönderiliyor...");

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") || "");
    const phone = String(formData.get("phone") || "");
    const note = String(formData.get("note") || "");
    const uploadedFile = formData.get("file") as File | null;

    try {
      const result = await submitLead({
        type: "print",
        fullName,
        phone,
        message: `Baskı talebi | Sayfa: ${pageCount} | Adet: ${copyCount} | Tür: ${printType} | Tahmini Fiyat: ₺${totalPrice}`,
        meta: {
          pageCount,
          copyCount,
          printType,
          totalPrice,
          note,
          fileName: uploadedFile?.name || null,
        },
      });

      setMessage(`Talep alındı. Referans kodu: ${result.referenceCode}`);
      event.currentTarget.reset();
      setCopyCount(1);
      setPageCount(1);
      setPrintType("siyah");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Talep gönderilemedi.");
    }
  };

  return (
    <section className="glass-card p-6">
      <h2 className="text-2xl font-bold">Baskı & Fotokopi</h2>
      <p className="mt-2 text-sm text-muted">Dosyanızı yükleyin, adet ve baskı türünü seçin, otomatik fiyatı anında görün.</p>

      <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
        <input name="file" type="file" className="rounded-lg border bg-transparent px-3 py-2 text-sm md:col-span-2" />
        <input name="fullName" className="rounded-lg border bg-transparent px-3 py-2 text-sm" placeholder="Ad Soyad" required />
        <input name="phone" className="rounded-lg border bg-transparent px-3 py-2 text-sm" placeholder="Telefon" required />
        <input
          name="pageCount"
          type="number"
          min={1}
          className="rounded-lg border bg-transparent px-3 py-2 text-sm"
          value={pageCount}
          onChange={(event) => setPageCount(Number(event.target.value || 1))}
          placeholder="Sayfa sayısı"
        />
        <input
          name="copyCount"
          type="number"
          min={1}
          className="rounded-lg border bg-transparent px-3 py-2 text-sm"
          value={copyCount}
          onChange={(event) => setCopyCount(Number(event.target.value || 1))}
          placeholder="Adet"
        />
        <select name="printType" className="rounded-lg border bg-transparent px-3 py-2 text-sm" value={printType} onChange={(event) => setPrintType(event.target.value as "siyah" | "renkli")}>
          <option value="siyah">Siyah-Beyaz</option>
          <option value="renkli">Renkli</option>
        </select>
        <textarea name="note" className="rounded-lg border bg-transparent px-3 py-2 text-sm md:col-span-2" rows={3} placeholder="Not / teslim saati" />
        <div className="rounded-lg border p-3 text-sm md:col-span-2">
          Tahmini Toplam: <strong>₺{totalPrice.toLocaleString("tr-TR")}</strong>
        </div>
        <button className="btn-primary md:col-span-2" type="submit">Baskı Talebi Gönder</button>
      </form>
      {message && <p className="mt-3 text-sm text-accent">{message}</p>}
    </section>
  );
}
