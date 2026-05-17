import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

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

export function getAllPosts(): Post[] {
  // Klasör yoksa boş dizi döndür
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(postsDirectory);
  
  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || "Başlıksız",
      date: data.date || new Date().toISOString().split("T")[0],
      author: data.author || "Naz İçen",
      category: data.category || "Genel",
      summary: data.summary || content.slice(0, 150) + "...",
      coverImage: data.coverImage || "/images/placeholder.jpg",
      content,
    };
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || "Başlıksız",
      date: data.date || new Date().toISOString().split("T")[0],
      author: data.author || "Naz İçen",
      category: data.category || "Genel",
      summary: data.summary || content.slice(0, 150) + "...",
      coverImage: data.coverImage || "/images/placeholder.jpg",
      content,
    };
  } catch {
    return null;
  }
}