import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Project {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  icon: string;
  tech: string[];
  link: string | null;
  featured: boolean;
  images?: string[];
  github?: string;
  demo?: string;
}

const dataPath = path.join(process.cwd(), "data/projects.json");

function readProjects(): Project[] {
  if (!fs.existsSync(dataPath)) {
    return [];
  }
  const data = fs.readFileSync(dataPath, "utf8");
  return JSON.parse(data);
}

function writeProjects(projects: Project[]): void {
  fs.writeFileSync(dataPath, JSON.stringify(projects, null, 2), "utf8");
}

// GET - Tüm projeleri veya tek projeyi al
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const projects = readProjects();
  
  if (id) {
    const project = projects.find(p => p.id === id);
    return NextResponse.json({ project: project || null });
  }
  
  return NextResponse.json({ projects });
}

// POST - Yeni proje ekle veya güncelle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const projects = readProjects();
    
    if (body.id) {
      const index = projects.findIndex((p: Project) => p.id === body.id);
      if (index !== -1) {
        projects[index] = { ...projects[index], ...body };
      } else {
        projects.push(body);
      }
    } else {
      const newId = body.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
      projects.push({ ...body, id: newId });
    }
    
    writeProjects(projects);
    return NextResponse.json({ success: true, projects });
  } catch {
    return NextResponse.json({ error: "Proje kaydedilemedi" }, { status: 500 });
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
    
    const projects = readProjects();
    const filtered = projects.filter((p: Project) => p.id !== id);
    writeProjects(filtered);
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Proje silinemedi" }, { status: 500 });
  }
}