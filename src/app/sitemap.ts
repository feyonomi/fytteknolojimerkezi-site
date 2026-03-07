import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";

const baseUrl = "https://www.fytteknolojimerkezi.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/proje-plani",
    "/hizmetler",
    "/magaza",
    "/teknik-servis",
    "/randevu",
    "/musteri-paneli",
    "/admin",
    "/fatura-odeme",
    "/baski-fotokopi",
    "/yazilim-mobil",
    "/iletisim",
    "/blog",
  ];

  const pageEntries = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.75,
    lastModified: new Date(),
  }));

  const blogEntries = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    lastModified: new Date(post.date),
  }));

  return [...pageEntries, ...blogEntries];
}
