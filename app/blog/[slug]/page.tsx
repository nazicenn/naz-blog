import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import Comments from "@/components/Comments";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      
      <main style={{ flex: 1, paddingTop: "120px", paddingBottom: "80px" }}>
        <div className="container">
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            {/* Geri Butonu - ARTIK BUTON OLARAK */}
            <Link 
              href="/blog" 
              className="btn btn--secondary"
              style={{ 
                marginBottom: "32px", 
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                padding: "8px 20px"
              }}
            >
              ← Blog a Dön
            </Link>

            {/* Kategori Badge */}
            <div style={{ marginBottom: "16px" }}>
              <span style={{ 
                background: "rgba(45,212,191,0.1)", 
                color: "var(--accent-primary)",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "500"
              }}>
                {post.category}
              </span>
            </div>

            {/* Başlık */}
            <h1 style={{ 
              fontSize: "clamp(32px, 5vw, 48px)", 
              fontWeight: "700",
              marginBottom: "24px",
              lineHeight: "1.2"
            }}>
              {post.title}
            </h1>

            {/* Meta Bilgiler */}
            <div style={{ 
              display: "flex", 
              flexWrap: "wrap",
              gap: "20px", 
              marginBottom: "48px", 
              color: "var(--text-muted)", 
              fontSize: "14px",
              borderBottom: "1px solid var(--border-light)",
              paddingBottom: "24px"
            }}>
              <span> {post.author}</span>
            </div>

            {/* İçerik */}
            <div className="blog-content">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            {/* Yorumlar */}
            <Comments postSlug={slug} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}