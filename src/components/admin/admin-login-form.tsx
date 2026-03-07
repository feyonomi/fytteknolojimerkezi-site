"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type AdminLoginFormProps = {
  nextPath: string;
};

export function AdminLoginForm({ nextPath }: AdminLoginFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("Giriş yapılıyor...");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error || "Giriş başarısız.");
        setLoading(false);
        return;
      }

      setMessage("Giriş başarılı, yönlendiriliyorsunuz...");
      router.push(nextPath.startsWith("/") ? nextPath : "/admin");
      router.refresh();
    } catch {
      setMessage("Bir hata oluştu. Tekrar deneyin.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card mx-auto mt-8 grid max-w-md gap-3 p-6">
      <h1 className="text-2xl font-bold">Admin Giriş</h1>
      <p className="text-sm text-muted">Bu alan sadece yetkili personel içindir.</p>
      <input
        type="password"
        className="rounded-lg border bg-transparent px-3 py-2 text-sm"
        placeholder="Admin şifresi"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? "Kontrol Ediliyor..." : "Giriş Yap"}
      </button>
      {message && <p className="text-sm text-accent">{message}</p>}
    </form>
  );
}
