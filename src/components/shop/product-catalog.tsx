"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { submitLead } from "@/lib/client-leads";
import { ProductItem } from "@/types";

export function ProductCatalog() {
  const [category, setCategory] = useState("Tümü");
  const [condition, setCondition] = useState("Tümü");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        const response = await fetch(`/api/products?ts=${Date.now()}`, { cache: "no-store" });
        const result = await response.json();
        if (active) {
          setProducts(Array.isArray(result.products) ? result.products : []);
        }
      } catch {
        if (active) {
          setProducts([]);
        }
      } finally {
        if (active) {
          setLoadingProducts(false);
        }
      }
    };

    loadProducts();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(
    () =>
      products.filter((item) => {
        const categoryMatch = category === "Tümü" || item.category === category;
        const conditionMatch = condition === "Tümü" || item.condition === condition;
        const searchMatch = item.name.toLowerCase().includes(search.toLowerCase());
        return categoryMatch && conditionMatch && searchMatch;
      }),
    [products, category, condition, search]
  );

  const categoryOptions = useMemo(
    () => [...new Set(products.map((item) => item.category))].sort((a, b) => a.localeCompare(b, "tr")),
    [products]
  );

  const conditionOptions = useMemo(
    () => [...new Set(products.map((item) => item.condition))].sort((a, b) => a.localeCompare(b, "tr")),
    [products]
  );

  const handleSecondHandSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage("Talebiniz kaydediliyor...");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const fullName = String(formData.get("fullName") || "");
    const phone = String(formData.get("phone") || "");
    const device = String(formData.get("device") || "");
    const expectedPrice = String(formData.get("expectedPrice") || "Belirtilmedi");
    const details = String(formData.get("details") || "Detay yok");

    try {
      const result = await submitLead({
        type: "second_hand",
        fullName,
        phone,
        message: `İkinci el satış talebi | Cihaz: ${device} | Beklenen Fiyat: ${expectedPrice} | Detay: ${details}`,
        meta: {
          device,
          expectedPrice,
          details,
        },
      });

      setFormMessage(`Talep alındı. Referans kodu: ${result.referenceCode}`);
      form.reset();
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : "Talep gönderilemedi.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card grid gap-3 p-4 md:grid-cols-4">
        <input
          className="rounded-lg border bg-transparent px-3 py-2 text-sm"
          placeholder="Ürün ara"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select className="select-readable rounded-lg border bg-transparent px-3 py-2 text-sm" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option className="bg-white text-slate-900">Tümü</option>
          {categoryOptions.map((item) => (
            <option key={item} value={item} className="bg-white text-slate-900">
              {item}
            </option>
          ))}
        </select>
        <select className="select-readable rounded-lg border bg-transparent px-3 py-2 text-sm" value={condition} onChange={(event) => setCondition(event.target.value)}>
          <option className="bg-white text-slate-900">Tümü</option>
          {conditionOptions.map((item) => (
            <option key={item} value={item} className="bg-white text-slate-900">
              {item}
            </option>
          ))}
        </select>
        <button className="btn-secondary" type="button" onClick={() => { setCategory("Tümü"); setCondition("Tümü"); setSearch(""); }}>
          Filtreyi Sıfırla
        </button>
      </div>

      {loadingProducts && (
        <div className="glass-card p-4 text-sm text-muted">Ürünler yükleniyor...</div>
      )}

      {!loadingProducts && filtered.length === 0 && (
        <div className="glass-card p-4 text-sm text-muted">
          Mağazada henüz aktif ürün yok. Yeni ürünler admin paneli/Supabase üzerinden eklendikçe burada görünecek.
        </div>
      )}

      <div className="grid-auto">
        {filtered.map((item) => (
          <article key={item.id} className="glass-card p-5">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                loading="lazy"
                className="mb-3 h-36 w-full rounded-lg object-cover"
              />
            ) : (
              <div className="mb-3 flex h-36 w-full items-center justify-center rounded-lg border bg-[linear-gradient(140deg,#0b2f51,#08344b,#153f66)] text-xs text-muted">
                Görsel Eklenmedi
              </div>
            )}
            <p className="text-xs text-muted">{item.category} • {item.condition}</p>
            <h3 className="mt-1 font-semibold">{item.name}</h3>
            <p className="mt-3 text-xl font-bold">₺{item.price.toLocaleString("tr-TR")}</p>
            <a
              className="btn-primary mt-4 inline-flex text-sm"
              href={`https://wa.me/905412991923?text=${encodeURIComponent(`${item.name} için teklif almak istiyorum.`)}`}
              target="_blank"
              rel="noreferrer"
            >
              Teklif Al
            </a>
          </article>
        ))}
      </div>

      <div className="glass-card p-5">
        <h3 className="text-lg font-semibold">İkinci El Cihaz Satış Formu</h3>
        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={handleSecondHandSubmit}>
          <input name="fullName" className="rounded-lg border bg-transparent px-3 py-2 text-sm" placeholder="Ad Soyad" required />
          <input name="phone" className="rounded-lg border bg-transparent px-3 py-2 text-sm" placeholder="Telefon" required />
          <input name="device" className="rounded-lg border bg-transparent px-3 py-2 text-sm" placeholder="Cihaz Marka/Model" required />
          <input name="expectedPrice" className="rounded-lg border bg-transparent px-3 py-2 text-sm" placeholder="Beklenen Fiyat" />
          <textarea name="details" className="rounded-lg border bg-transparent px-3 py-2 text-sm md:col-span-2" rows={4} placeholder="Cihaz durumu, aksesuar durumu, kozmetik bilgisi" />
          <button className="btn-primary md:col-span-2" type="submit">İkinci El Talebi Gönder</button>
        </form>
        {formMessage && <p className="mt-3 text-sm text-accent">{formMessage}</p>}
      </div>
    </div>
  );
}
