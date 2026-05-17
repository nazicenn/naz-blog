import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { slug, title, content, category, summary, author } = await request.json();
    const supabase = await createClient();
    
    // Admin kontrolü
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email !== "nazfc7@gmail.com") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }
    
    const { error } = await supabase
      .from("blog_posts")
      .insert({ slug, title, content, category, summary, author });
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Yazı oluşturulamadı";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}