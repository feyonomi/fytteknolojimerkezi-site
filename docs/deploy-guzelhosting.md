# GüzelHosting + Domain Yayınlama Rehberi

## 1) Sunucu Hazırlığı
- cPanel üzerinde Node.js App özelliğini açın.
- Node sürümünü 20+ seçin.
- Uygulama kök dizini olarak proje klasörünü gösterin.

## 2) Proje Kurulum
```bash
npm install
npm run build
npm run start
```

## 3) Ortam Değişkenleri
- cPanel Node.js App ekranından aşağıdaki değişkenleri ekleyin:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_TAWK_SRC` (opsiyonel)

## 4) Supabase SQL Kurulumu
- Supabase SQL Editor'de önce `supabase/schema.sql` çalıştırın.
- Ürünleri başlangıçta toplu eklemek için `supabase/seed-products.sql` çalıştırın.

## 5) Domain Bağlantısı
- Domain: `www.fytteknolojimerkezi.com`
- DNS'te `A` kaydı sunucu IP'sine yönlendirilsin.
- `www` için `CNAME` kaydı kök domaine yönlendirilsin.
- SSL (AutoSSL / Let's Encrypt) aktif edin.

## 6) Reverse Proxy (gerekiyorsa)
- Ana domain isteklerini Node.js app portuna yönlendirin.
- Statik dosya cache süresini en az 7 gün ayarlayın.

## 7) İlk Kontrol Listesi
- `/` sayfası açılıyor mu?
- `/admin`, `/musteri-paneli`, `/teknik-servis` API istekleri çalışıyor mu?
- `manifest.webmanifest` ve `sw.js` erişilebilir mi?
- WhatsApp sabit buton ve harita yükleniyor mu?
