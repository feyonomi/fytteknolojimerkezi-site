import type { Metadata } from "next";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { CrmPanel } from "@/components/admin/crm-panel";
import { ProductManager } from "@/components/admin/product-manager";

export const metadata: Metadata = {
  title: "Admin Kontrol Paneli",
  description: "CRM, çağrı yönetimi ve ürün ekleme işlemlerini tek panelden yönetin.",
};

export default function AdminPage() {
  return (
    <main className="container-app section-space">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h1 className="section-title mb-0">Admin Paneli</h1>
        <AdminLogoutButton />
      </div>
      <p className="section-subtitle">Kontrol paneli: ürün yönetimi, CRM ve çağrı kayıtları tek ekranda.</p>
      <div className="mt-6 space-y-6">
        <ProductManager />
        <CrmPanel />
      </div>
    </main>
  );
}
