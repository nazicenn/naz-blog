"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faComment, faTrash, faUsers, faEye, faThumbsUp, faLock, 
  faPlus, faEdit, faFileAlt, faProjectDiagram,
} from "@fortawesome/free-solid-svg-icons";

interface AdminComment {
  id: string;
  slug: string;
  user_name: string;
  content: string;
  likes: number;
  is_approved: boolean;
  created_at: string;
}

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  icon: string;
  tech: string[];
  link: string | null;
  featured: boolean;
  github?: string;
  demo?: string;
  created_at?: string;
}

const ADMIN_EMAILS = ["nazfc7@gmail.com"];

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Blog state'leri
  const [showPostForm, setShowPostForm] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState("Genel");
  const [postSummary, setPostSummary] = useState("");
  const [savingPost, setSavingPost] = useState(false);
  
  // Proje state'leri
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectDetailedDesc, setProjectDetailedDesc] = useState("");
  const [projectIcon, setProjectIcon] = useState("faToolbox");
  const [projectTech, setProjectTech] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [projectFeatured, setProjectFeatured] = useState(false);
  const [projectGithub, setProjectGithub] = useState("");
  const [projectDemo, setProjectDemo] = useState("");
  const [projectCreatedAt, setProjectCreatedAt] = useState("");
  const [savingProject, setSavingProject] = useState(false);
  
  const [stats, setStats] = useState({ totalComments: 0, pendingComments: 0, totalUsers: 0, totalLikes: 0 });

  const supabase = createClient();
  const categories = ["Kişisel", "Teknoloji", "Yazılım", "Oyun Geliştirme", "3D Tasarım", "Genel"];
  
  const iconOptions = [
    { value: "faToolbox", label: "🛠️ Toolbox" },
    { value: "faGamepad", label: "🎮 Gamepad" },
    { value: "faPalette", label: "🎨 Palette" },
  ];

  // Blog yazılarını getir
const fetchBlogPosts = async () => {
  try {
    const response = await fetch('/api/blog-posts');
    const data = await response.json();
    setBlogPosts(data.posts || []);
  } catch (error) {
    console.error("Blog yazıları yüklenemedi:", error);
  }
};

  // Projeleri getir
  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error("Projeler yüklenemedi:", error);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    
    const { data: commentsData } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (commentsData) {
      setComments(commentsData);
      
      setStats({
        totalComments: commentsData.length,
        pendingComments: commentsData.filter(c => !c.is_approved).length,
        totalUsers: [...new Set(commentsData.map(c => c.user_id))].length,
        totalLikes: commentsData.reduce((sum, c) => sum + (c.likes || 0), 0),
      });
    }
    
    await fetchBlogPosts();
    await fetchProjects();
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }
      
      const userEmail = user.email || "";
      const hasAccess = ADMIN_EMAILS.includes(userEmail);
      
      if (!hasAccess) {
        router.push("/");
        return;
      }
      
      setUser(user);
      setIsAdmin(true);
      fetchData();
    };
    
    checkAdmin();
  }, [router, supabase.auth, fetchData]);

  const deleteComment = async (commentId: string) => {
    if (!confirm("Bu yorumu silmek istediğine emin misin?")) return;
    
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);
    
    if (!error) {
      fetchData();
    } else {
      alert("Silme hatası: " + error.message);
    }
  };

const deleteBlogPost = async (slug: string, title: string) => {
  if (!confirm(`"${title}" yazısını silmek istediğine emin misin?`)) return;
  
  try {
    const response = await fetch(`/api/blog-posts?slug=${slug}`, { method: 'DELETE' });
    if (response.ok) {
      alert("Blog yazısı başarıyla silindi!");
      await fetchBlogPosts();
    } else {
      alert("Silme işlemi başarısız oldu.");
    }
  } catch (error) {
    alert("Hata: " + error);
  }
};

// Blog yazısı oluştur (JSON tabanlı)
const createBlogPost = async () => {
  if (!postTitle.trim() || !postContent.trim()) {
    alert("Başlık ve içerik zorunludur!");
    return;
  }

  setSavingPost(true);
  
  const slug = postTitle
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const summary = postSummary || postContent.slice(0, 150) + "...";
  const date = new Date().toISOString().split('T')[0];
  const author = user?.user_metadata?.username || user?.email?.split('@')[0] || "Admin";

  const newPost = {
    id: Date.now().toString(),
    slug,
    title: postTitle,
    content: postContent,
    summary,
    category: postCategory,
    author,
    date,
    coverImage: "/images/placeholder.jpg"
  };

  try {
    const response = await fetch('/api/blog-posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    });

    if (response.ok) {
      alert("Blog yazısı başarıyla oluşturuldu!");
      setPostTitle("");
      setPostContent("");
      setPostSummary("");
      setShowPostForm(false);
      await fetchBlogPosts();
    } else {
      alert("Yazı oluşturulurken bir hata oluştu.");
    }
  } catch (error) {
    alert("Hata: " + error);
  }
  setSavingPost(false);
};
  // Proje kaydet
  const saveProject = async () => {
    if (!projectTitle.trim() || !projectDescription.trim()) {
      alert("Başlık ve açıklama zorunludur!");
      return;
    }

    setSavingProject(true);
    
    const techArray = projectTech.split(',').map(t => t.trim()).filter(t => t);
    
    const projectData = {
      id: editingProject?.id,
      title: projectTitle,
      description: projectDescription,
      detailedDescription: projectDetailedDesc || null,
      icon: projectIcon,
      tech: techArray,
      link: projectLink || null,
      featured: projectFeatured,
      github: projectGithub || null,
      demo: projectDemo || null,
      created_at: projectCreatedAt || new Date().toISOString().split('T')[0]
    };
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      
      if (response.ok) {
        alert(editingProject ? "Proje güncellendi!" : "Proje eklendi!");
        resetProjectForm();
        await fetchProjects();
      } else {
        alert("Kayıt başarısız!");
      }
    } catch (error) {
      alert("Hata: " + error);
    }
    setSavingProject(false);
  };

  // Proje sil
  const deleteProject = async (id: string, title: string) => {
    if (!confirm(`"${title}" projesini silmek istediğine emin misin?`)) return;
    
    try {
      const response = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert("Proje silindi!");
        await fetchProjects();
      } else {
        alert("Silme başarısız!");
      }
    } catch (error) {
      alert("Hata: " + error);
    }
  };

  // Proje düzenlemeyi başlat
  const startEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectTitle(project.title);
    setProjectDescription(project.description);
    setProjectDetailedDesc(project.detailedDescription || "");
    setProjectIcon(project.icon);
    setProjectTech(project.tech.join(', '));
    setProjectLink(project.link || "");
    setProjectFeatured(project.featured || false);
    setProjectGithub(project.github || "");
    setProjectDemo(project.demo || "");
    setProjectCreatedAt(project.created_at || "");
    setShowProjectForm(true);
  };

  // Formu sıfırla
  const resetProjectForm = () => {
    setEditingProject(null);
    setProjectTitle("");
    setProjectDescription("");
    setProjectDetailedDesc("");
    setProjectIcon("faToolbox");
    setProjectTech("");
    setProjectLink("");
    setProjectFeatured(false);
    setProjectGithub("");
    setProjectDemo("");
    setProjectCreatedAt("");
    setShowProjectForm(false);
  };

  const containsBadWord = (text: string) => {
    const badWords = ["küfür", "salak", "aptal", "mala", "gerizekalı", "siktir", "amk", "mk", "piç", "orospu", "kahpe"];
    return badWords.some(word => text.toLowerCase().includes(word));
  };

  if (!isAdmin && !loading) {
    return (
      <>
        <Navbar />
        <main style={{ flex: 1, paddingTop: "120px", paddingBottom: "80px" }}>
          <div className="container">
            <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--bg-card)", borderRadius: "24px" }}>
              <FontAwesomeIcon icon={faLock} style={{ fontSize: "64px", color: "var(--accent-primary)", marginBottom: "20px" }} />
              <h2 style={{ fontSize: "28px", marginBottom: "12px" }}>Erişim Engellendi</h2>
              <p style={{ color: "var(--text-secondary)" }}>Bu sayfaya erişim yetkiniz yok. Sadece admin kullanıcılar giriş yapabilir.</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", paddingTop: "100px" }}>
          <div className="loading__spinner"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      
      <main style={{ flex: 1, paddingTop: "120px", paddingBottom: "80px" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 style={{ fontSize: "36px", marginBottom: "8px" }}>Admin Panel</h1>
              <p style={{ color: "var(--text-secondary)" }}>Hoş geldin, {user?.email} | Tüm içeriği yönet.</p>
            </div>
          </div>

          {/* ========== PROJE YÖNETİMİ ========== */}
          <div style={{ marginBottom: "40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
              <h2 style={{ fontSize: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
                <FontAwesomeIcon icon={faProjectDiagram} /> Proje Yönetimi
              </h2>
              <button onClick={() => { resetProjectForm(); setShowProjectForm(!showProjectForm); }} className="btn btn--primary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FontAwesomeIcon icon={faPlus} /> {showProjectForm ? "Formu Kapat" : "Yeni Proje"}
              </button>
            </div>

            {showProjectForm && (
              <div style={{ background: "var(--bg-card)", padding: "24px", borderRadius: "24px", marginBottom: "24px", border: "1px solid var(--border-light)" }}>
                <h3 style={{ fontSize: "20px", marginBottom: "20px" }}>{editingProject ? "Projeyi Düzenle" : "Yeni Proje Ekle"}</h3>
                
                <div style={{ marginBottom: "16px" }}>
                  <label className="auth-label">Proje Başlığı *</label>
                  <input type="text" className="auth-input" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} />
                </div>
                
                <div style={{ marginBottom: "16px" }}>
                  <label className="auth-label">Kısa Açıklama (Kartta gösterilir) *</label>
                  <textarea className="auth-input" rows={2} value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} />
                </div>
                
                <div style={{ marginBottom: "16px" }}>
                  <label className="auth-label">Detaylı Açıklama (Proje sayfasında gösterilir)</label>
                  <textarea className="auth-input" rows={6} value={projectDetailedDesc} onChange={(e) => setProjectDetailedDesc(e.target.value)} placeholder="Projenin detaylı açıklaması..." />
                </div>
                
                <div style={{ marginBottom: "16px" }}>
                  <label className="auth-label">Icon</label>
                  <select className="auth-input" value={projectIcon} onChange={(e) => setProjectIcon(e.target.value)}>
                    {iconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                
                <div style={{ marginBottom: "16px" }}>
                  <label className="auth-label">Teknolojiler (virgülle ayır)</label>
                  <input type="text" className="auth-input" value={projectTech} onChange={(e) => setProjectTech(e.target.value)} placeholder="React, Next.js, TypeScript" />
                </div>
                
                <div style={{ marginBottom: "16px" }}>
                  <label className="auth-label">Proje Linki (opsiyonel)</label>
                  <input type="text" className="auth-input" value={projectLink} onChange={(e) => setProjectLink(e.target.value)} placeholder="/proje-linki" />
                </div>
                
                <div style={{ marginBottom: "16px" }}>
                  <label className="auth-label">GitHub Linki (opsiyonel)</label>
                  <input type="url" className="auth-input" value={projectGithub} onChange={(e) => setProjectGithub(e.target.value)} placeholder="https://github.com/kullanici/proje" />
                </div>
                
                <div style={{ marginBottom: "16px" }}>
                  <label className="auth-label">Demo / Canlı Link (opsiyonel)</label>
                  <input type="url" className="auth-input" value={projectDemo} onChange={(e) => setProjectDemo(e.target.value)} placeholder="https://proje-demo.com" />
                </div>
                
                <div style={{ marginBottom: "16px" }}>
                  <label className="auth-label">Oluşturulma Tarihi</label>
                  <input type="date" className="auth-input" value={projectCreatedAt} onChange={(e) => setProjectCreatedAt(e.target.value)} />
                </div>
                
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input type="checkbox" checked={projectFeatured} onChange={(e) => setProjectFeatured(e.target.checked)} />
                    Öne Çıkan Proje
                  </label>
                </div>
                
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                  <button onClick={resetProjectForm} className="btn btn--secondary">İptal</button>
                  <button onClick={saveProject} className="btn btn--primary" disabled={savingProject}>
                    {savingProject ? "Kaydediliyor..." : (editingProject ? "Güncelle" : "Ekle")}
                  </button>
                </div>
              </div>
            )}

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <th style={{ textAlign: "left", padding: "12px" }}>Başlık</th>
                    <th style={{ textAlign: "left", padding: "12px" }}>Teknolojiler</th>
                    <th style={{ textAlign: "center", padding: "12px" }}>Öne Çıkan</th>
                    <th style={{ textAlign: "center", padding: "12px" }}>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "12px", color: "var(--accent-primary)" }}>{project.title}</td>
                      <td style={{ padding: "12px" }}>{project.tech.join(', ')}</td>
                      <td style={{ textAlign: "center", padding: "12px" }}>{project.featured ? "✓" : "-"}</td>
                      <td style={{ textAlign: "center", padding: "12px" }}>
                        <button onClick={() => startEditProject(project)} style={{ background: "none", border: "none", color: "orange", cursor: "pointer", marginRight: "12px" }} title="Düzenle">
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button onClick={() => deleteProject(project.id, project.title)} style={{ background: "none", border: "none", color: "#ff4444", cursor: "pointer" }} title="Sil">
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {projects.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>Henüz proje yok.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========== BLOG YAZILARI ========== */}
          <div style={{ marginBottom: "40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
              <h2 style={{ fontSize: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
                <FontAwesomeIcon icon={faFileAlt} /> Blog Yazıları
              </h2>
              <button onClick={() => setShowPostForm(!showPostForm)} className="btn btn--primary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FontAwesomeIcon icon={faPlus} /> {showPostForm ? "Formu Kapat" : "Yeni Blog Yazısı"}
              </button>
            </div>

            {showPostForm && (
              <div style={{ background: "var(--bg-card)", padding: "24px", borderRadius: "24px", marginBottom: "24px", border: "1px solid var(--border-light)" }}>
                <h3 style={{ fontSize: "20px", marginBottom: "20px" }}>Yeni Blog Yazısı Oluştur</h3>
                <div style={{ marginBottom: "16px" }}>
                  <label className="auth-label">Başlık *</label>
                  <input type="text" className="auth-input" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label className="auth-label">Kategori</label>
                  <select className="auth-input" value={postCategory} onChange={(e) => setPostCategory(e.target.value)}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label className="auth-label">Özet (Opsiyonel)</label>
                  <textarea className="auth-input" rows={2} value={postSummary} onChange={(e) => setPostSummary(e.target.value)} />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label className="auth-label">İçerik (Markdown) *</label>
                  <textarea className="auth-input" rows={10} value={postContent} onChange={(e) => setPostContent(e.target.value)} placeholder="# Başlık\n\nİçerik buraya..." />
                </div>
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                  <button onClick={() => setShowPostForm(false)} className="btn btn--secondary">İptal</button>
                  <button onClick={createBlogPost} className="btn btn--primary" disabled={savingPost}>
                    {savingPost ? "Kaydediliyor..." : "Yayınla"}
                  </button>
                </div>
              </div>
            )}

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <th style={{ textAlign: "left", padding: "12px" }}>Başlık</th>
                    <th style={{ textAlign: "left", padding: "12px" }}>Kategori</th>
                    <th style={{ textAlign: "left", padding: "12px" }}>Tarih</th>
                    <th style={{ textAlign: "center", padding: "12px" }}>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {blogPosts.map((post) => (
                    <tr key={post.slug} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "12px", color: "var(--accent-primary)" }}>{post.title}</td>
                      <td style={{ padding: "12px" }}>{post.category}</td>
                      <td style={{ padding: "12px", fontSize: "12px", color: "var(--text-muted)" }}>{post.date}</td>
                      <td style={{ textAlign: "center", padding: "12px" }}>
                        <button onClick={() => deleteBlogPost(post.slug, post.title)} style={{ background: "none", border: "none", color: "#ff4444", cursor: "pointer" }} title="Sil">
                          <FontAwesomeIcon icon={faTrash} /> Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                  {blogPosts.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>Henüz blog yazısı yok.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========== İSTATİSTİK KARTLARI ========== */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px", marginBottom: "40px" }}>
            <div style={{ background: "var(--bg-card)", padding: "20px", borderRadius: "16px", textAlign: "center" }}>
              <FontAwesomeIcon icon={faComment} style={{ fontSize: "28px", color: "var(--accent-primary)", marginBottom: "8px" }} />
              <div style={{ fontSize: "28px", fontWeight: "bold" }}>{stats.totalComments}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Toplam Yorum</div>
            </div>
            <div style={{ background: "var(--bg-card)", padding: "20px", borderRadius: "16px", textAlign: "center" }}>
              <FontAwesomeIcon icon={faEye} style={{ fontSize: "28px", color: "orange", marginBottom: "8px" }} />
              <div style={{ fontSize: "28px", fontWeight: "bold" }}>{stats.pendingComments}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Onay Bekleyen</div>
            </div>
            <div style={{ background: "var(--bg-card)", padding: "20px", borderRadius: "16px", textAlign: "center" }}>
              <FontAwesomeIcon icon={faUsers} style={{ fontSize: "28px", color: "var(--accent-primary)", marginBottom: "8px" }} />
              <div style={{ fontSize: "28px", fontWeight: "bold" }}>{stats.totalUsers}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Yorum Yapanlar</div>
            </div>
            <div style={{ background: "var(--bg-card)", padding: "20px", borderRadius: "16px", textAlign: "center" }}>
              <FontAwesomeIcon icon={faThumbsUp} style={{ fontSize: "28px", color: "var(--accent-primary)", marginBottom: "8px" }} />
              <div style={{ fontSize: "28px", fontWeight: "bold" }}>{stats.totalLikes}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Toplam Beğeni</div>
            </div>
          </div>

          {/* ========== YORUMLAR TABLOSU ========== */}
          <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Yorumlar</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <th style={{ textAlign: "left", padding: "12px" }}>Kullanıcı</th>
                  <th style={{ textAlign: "left", padding: "12px" }}>Yorum</th>
                  <th style={{ textAlign: "left", padding: "12px" }}>Tarih</th>
                  <th style={{ textAlign: "center", padding: "12px" }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => {
                  const isBad = containsBadWord(comment.content);
                  return (
                    <tr key={comment.id} style={{ borderBottom: "1px solid var(--border-light)", background: isBad ? "rgba(255,0,0,0.1)" : "transparent" }}>
                      <td style={{ padding: "12px", color: "var(--accent-primary)" }}>{comment.user_name}</td>
                      <td style={{ padding: "12px", maxWidth: "400px" }}>
                        <div style={{ wordBreak: "break-word", whiteSpace: "pre-wrap", color: isBad ? "#ff6b6b" : "var(--text-secondary)" }}>
                          {comment.content}
                          {isBad && <span style={{ marginLeft: "8px", fontSize: "11px", background: "#ff4444", padding: "2px 6px", borderRadius: "4px", color: "white" }}>⚠️ Küfür tespit edildi</span>}
                        </div>
                      </td>
                      <td style={{ padding: "12px", fontSize: "12px", color: "var(--text-muted)" }}>{new Date(comment.created_at).toLocaleDateString("tr-TR")}</td>
                      <td style={{ textAlign: "center", padding: "12px" }}>
                        <button onClick={() => deleteComment(comment.id)} style={{ background: "none", border: "none", color: "#ff4444", cursor: "pointer" }} title="Sil">
                          <FontAwesomeIcon icon={faTrash} /> Sil
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {comments.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>Henüz yorum yok.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}