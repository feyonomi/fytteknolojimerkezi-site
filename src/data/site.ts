import { ProductItem, ServiceItem, Testimonial } from "@/types";

export const businessInfo = {
  name: "Fyt Teknoloji Merkezi",
  domain: "www.fytteknolojimerkezi.com",
  slogan: "Teknolojide Tek Adres, Çözümde Tek Merkez",
  address: "1921 Sokak No: 4D Bayraklı / İzmir",
  phone: "05412991923",
  whatsapp: "905412991923",
  mapsLink: "https://maps.google.com/?q=1921+Sokak+No+4D+Bayraklı+İzmir",
  workingHours: "Pazartesi-Cumartesi 09:00-19:00",
};

export const services: ServiceItem[] = [
  {
    id: "alis-satis",
    title: "Telefon & Bilgisayar Alım-Satım",
    description: "Yeni ve ikinci el cihazlarda güvenli alım-satım hizmeti.",
    details: [
      "Sıfır ve ikinci el cihaz seçenekleri",
      "Takas ve değerinde alım",
      "Garanti ve teknik kontrol raporu",
    ],
  },
  {
    id: "teknik-servis",
    title: "Garantili Teknik Servis & Tamir",
    description: "Telefon, tablet, bilgisayar ve laptop için uzman servis.",
    details: [
      "Ekran, batarya, anakart, şarj soketi onarımı",
      "Hızlı ön teşhis ve net fiyatlandırma",
      "Parça ve işçilikte garanti",
    ],
  },
  {
    id: "fatura",
    title: "Tüm Fatura Ödemeleri",
    description: "Elektrik, su, doğalgaz, internet, kredi kartı ve daha fazlası.",
    details: [
      "Resmi kurum ve özel kurum ödemeleri",
      "Anlık işlem onayı",
      "Güvenli ödeme altyapısı",
    ],
  },
  {
    id: "baski",
    title: "Baskı & Fotokopi",
    description: "Fotokopi, tarama, tez-ödev, renkli/siyah baskı.",
    details: [
      "Dosya yükleme ile online sipariş",
      "Adet bazlı otomatik fiyat hesaplama",
      "Kurumsal toplu baskı çözümleri",
    ],
  },
  {
    id: "aksesuar",
    title: "Aksesuar Satışı",
    description: "Kılıf, ekran koruyucu, şarj aleti, kulaklık ve daha fazlası.",
    details: [
      "Geniş ürün yelpazesi",
      "Orijinal ve premium alternatifler",
      "Model uyumluluk desteği",
    ],
  },
  {
    id: "web-yazilim",
    title: "Web Sitesi Tasarımı & Yazılım",
    description: "Kurumsal web sitesi, özel yazılım ve proje geliştirme.",
    details: [
      "SEO uyumlu hızlı siteler",
      "Yönetim paneli ve entegrasyonlar",
      "Bakım ve güncelleme hizmeti",
    ],
  },
  {
    id: "mobil",
    title: "Android & iOS Mobil Uygulama",
    description: "İş odaklı native ve cross-platform mobil uygulamalar.",
    details: [
      "UI/UX odaklı ürün geliştirme",
      "Panel ve API bağlantıları",
      "Yayınlama ve sürüm yönetimi",
    ],
  },
  {
    id: "ozel-proje",
    title: "Özel Yazılım & Proje Geliştirme",
    description: "İşletmeye özel süreç otomasyonu ve proje geliştirme.",
    details: [
      "İhtiyaç analizi ve planlama",
      "Ölçeklenebilir mimari",
      "Eğitim ve teknik destek",
    ],
  },
];

export const products: ProductItem[] = [
  { id: "p1", name: "iPhone 13 128GB", category: "Telefon", condition: "İkinci El", price: 24999, popular: true },
  { id: "p2", name: "Samsung Galaxy A55", category: "Telefon", condition: "Yeni", price: 17999, popular: true },
  { id: "p3", name: "Lenovo ThinkPad T14", category: "Bilgisayar", condition: "İkinci El", price: 22999, popular: true },
  { id: "p4", name: "HP Victus 15", category: "Bilgisayar", condition: "Yeni", price: 33999 },
  { id: "p5", name: "AirPods Pro Uyumlu Kulaklık", category: "Aksesuar", condition: "Yeni", price: 1199, popular: true },
  { id: "p6", name: "Type-C Hızlı Şarj Seti", category: "Aksesuar", condition: "Yeni", price: 649 },
  { id: "p7", name: "iPad 9. Nesil", category: "Tablet", condition: "İkinci El", price: 9999 },
  { id: "p8", name: "Samsung Tab S9 FE", category: "Tablet", condition: "Yeni", price: 15499 },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Selin K.",
    rating: 5,
    comment: "Telefon ekran değişimi hızlı ve garantili yapıldı, çok memnun kaldım.",
  },
  {
    id: "t2",
    name: "Mert A.",
    rating: 5,
    comment: "Fatura ödeme ve baskı hizmetlerini sürekli kullanıyorum, ekip çok ilgili.",
  },
  {
    id: "t3",
    name: "Onur T.",
    rating: 5,
    comment: "İşletmem için web sitesi ve mobil uygulama sürecini profesyonel yönettiniz.",
  },
];

export const whyUs = [
  "Telefon numarası ile tek müşteri kaydı ve hızlı geçmiş erişimi",
  "Garantili teknik servis ve şeffaf süreç takibi",
  "Tek noktada ürün, servis, fatura ve yazılım hizmetleri",
  "Gerçek zamanlı randevu ve arıza durum güncellemeleri",
];

export const billTypes = [
  "Elektrik",
  "Su",
  "Doğalgaz",
  "Vergi",
  "SGK",
  "İnternet",
  "Kredi Kartı",
  "Diğer",
];
