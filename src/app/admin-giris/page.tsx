import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Giriş",
  description: "Fyt Teknoloji Merkezi yönetim paneli giriş ekranı.",
};

type AdminLoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const { next } = await searchParams;
  const nextPath = next && next.startsWith("/") ? next : "/admin";

  return (
    <main className="container-app section-space">
      <AdminLoginForm nextPath={nextPath} />
    </main>
  );
}
