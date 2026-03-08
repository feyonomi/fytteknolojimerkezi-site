"use client";

import { useEffect, useState } from "react";
import { CustomerRecord } from "@/types";

type RecentAppointment = {
  id: string;
  phone: string;
  service: string;
  appointmentAt: string;
  status: string;
};

export function CrmPanel() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<CustomerRecord | null>(null);
  const [callSummary, setCallSummary] = useState("");
  const [staffName, setStaffName] = useState("Admin Personel");
  const [message, setMessage] = useState("");
  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const loadRecentAppointments = async () => {
    setLoadingAppointments(true);
    const response = await fetch("/api/admin/appointments", { cache: "no-store" });
    const result = await response.json();
    setLoadingAppointments(false);

    if (!response.ok) {
      return;
    }

    setRecentAppointments(Array.isArray(result.appointments) ? result.appointments : []);
  };

  useEffect(() => {
    loadRecentAppointments();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setMessage("");
    const response = await fetch(`/api/crm/search?phone=${encodeURIComponent(phone)}`);
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setCustomer(null);
      setMessage(result.error || "Müşteri bulunamadı.");
      return;
    }

    setCustomer(result.customer);
    setMessage("Müşteri geçmişi yüklendi.");
  };

  const handleAddCall = async () => {
    if (!customer || !callSummary.trim()) {
      return;
    }

    const response = await fetch("/api/crm/call-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: customer.phone, summary: callSummary, staff: staffName }),
    });

    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error || "Çağrı notu eklenemedi.");
      return;
    }

    setCustomer(result.customer);
    setCallSummary("");
    setMessage("Çağrı kaydı eklendi.");
  };

  return (
    <section className="space-y-5">
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold">CRM & Çağrı Sistemi</h2>
        <p className="mt-2 text-sm text-muted">Hızlı müşteri ara: telefon numarası ile tüm geçmişi anında görüntüleyin.</p>
        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <input
            className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm"
            placeholder="Telefon numarası"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          <button className="btn-primary" type="button" onClick={handleSearch}>
            {loading ? "Aranıyor..." : "Hızlı Müşteri Ara"}
          </button>
        </div>
        {message && <p className="mt-3 text-sm text-accent">{message}</p>}
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Son Randevular</h3>
          <button className="btn-secondary text-sm" type="button" onClick={loadRecentAppointments}>
            {loadingAppointments ? "Yükleniyor..." : "Yenile"}
          </button>
        </div>

        {recentAppointments.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Henüz kayıtlı randevu görünmüyor.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {recentAppointments.map((appointment) => (
              <li key={appointment.id} className="rounded-lg border p-3">
                <p className="font-medium">{appointment.service}</p>
                <p className="text-xs text-muted">
                  {new Date(appointment.appointmentAt).toLocaleString("tr-TR")} • {appointment.status}
                </p>
                <p className="mt-1 text-xs text-muted">Telefon: {appointment.phone}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {customer && (
        <div className="grid gap-4 lg:grid-cols-2">
          <article className="glass-card p-5 lg:col-span-2">
            <h3 className="text-lg font-semibold">{customer.fullName}</h3>
            <p className="text-sm text-muted">{customer.phone}</p>
          </article>

          <article className="glass-card p-5">
            <h4 className="font-semibold">Arıza / Tamir Geçmişi</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {customer.repairs.map((repair) => (
                <li key={repair.id} className="rounded-lg border p-2">
                  {repair.device} - {repair.issue}
                  <p className="text-xs text-muted">{repair.status} • {repair.date}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="glass-card p-5">
            <h4 className="font-semibold">Ürün & Garanti Geçmişi</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {customer.purchases.map((purchase) => (
                <li key={purchase.id} className="rounded-lg border p-2">
                  {purchase.product}
                  <p className="text-xs text-muted">{purchase.date} • Garanti: {purchase.warrantyEnd}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="glass-card p-5">
            <h4 className="font-semibold">Fatura Ödeme Kayıtları</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {customer.billPayments.map((payment) => (
                <li key={payment.id} className="rounded-lg border p-2">
                  {payment.type}
                  <p className="text-xs text-muted">₺{payment.amount.toLocaleString("tr-TR")} • {payment.date}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="glass-card p-5">
            <h4 className="font-semibold">Randevu Kayıtları</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {customer.appointments.map((appointment) => (
                <li key={appointment.id} className="rounded-lg border p-2">
                  {appointment.service}
                  <p className="text-xs text-muted">
                    {new Date(appointment.date).toLocaleString("tr-TR")} • {appointment.status}
                  </p>
                </li>
              ))}
            </ul>
          </article>

          <article className="glass-card p-5">
            <h4 className="font-semibold">Personel Notları</h4>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
              {customer.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </article>

          <article className="glass-card p-5 lg:col-span-2">
            <h4 className="font-semibold">Çağrı Kaydı Ekle</h4>
            <div className="mt-3 grid gap-3 md:grid-cols-[180px_1fr_auto]">
              <input
                className="rounded-lg border bg-transparent px-3 py-2 text-sm"
                value={staffName}
                onChange={(event) => setStaffName(event.target.value)}
                placeholder="Personel"
              />
              <input
                className="rounded-lg border bg-transparent px-3 py-2 text-sm"
                value={callSummary}
                onChange={(event) => setCallSummary(event.target.value)}
                placeholder="Çağrı özeti"
              />
              <button className="btn-primary" type="button" onClick={handleAddCall}>Kaydet</button>
            </div>

            <h5 className="mt-5 text-sm font-semibold">Son Çağrılar</h5>
            <ul className="mt-2 space-y-2 text-sm">
              {customer.callLogs.map((log) => (
                <li key={log.id} className="rounded-lg border p-2">
                  {log.summary}
                  <p className="text-xs text-muted">{new Date(log.date).toLocaleString("tr-TR")} • {log.staff}</p>
                </li>
              ))}
            </ul>
          </article>
        </div>
      )}
    </section>
  );
}
