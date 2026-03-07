import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import { businessInfo, services, testimonials, whyUs } from "@/data/site";
import { getProducts } from "@/lib/server-products";

export default async function Home() {
  const products = await getProducts();
  const popularProducts = products.filter((product) => product.popular);

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    name: businessInfo.name,
    url: `https://${businessInfo.domain}`,
    telephone: "+90 541 299 19 23",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1921 Sokak No: 4D",
      addressLocality: "Bayraklı",
      addressRegion: "İzmir",
      addressCountry: "TR",
    },
    openingHours: "Mo-Sa 09:00-19:00",
    sameAs: [businessInfo.mapsLink],
  };

  return (
    <main>
      <section className="section-space">
        <div className="container-app grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="mb-3 inline-flex rounded-full border px-3 py-1 text-sm text-muted">
              {businessInfo.workingHours}
            </p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              {businessInfo.slogan}
            </h1>
            <p className="mt-4 max-w-xl text-muted">
              Telefon, bilgisayar, teknik servis, fatura ödeme, baskı-fotokopi ve yazılım hizmetlerini tek noktada sunuyoruz.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/randevu" className="btn-primary">
                Hemen Randevu Al
              </Link>
              <Link href="/magaza" className="btn-secondary">
                Ürünleri İncele
              </Link>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80"
              alt="Fyt Teknoloji Merkezi mağaza görseli"
              className="h-[380px] w-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-app">
          <h2 className="section-title">Hizmetlerimiz</h2>
          <p className="section-subtitle">İhtiyacınıza göre hızlı çözümler, güvenilir servis ve şeffaf süreç yönetimi.</p>
          <div className="grid-auto mt-6">
            {services.map((service) => (
              <ScrollReveal key={service.id}>
                <article className="glass-card h-full p-5">
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm text-muted">{service.description}</p>
                  <Link href="/hizmetler" className="mt-4 inline-flex text-sm font-semibold text-accent">
                    Detayı Gör
                  </Link>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-app">
          <h2 className="section-title">Popüler Ürünler</h2>
          {popularProducts.length === 0 && (
            <div className="glass-card mt-5 p-4 text-sm text-muted">
              Popüler ürün listesi henüz eklenmedi. Ürünler eklendikçe bu alanda otomatik görünecek.
            </div>
          )}
          <div className="grid-auto mt-6">
            {popularProducts.map((product) => (
              <ScrollReveal key={product.id}>
                <article className="glass-card p-5">
                  <p className="text-xs text-muted">{product.category} • {product.condition}</p>
                  <h3 className="mt-1 font-semibold">{product.name}</h3>
                  <p className="mt-3 text-xl font-bold">₺{product.price.toLocaleString("tr-TR")}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-app grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="section-title">Müşteri Yorumları</h2>
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <ScrollReveal key={testimonial.id}>
                  <article className="glass-card p-5">
                    <p className="text-sm text-accent">{"★".repeat(testimonial.rating)}</p>
                    <p className="mt-2 text-sm">“{testimonial.comment}”</p>
                    <p className="mt-2 text-xs text-muted">{testimonial.name}</p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div>
            <h2 className="section-title">Neden Biz?</h2>
            <ul className="space-y-3">
              {whyUs.map((item) => (
                <ScrollReveal key={item}>
                  <li className="glass-card p-4 text-sm">{item}</li>
                </ScrollReveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-app grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="glass-card overflow-hidden">
            <iframe
              title="Fyt Teknoloji Merkezi Harita"
              src="https://www.google.com/maps?q=1921%20Sokak%20No%204D%20Bayrakli%20Izmir&output=embed"
              width="100%"
              height="360"
              loading="lazy"
              style={{ border: 0 }}
            />
          </div>
          <aside className="glass-card p-6">
            <h3 className="text-xl font-bold">Hızlı İletişim</h3>
            <p className="mt-3 text-sm text-muted">{businessInfo.address}</p>
            <a href="tel:+905412991923" className="mt-4 block text-lg font-semibold hover:text-accent">
              0541 299 19 23
            </a>
            <a
              href="https://wa.me/905412991923?text=Merhaba%20Fyt%20Teknoloji%20Merkezi"
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-4 inline-flex"
            >
              WhatsApp ile Yaz
            </a>
          </aside>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
    </main>
  );
}
