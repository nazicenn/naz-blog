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
  slug: "typescript-ile-modern-web-gelistirme",
  title: "TypeScript ile Modern Web Geliştirme",
  date: "2026-05-17",
  author: "Naz İçen",
  category: "Yazılım",
  summary:
    "TypeScript ile daha güvenli, ölçeklenebilir ve sürdürülebilir web uygulamaları geliştirmeyi öğrenin.",
  coverImage: "/images/typescript-modern-web.jpg",
  content: `# TypeScript ile Modern Web Geliştirme

Web geliştirme dünyasında projeler büyüdükçe kod yönetimi zorlaşır. 
İşte tam bu noktada TypeScript devreye giriyor. TypeScript, JavaScript'in üzerine inşa edilmiş güçlü bir dil olup statik tip desteği sayesinde daha güvenilir uygulamalar geliştirmenizi sağlar.

## TypeScript Nedir?

TypeScript, Microsoft tarafından geliştirilen açık kaynaklı bir programlama dilidir. JavaScript'in tüm özelliklerini destekler ve buna ek olarak:

- Statik tip sistemi
- Gelişmiş IDE desteği
- Daha güvenli refactoring
- Daha okunabilir kod yapısı

gibi avantajlar sunar.

## Neden TypeScript Kullanmalıyız?

Modern frontend frameworkleri artık büyük ölçüde TypeScript ile kullanılmaktadır. Özellikle React, Next.js ve Node.js projelerinde TypeScript kullanımı ciddi avantaj sağlar.

### Avantajları

- **Tip Güvenliği**  
  Hataları uygulama çalışmadan önce yakalayabilirsiniz.

- **Daha İyi Kod Kalitesi**  
  Kodun okunabilirliği ve sürdürülebilirliği artar.

- **IDE Desteği**  
  Otomatik tamamlama, hata analizi ve refactoring özellikleri geliştirici deneyimini güçlendirir.

- **Büyük Projelerde Kolay Yönetim**  
  Takım çalışmalarında kod karmaşasını azaltır.

## Temel TypeScript Tipleri

TypeScript'in en önemli özelliklerinden biri tip sistemidir.

\`\`\`typescript
let username: string = "Naz";
let age: number = 19;
let isDeveloper: boolean = true;

let technologies: string[] = [
  "React",
  "Next.js",
  "TypeScript"
];
\`\`\`

## Interface Kullanımı

Interface yapıları sayesinde objelerin şemasını belirleyebilirsiniz.

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  isAdmin?: boolean;
}

const user: User = {
  id: 1,
  name: "Naz İçen",
  email: "naz@example.com",
};
\`\`\`

## React ile TypeScript Kullanımı

React projelerinde TypeScript kullanımı component yapısını daha güvenli hale getirir.

\`\`\`tsx
type ButtonProps = {
  title: string;
  onClick: () => void;
};

export default function Button({
  title,
  onClick,
}: ButtonProps) {
  return (
    <button onClick={onClick}>
      {title}
    </button>
  );
}
\`\`\`

## Next.js ve TypeScript

Next.js projelerinde TypeScript varsayılan olarak desteklenir. Yeni bir proje oluştururken sadece şu komutu kullanmanız yeterlidir:

\`\`\`bash
npx create-next-app@latest my-app --typescript
\`\`\`

Bu sayede ölçeklenebilir ve profesyonel bir proje yapısı elde edebilirsiniz.

## TypeScript Öğrenmeye Nereden Başlanmalı?

Başlangıç için şu konular öğrenilebilir:

1. Temel tipler
2. Interface & Type kullanımı
3. Generic yapılar
4. Async/Await
5. React + TypeScript
6. API tip yönetimi

## Sonuç

TypeScript, modern web geliştirme süreçlerinde artık bir lüks değil, gereklilik haline gelmeye başladı. Özellikle büyük projelerde hata oranını azaltması ve geliştirici deneyimini artırması sayesinde günümüzde en popüler teknolojilerden biri haline geldi.

Eğer React veya Next.js geliştiriyorsanız, TypeScript öğrenmek size büyük avantaj sağlayacaktır.
`,
}
// Tüm yazıları döndürür (build zamanı cache'lenir)
export const getAllPosts = cache((): Post[] => {
  // Tarihe göre sırala (en yeniden en eskiye)
  return [...BLOG_POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

// Belli bir slug'a göre yazıyı döndürür
export const getPostBySlug = cache((slug: string): Post | null => {
  return getAllPosts().find((post) => post.slug === slug) || null;
});
