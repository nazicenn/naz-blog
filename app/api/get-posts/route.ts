import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function GET() {
  try {
    const postsDirectory = path.join(process.cwd(), "content/posts");
    
    if (!fs.existsSync(postsDirectory)) {
      return NextResponse.json({ posts: [] });
    }
    
    const fileNames = fs.readdirSync(postsDirectory);
    const posts = fileNames.map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      
      return {
        slug,
        title: data.title || "Başlıksız",
        date: data.date || new Date().toISOString().split('T')[0],
        category: data.category || "Genel",
      };
    });
    
    return NextResponse.json({ posts: posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return NextResponse.json({ posts: [] });
  }
}