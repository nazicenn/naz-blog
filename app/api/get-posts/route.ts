import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface BlogPost {
  slug: string;
  title: string;
  created_at: string;
  category: string;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    
    const posts = (data || []).map((post: BlogPost) => ({
      slug: post.slug,
      title: post.title,
      date: new Date(post.created_at).toISOString().split('T')[0],
      category: post.category,
    }));
    
    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json({ posts: [] });
  }
}