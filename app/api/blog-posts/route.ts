import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  author: string;
  date: string;
  coverImage: string;
}

const postsPath = path.join(process.cwd(), "data/blog-posts.json");

function readPosts(): BlogPost[] {
  if (!fs.existsSync(postsPath)) {
    return [];
  }
  const data = fs.readFileSync(postsPath, "utf8");
  return JSON.parse(data);
}

function writePosts(posts: BlogPost[]): void {
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), "utf8");
}

// GET - Tüm yazıları al
export async function GET() {
  const posts = readPosts();
  return NextResponse.json({ posts });
}

// POST - Yeni yazı ekle
export async function POST(request: NextRequest) {
  try {
    const newPost: BlogPost = await request.json();
    const posts = readPosts();
    posts.push(newPost);
    writePosts(posts);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Yazı eklenemedi" }, { status: 500 });
  }
}

// DELETE - Yazı sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const posts = readPosts();
    const filtered = posts.filter((p: BlogPost) => p.slug !== slug);
    writePosts(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Yazı silinemedi" }, { status: 500 });
  }
}