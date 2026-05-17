import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToolbox, faGamepad, faPalette } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import projectsData from "@/data/projects.json";

interface Project {
  id: string;
  title: string;
  description: string;
  icon: string;
  tech: string[];
  link: string | null;
  featured: boolean;
}

const iconMap: Record<string, IconDefinition> = {
  faToolbox: faToolbox,
  faGamepad: faGamepad,
  faPalette: faPalette,
};

export default async function Home() {
  const projects = projectsData as Project[];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      
      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="hero__content">
              <div className="hero__badge">
                Oyun Geliştirici & 1. Sınıf Öğrencisi
              </div>
              <h1 className="hero__title">
                Merhaba, Ben <span className="hero__title-highlight">Naz İçen</span>
                <br />
                Fark  
                <span className="hero__title-highlight"> yaratmak için</span> çalışıyorum
              </h1>
              <p className="hero__subtitle">
                Unity ve Blender ile oyun projeleri üretiyorum.
                Yazılım dünyasında kolaylık sağlayacak işler yapıyorum.
              </p>
              <div className="btn-group">
                <Link href="/blog" className="btn btn--primary">
                  Bloguma Git
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="skills">
          <div className="container">
            <h2 className="section__title">
              <span>Teknolojiler</span> ve İlgi Alanlarım
            </h2>
            <div className="skills__grid">
              {["C# & .NET", "Unity", "Blender", "Figma", "UI/UX"].map((skill) => (
                <span key={skill} className="skills__item">{skill}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projeler" className="projects">
          <div className="container">
            <h2 className="section__title">
              <span>Projelerim</span>
            </h2>
            <div className="projects__grid">
              {projects.map((project: Project) => (
                <div key={project.id} className="card">
                  <div className="card__icon">
                    <FontAwesomeIcon icon={iconMap[project.icon] || faToolbox} className="card-icon" />
                  </div>
                  <h3 className="card__title">{project.title}</h3>
                  <p className="card__description">{project.description}</p>
                  <div className="card__tech">
                    {project.tech.map((t: string) => (
                      <span key={t} className="card__tech-item">{t}</span>
                    ))}
                  </div>
                  {project.link ? (
                    <Link href={project.link} className="card__link">
                      Detaylar →
                    </Link>
                  ) : (
                    <span className="card__link" style={{ opacity: 0.5, cursor: "default" }}>
                      Yakında →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}