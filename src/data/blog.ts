export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "telefon-ekran-kirigi-ne-yapmali",
    title: "Telefon Ekranı Kırıldığında İlk 5 Adım",
    excerpt: "Ekran hasarında veri kaybı yaşamadan doğru servis süreci nasıl yönetilir?",
    date: "2026-03-01",
    category: "Teknik Servis",
    content: [
      "Ekran kırıldığında öncelikle cihazı zorlamayı bırakın ve ekran üzerine baskı uygulamayın.",
      "Veri güvenliği için mümkünse bulut yedekleme yapın veya servis öncesi yedek talep edin.",
      "Orijinal kaliteye yakın yedek parça kullanımı, dokunmatik hassasiyet için kritik önem taşır.",
      "Garantili tamir hizmeti, olası tekrar sorunlarda maliyetinizi korur.",
    ],
  },
  {
    slug: "ikinci-el-telefon-alirken-kontrol-listesi",
    title: "İkinci El Telefon Alırken Kontrol Listesi",
    excerpt: "IMEI kontrolü, pil sağlığı ve donanım testleri ile güvenli alışveriş.",
    date: "2026-02-22",
    category: "Alım-Satım",
    content: [
      "IMEI sorgusu ile cihazın kayıt ve çalıntı durumunu mutlaka doğrulayın.",
      "Batarya sağlığı, kamera testleri ve hoparlör-mikrofon kontrolü yapın.",
      "Cihazın daha önce büyük bir onarım görüp görmediğini servis geçmişinden inceleyin.",
      "Satın alma sonrasında garanti veya servis desteği alabileceğiniz işletmeleri tercih edin.",
    ],
  },
  {
    slug: "kucuk-isletmeler-icin-web-sitesi-seo-temelleri",
    title: "Küçük İşletmeler İçin Web Sitesi SEO Temelleri",
    excerpt: "Yerel aramalarda görünürlük artırmak için hızlı ve doğru yapılandırılmış bir site.",
    date: "2026-02-15",
    category: "Yazılım",
    content: [
      "Yerel SEO için işletme adı, adres ve telefon bilgilerinin tüm platformlarda tutarlı olması gerekir.",
      "Hızlı açılan mobil uyumlu sayfalar, kullanıcı deneyimi ve sıralama açısından avantaj sağlar.",
      "Schema.org işaretlemeleri arama sonuçlarında daha zengin görünüm elde etmenize destek olur.",
      "Düzenli blog içeriği, sektörünüzde uzmanlık sinyali verir ve organik trafiği artırır.",
    ],
  },
];
