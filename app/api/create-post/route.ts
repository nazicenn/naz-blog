import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { slug, markdown } = await request.json();
    
    const postsDirectory = path.join(process.cwd(), "content/posts");
    
    // Klasör yoksa oluştur
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
    }
    
    const filePath = path.join(postsDirectory, `${slug}.md`);
    
    // Dosya zaten varsa
    if (fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Bu başlıkla zaten bir yazı var!" }, { status: 400 });
    }
    
    fs.writeFileSync(filePath, markdown, "utf8");
    
    return NextResponse.json({ success: true });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return NextResponse.json({ error: "Dosya kaydedilemedi" }, { status: 500 });
  }
}