"use client";

import { useState } from "react";
import { CustomerRecord } from "@/types";

export function CustomerPanel() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<CustomerRecord | null>(null);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    setLoading(true);
    setError("");
    setCustomer(null);

    const response = await fetch(`/api/customer?phone=${encodeURIComponent(phone)}`);
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error || "Kayıt bulunamadı.");
      return;
    }

    setCustomer(result.customer);
  };

  return (
    <section className="space-y-5">
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold">Müşteri Paneli</h2>
        <p className="mt-2 text-sm text-muted">Telefon numarası ile giriş yaparak geçmiş işlemlerinizi görüntüleyin.</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm"
            placeholder="Telefon numarası"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          <button className="btn-primary" type="button" onClick={handleFetch}>
            {loading ? "Yükleniyor..." : "Paneli Aç"}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </div>

      {customer && (
        <div className="grid gap-4 md:grid-cols-2">
          <article className="glass-card p-5 md:col-span-2">
            <h3 className="text-lg font-semibold">{customer.fullName}</h3>
            <p className="text-sm text-muted">{customer.phone}</p>
          </article>

          <article className="glass-card p-5">
            <h4 className="font-semibold">Randevular</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {customer.appointments.map((appointment) => (
                <li key={appointment.id} className="rounded-lg border p-2">
                  <p>{appointment.service}</p>
                  <p className="text-xs text-muted">{new Date(appointment.date).toLocaleString("tr-TR")} • {appointment.status}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="glass-card p-5">
            <h4 className="font-semibold">Arıza/Tamir Geçmişi</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {customer.repairs.map((repair) => (
                <li key={repair.id} className="rounded-lg border p-2">
                  <p>{repair.device} - {repair.issue}</p>
                  <p className="text-xs text-muted">{repair.status} • Garanti: {repair.warrantyEnd}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="glass-card p-5">
            <h4 className="font-semibold">Fatura Ödeme Geçmişi</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {customer.billPayments.map((payment) => (
                <li key={payment.id} className="rounded-lg border p-2">
                  <p>{payment.type}</p>
                  <p className="text-xs text-muted">₺{payment.amount.toLocaleString("tr-TR")} • {payment.date}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="glass-card p-5">
            <h4 className="font-semibold">Garanti Ürünleri</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {customer.purchases.map((purchase) => (
                <li key={purchase.id} className="rounded-lg border p-2">
                  <p>{purchase.product}</p>
                  <p className="text-xs text-muted">Garanti Bitiş: {purchase.warrantyEnd}</p>
                </li>
              ))}
            </ul>
          </article>
        </div>
      )}
    </section>
  );
}
