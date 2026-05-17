import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { getAllPosts } from "@/lib/posts";

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      
      <main style={{ flex: 1, paddingTop: "120px", paddingBottom: "80px" }}>
        <div className="container">
          <h1 style={{ fontSize: "48px", marginBottom: "16px" }}>Blog</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "48px" }}>
            Yazılım geliştirme, oyun tasarımı ve araç geliştirme üzerine yazılar.
          </p>

          {posts.length === 0 ? (
            <p>Henüz blog yazısı yok. İlk yazı yakında gelecek!</p>
          ) : (
            <div className="projects__grid">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}