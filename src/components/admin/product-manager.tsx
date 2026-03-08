"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ProductItem } from "@/types";
import { PRODUCT_CATEGORIES, PRODUCT_CONDITIONS, PRODUCT_NAME_SUGGESTIONS } from "@/data/product-options";

type AdminProduct = ProductItem & {
  isActive: boolean;
};

const CATEGORIES: ProductItem["category"][] = PRODUCT_CATEGORIES;
const CONDITIONS: ProductItem["condition"][] = PRODUCT_CONDITIONS;

export function ProductManager() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [category, setCategory] = useState<ProductItem["category"]>("Telefon");
  const [condition, setCondition] = useState<ProductItem["condition"]>("Yeni");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [popular, setPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin/products", { cache: "no-store" });
    const result = await response.json();

    if (!response.ok) {
      setLoading(false);
      setMessage(result.error || "Ürünler yüklenemedi.");
      return;
    }

    setProducts(result.products || []);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const resetForm = () => {
    setName("");
    setCategory("Telefon");
    setCondition("Yeni");
    setPrice("");
    setImageUrl("");
    setImageFile(null);
    setPopular(false);
    setIsActive(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    let finalImageUrl = imageUrl.trim();

    if (imageFile) {
      setMessage("Görsel yükleniyor...");
      const uploadForm = new FormData();
      uploadForm.append("file", imageFile);

      const uploadResponse = await fetch("/api/admin/uploads/product-image", {
        method: "POST",
        body: uploadForm,
      });

      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok) {
        setSaving(false);
        setMessage(uploadResult.error || "Görsel yüklenemedi.");
        return;
      }

      finalImageUrl = String(uploadResult.url || "");
    }

    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        category,
        condition,
        price,
        imageUrl: finalImageUrl,
        popular,
        isActive,
      }),
    });

    const result = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(result.error || "Ürün eklenemedi.");
      return;
    }

    setProducts((prev) => [result.product as AdminProduct, ...prev]);
    setMessage(result.message || "Ürün başarıyla eklendi.");
    resetForm();
  };

  return (
    <section className="glass-card p-6">
      <h2 className="text-2xl font-bold">Ürün Yönetimi</h2>
      <p className="mt-2 text-sm text-muted">Buradan mağaza ürünlerini ekleyebilir ve kayıtları kontrol edebilirsiniz.</p>

      <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
        <input
          className="rounded-lg border bg-transparent px-3 py-2 text-sm"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ürün adı"
          list="product-name-suggestions"
          required
        />
        <datalist id="product-name-suggestions">
          {PRODUCT_NAME_SUGGESTIONS.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>

        <input
          className="rounded-lg border bg-transparent px-3 py-2 text-sm"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="Fiyat (₺)"
          type="number"
          min="0"
          step="0.01"
          required
        />

        <select
          className="select-readable rounded-lg border bg-transparent px-3 py-2 text-sm"
          value={category}
          onChange={(event) => setCategory(event.target.value as ProductItem["category"])}
        >
          {CATEGORIES.map((item) => (
            <option key={item} value={item} className="bg-white text-slate-900">
              {item}
            </option>
          ))}
        </select>

        <select
          className="select-readable rounded-lg border bg-transparent px-3 py-2 text-sm"
          value={condition}
          onChange={(event) => setCondition(event.target.value as ProductItem["condition"])}
        >
          {CONDITIONS.map((item) => (
            <option key={item} value={item} className="bg-white text-slate-900">
              {item}
            </option>
          ))}
        </select>

        <input
          className="rounded-lg border bg-transparent px-3 py-2 text-sm md:col-span-2"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="Ürün görsel URL (opsiyonel)"
          type="url"
        />

        <input
          ref={fileInputRef}
          className="rounded-lg border bg-transparent px-3 py-2 text-sm md:col-span-2"
          onChange={(event) => setImageFile(event.target.files?.[0] || null)}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
        />

        <label className="flex items-center gap-2 text-sm">
          <input checked={popular} onChange={(event) => setPopular(event.target.checked)} type="checkbox" />
          Popüler ürün olarak işaretle
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input checked={isActive} onChange={(event) => setIsActive(event.target.checked)} type="checkbox" />
          Ürün aktif olsun
        </label>

        <button className="btn-primary md:col-span-2" type="submit" disabled={saving}>
          {saving ? "Kaydediliyor..." : "Ürün Ekle"}
        </button>
      </form>

      {message && <p className="mt-3 text-sm text-accent">{message}</p>}
      <p className="mt-2 text-xs text-muted">Ürün adı alanında yaygın elektronik model isimleri öneri olarak listelenir, isterseniz manuel de yazabilirsiniz.</p>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Kayıtlı Ürünler</h3>
        {loading ? (
          <p className="mt-2 text-sm text-muted">Yükleniyor...</p>
        ) : products.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Henüz kayıtlı ürün yok.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {products.slice(0, 20).map((product) => (
              <li key={product.id} className="rounded-lg border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{product.name}</p>
                  <span className="text-xs text-muted">
                    {product.isActive ? "Aktif" : "Pasif"} • {product.popular ? "Popüler" : "Normal"}
                  </span>
                </div>
                <p className="text-xs text-muted">
                  {product.category} • {product.condition} • ₺{Number(product.price).toLocaleString("tr-TR")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
