import Link from "next/link";
import { Post } from "@/lib/posts";

interface BlogCardProps {
  post: Post;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <div className="card" style={{ display: "block" }}>
      <h3 className="card__title" style={{ marginBottom: "12px" }}>
        {post.title}
      </h3>
      <div style={{ display: "flex", gap: "12px", marginBottom: "12px", fontSize: "12px", color: "var(--text-muted)" }}>
        <span>{post.date}</span>
        <span>•</span>
        <span>{post.author}</span>
        <span>•</span>
        <span style={{ color: "var(--accent-primary)" }}>{post.category}</span>
      </div>
      <p className="card__description">{post.summary}</p>
      <Link href={`/blog/${post.slug}`} className="card__link" style={{ marginTop: "16px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
        Devamını Oku →
      </Link>
    </div>
  );
}