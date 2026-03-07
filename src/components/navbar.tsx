"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/magaza", label: "Mağaza" },
  { href: "/teknik-servis", label: "Teknik Servis" },
  { href: "/randevu", label: "Randevu" },
  { href: "/musteri-paneli", label: "Müşteri Paneli" },
  { href: "/admin", label: "Admin" },
  { href: "/iletisim", label: "İletişim" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="container-app flex items-center justify-between py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Fyt Teknoloji Merkezi
        </Link>

        <button
          type="button"
          className="btn-secondary text-sm md:hidden"
          onClick={() => setOpen((state) => !state)}
          aria-label="Menüyü aç"
        >
          Menü
        </button>

        <nav className="hidden items-center gap-3 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-1.5 text-sm transition ${
                pathname === item.href
                  ? "bg-accent text-[#03231b]"
                  : "hover:bg-card"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>

      {open && (
        <nav className="container-app flex flex-col gap-2 border-t py-3 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-3 py-2 text-sm transition ${
                pathname === item.href
                  ? "bg-accent text-[#03231b]"
                  : "bg-card hover:border hover:border-accent"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-1">
            <ThemeToggle />
          </div>
        </nav>
      )}
    </header>
  );
}
