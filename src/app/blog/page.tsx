import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Teknik servis, alım-satım ve yazılım hakkında SEO odaklı bilgilendirici içerikler.",
};

export default function BlogPage() {
  return (
    <main className="container-app section-space">
      <h1 className="section-title">Blog</h1>
      <p className="section-subtitle">Sektörel ipuçları, teknik bilgiler ve dijital dönüşüm içerikleri.</p>

      <div className="mt-6 space-y-3">
        {blogPosts.map((post) => (
          <article key={post.slug} className="glass-card p-5">
            <p className="text-xs text-muted">{new Date(post.date).toLocaleDateString("tr-TR")} • {post.category}</p>
            <h2 className="mt-1 text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="mt-3 inline-flex text-sm font-semibold text-accent">
              Yazıyı Oku
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
