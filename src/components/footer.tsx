import Link from "next/link";
import { businessInfo } from "@/data/site";

export function Footer() {
  return (
    <footer className="mt-12 border-t">
      <div className="container-app grid gap-6 py-8 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold">Fyt Teknoloji Merkezi</h3>
          <p className="mt-2 text-sm text-muted">{businessInfo.slogan}</p>
          <p className="mt-2 text-sm text-muted">{businessInfo.address}</p>
        </div>

        <div>
          <h4 className="font-semibold">Hızlı Linkler</h4>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            <li>
              <Link href="/proje-plani" className="hover:text-accent">
                Site Haritası & Wireframe
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-accent">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/fatura-odeme" className="hover:text-accent">
                Fatura Ödeme
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">İletişim</h4>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            <li>
              Telefon / WhatsApp: <a href="tel:+905412991923">0541 299 19 23</a>
            </li>
            <li>
              Çalışma Saatleri: {businessInfo.workingHours}
            </li>
            <li>
              <a href={businessInfo.mapsLink} target="_blank" rel="noreferrer" className="hover:text-accent">
                Google Harita Konumu
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} Fyt Teknoloji Merkezi. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
