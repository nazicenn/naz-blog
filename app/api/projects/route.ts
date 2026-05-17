import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET - Tüm projeleri veya tek projeyi al
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const supabase = await createClient();
    
    if (id) {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return NextResponse.json({ project: data || null });
    }
    
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return NextResponse.json({ projects: data || [] });
  } catch {
    return NextResponse.json({ projects: [] });
  }
}

// POST - Yeni proje ekle veya güncelle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    
    // Admin kontrolü
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email !== "nazfc7@gmail.com") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }
    
    if (body.id) {
      // Güncelleme
      const { error } = await supabase
        .from("projects")
        .update({
          title: body.title,
          description: body.description,
          detailed_description: body.detailedDescription,
          icon: body.icon,
          tech: body.tech,
          link: body.link,
          featured: body.featured,
          github: body.github,
          demo: body.demo,
          updated_at: new Date().toISOString()
        })
        .eq("id", body.id);
      
      if (error) throw error;
    } else {
      // Yeni proje
      const newId = body.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const { error } = await supabase
        .from("projects")
        .insert({
          id: newId,
          title: body.title,
          description: body.description,
          detailed_description: body.detailedDescription,
          icon: body.icon,
          tech: body.tech,
          link: body.link,
          featured: body.featured,
          github: body.github,
          demo: body.demo
        });
      
      if (error) throw error;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Proje kaydedilemedi";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE - Proje sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }
    
    const supabase = await createClient();
    
    // Admin kontrolü
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email !== "nazfc7@gmail.com") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }
    
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Proje silinemedi";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}