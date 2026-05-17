import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToolbox, faGamepad, faPalette, faExternalLinkAlt, faCode } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

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
  created_at?: string;
}

const iconMap: Record<string, IconDefinition> = {
  faToolbox: faToolbox,
  faGamepad: faGamepad,
  faPalette: faPalette,
};

async function getProject(id: string): Promise<Project | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/projects?id=${id}`, {
      cache: 'no-store'
    });
    const data = await res.json();
    return data.project;
  } catch {
    return null;
  }
}

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProject(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      
      <main style={{ flex: 1, paddingTop: "120px", paddingBottom: "80px" }}>
        <div className="container">
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            
            {/* Geri Butonu */}
            <Link href="/#projeler" style={{ color: "var(--accent-primary)", marginBottom: "32px", display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
              ← Projelere Dön
            </Link>

            {/* Icon ve Başlık */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ 
                width: "80px", 
                height: "80px", 
                background: "linear-gradient(135deg, var(--accent-primary), var(--accent-primary-dark))",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: "40px"
              }}>
                <FontAwesomeIcon icon={iconMap[project.icon] || faToolbox} style={{ color: "#000" }} />
              </div>
              <h1 style={{ fontSize: "48px", marginBottom: "16px" }}>{project.title}</h1>
            </div>

            {/* Teknolojiler */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "32px" }}>
              {project.tech.map((tech) => (
                <span key={tech} className="skills__item" style={{ background: "rgba(45,212,191,0.1)", color: "var(--accent-primary)" }}>
                  <FontAwesomeIcon icon={faCode} style={{ marginRight: "6px", fontSize: "10px" }} />
                  {tech}
                </span>
              ))}
            </div>

            {/* Açıklama */}
            <div style={{ 
              background: "var(--bg-card)", 
              padding: "32px", 
              borderRadius: "24px", 
              marginBottom: "32px",
              border: "1px solid var(--border-light)"
            }}>
              <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>Proje Hakkında</h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: "1.8", marginBottom: "24px" }}>
                {project.detailedDescription || project.description}
              </p>
            </div>

            {/* Linkler */}
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn--secondary" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  <FontAwesomeIcon icon={faGithub} /> GitHub
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn btn--primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  <FontAwesomeIcon icon={faExternalLinkAlt} /> Canlı Demo
                </a>
              )}
              {project.link && !project.demo && (
                <Link href={project.link} className="btn btn--primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  <FontAwesomeIcon icon={faExternalLinkAlt} /> Projeye Git
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}