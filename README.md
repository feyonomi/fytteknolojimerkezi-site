# Fyt Teknoloji Merkezi Web Sitesi

Modern, mobil uyumlu, SEO odaklı ve dark/light destekli Next.js projesi.

## Teknoloji Yığını

- Next.js (App Router, TypeScript)
- Tailwind CSS (v4)
- Supabase (DB + realtime altyapı)
- PWA (manifest + service worker)

## Öne Çıkan Modüller

- Ana sayfa: Hero + hizmet kartları + popüler ürünler + yorumlar + harita + WhatsApp
- Hizmetler, Mağaza, Teknik Servis/Arıza Takip, Randevu Sistemi
- Müşteri Paneli (telefon numarası ile kayıt geçmişi)
- Admin CRM (hızlı müşteri ara + çağrı kaydı)
- Fatura ödeme, baskı/fotokopi, yazılım/mobil proje talep sayfaları
- Blog (SEO içerik yapısı)

## Kurulum

```bash
npm install
cp .env.example .env.local
npm run dev
```

Tarayıcı: `http://localhost:3000`

## Ortam Değişkenleri

`.env.local` dosyasında:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_TAWK_SRC` (opsiyonel canlı chat)
- `ADMIN_PANEL_PASSWORD` (admin giriş şifresi)
- `ADMIN_SESSION_TOKEN` (rastgele uzun token)

Supabase bilgileri yoksa sistem mock veriyle çalışır.

Admin paneli koruması için `ADMIN_PANEL_PASSWORD` ve `ADMIN_SESSION_TOKEN` zorunludur.

## Veritabanı

Supabase SQL Editor üzerinde çalıştır:

- `supabase/schema.sql`
- (Opsiyonel başlangıç veri) `supabase/seed-products.sql`
- Daha önce kurulum yaptıysan bir kez: `supabase/products-image-upgrade.sql`

Bu şema, telefon numarasını `unique` müşteri anahtarı olarak kullanır ve CRM akışını destekler.

## Demo Dışı Kullanım (Ürün Yönetimi)

- Mağaza ürünleri artık API üzerinden `products` tablosundan çekilir.
- Ürün eklemek için Supabase SQL Editor örneği:

```sql
insert into products (name, category, condition, price, image_url, popular, is_active)
values ('Yeni Ürün', 'Telefon', 'Yeni', 19999, 'https://.../urun.jpg', true, true);
```

- Supabase görsel panelden ekleme (Table Editor):
	- `products` tablosu → `Insert row`
	- `name`, `category`, `condition`, `price` doldur
	- `image_url` alanına ürün görsel linki gir
	- `is_active=true` ve gerekirse `popular=true` ayarla
	- `Save` ile kaydet

- Supabase Storage ile görsel yüklemek istersen:
	- `Storage` → `New bucket` (ör: `product-images`, public)
	- Görseli yükle, `Public URL` kopyala
	- Bu URL'yi `products.image_url` alanına yapıştır

- Ürünü pasife çekmek için:

```sql
update products set is_active = false where id = 'URUN_UUID';
```

## Build / Production

```bash
npm run build
npm run start
```

GüzelHosting dağıtım adımları:

- `docs/deploy-guzelhosting.md`
