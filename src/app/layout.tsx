import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { LiveChat } from "@/components/live-chat";
import { Navbar } from "@/components/navbar";
import { PwaRegister } from "@/components/pwa-register";
import { TechBackground } from "@/components/tech-background";
import { WhatsappFloat } from "@/components/whatsapp-float";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["500", "600", "700", "800"],
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.fytteknolojimerkezi.com"),
  title: {
    default: "Fyt Teknoloji Merkezi | Teknolojide Tek Adres",
    template: "%s | Fyt Teknoloji Merkezi",
  },
  description:
    "Fyt Teknoloji Merkezi: teknik servis, ürün satış, fatura ödeme, baskı-fotokopi, yazılım geliştirme ve mobil uygulama hizmetleri.",
  keywords: [
    "Fyt Teknoloji Merkezi",
    "Bayraklı teknik servis",
    "telefon tamiri",
    "bilgisayar servisi",
    "fatura ödeme merkezi",
    "web tasarım izmir",
  ],
  openGraph: {
    title: "Fyt Teknoloji Merkezi",
    description:
      "Telefon, bilgisayar, teknik servis, yazılım geliştirme ve daha fazlası tek merkezde.",
    url: "https://www.fytteknolojimerkezi.com",
    siteName: "Fyt Teknoloji Merkezi",
    locale: "tr_TR",
    type: "website",
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${poppins.variable} ${roboto.variable} antialiased`}>
        <TechBackground />
        <Navbar />
        {children}
        <Footer />
        <WhatsappFloat />
        <LiveChat />
        <PwaRegister />
      </body>
    </html>
  );
}
