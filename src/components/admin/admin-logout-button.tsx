"use client";

import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin-giris");
    router.refresh();
  };

  return (
    <button className="btn-secondary text-sm" type="button" onClick={handleLogout}>
      Çıkış Yap
    </button>
  );
}
