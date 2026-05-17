// lib/posts.ts
import { cache } from 'react';

export interface Post {
  slug: string;
  title: string;
  date: string;
  author: string;
  category: string;
  summary: string;
  coverImage: string;
  content: string;
}

// 📌 Blog yazılarını burada doğrudan tanımlıyoruz (JSON dosyası yok!)
const BLOG_POSTS: Post[] = [
  {
    slug: "merhaba-dunya",
    title: "Merhaba Dünya",
    date: "2026-05-17",
    author: "Naz İçen",
    category: "Kişisel",
    summary: "İlk blog yazıma hoş geldiniz.",
    coverImage: "/images/placeholder.jpg",
    content: `# Merhaba Dünya!

Bu benim ilk blog yazım. Bu blogda yazılım geliştirme, oyun tasarımı ve araç geliştirme üzerine yazılar paylaşacağım.

## Neler bulacaksın?

*   C# ipuçları
*   Unity ile oyun geliştirme
*   Blender ile 3D modelleme

Takipte kal!`,
  },
  {
    slug: "typescript-ile-web-gelistirme",
    title: "TypeScript ile Modern Web Geliştirme",
    date: "2026-05-17",
    author: "Naz İçen",
    category: "Yazılım",
    summary: "TypeScript'in web geliştirmedeki önemini ve temel kullanım alanlarını keşfedin.",
    coverImage: "/images/placeholder.jpg",
    content: `# TypeScript ile Modern Web Geliştirme

TypeScript, JavaScript'in tip güvenli bir süper setidir.

## Neden TypeScript?

- **Tip Güvenliği**: Hataları geliştirme aşamasında yakalayın.
- **IDE Desteği**: Otomatik tamamlama ve refactoring.

## Temel Tipler

\`\`\`typescript
let isActive: boolean = true;
let skills: string[] = ["React", "Next.js"];
interface User { name: string; }
\`\`\`

TypeScript ile daha sağlam kodlar yazabilirsiniz!`,
  }
];

// Tüm yazıları döndürür (build zamanı cache'lenir)
export const getAllPosts = cache((): Post[] => {
  // Tarihe göre sırala (en yeniden en eskiye)
  return [...BLOG_POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

// Belli bir slug'a göre yazıyı döndürür
export const getPostBySlug = cache((slug: string): Post | null => {
  return getAllPosts().find((post) => post.slug === slug) || null;
});