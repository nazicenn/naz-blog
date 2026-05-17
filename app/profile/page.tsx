/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faCalendar, faPen, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  // Karakter sınırları
  const MAX_USERNAME = 30;
  const MAX_FULLNAME = 50;
  const MAX_BIO = 200;

  const supabase = createClient();

  // Kullanıcı adı benzersizlik kontrolü
  const checkUsername = async (value: string, currentUserId: string) => {
    if (value === username) return true; // Aynı ise sorun yok
    
    if (value.length < 3) {
      setUsernameError("Kullanıcı adı en az 3 karakter olmalıdır.");
      return false;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameError("Sadece harf, rakam ve alt çizgi kullanabilirsiniz.");
      return false;
    }
    
    // profiles tablosunda kontrol et
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", value)
      .neq("id", currentUserId)
      .maybeSingle();
    
    if (existingProfile) {
      setUsernameError("Bu kullanıcı adı zaten alınmış.");
      return false;
    }
    
    setUsernameError("");
    return true;
  };

  const getUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setUser(user);
    setUsername(user.user_metadata?.username || user.email?.split("@")[0] || "");
    setFullName(user.user_metadata?.full_name || "");
    setBio(user.user_metadata?.bio || "");
    setLoading(false);
  }, [router, supabase.auth]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const handleSave = async () => {
    // Kullanıcı adı kontrolü
    const isUnique = await checkUsername(username, user?.id || "");
    if (!isUnique) return;
    
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: { username, full_name: fullName, bio }
    });
    
    if (!error) {
      // profiles tablosunu da güncelle
      await supabase
        .from("profiles")
        .upsert({ 
          id: user?.id, 
          username, 
          full_name: fullName, 
          bio,
          updated_at: new Date().toISOString()
        });
      
      setEditing(false);
      getUser();
    } else {
      alert("Kaydedilirken bir hata oluştu: " + error.message);
    }
    setSaving(false);
  };

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_USERNAME) {
      setUsername(value);
      if (user && value.length >= 3 && value !== user.user_metadata?.username) {
        await checkUsername(value, user.id);
      } else if (value.length < 3 && value.length > 0) {
        setUsernameError("Kullanıcı adı en az 3 karakter olmalıdır.");
      } else {
        setUsernameError("");
      }
    }
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_FULLNAME) setFullName(value);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_BIO) setBio(value);
  };

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

  if (!user) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      
      <main style={{ flex: 1, paddingTop: "120px", paddingBottom: "80px" }}>
        <div className="container">
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            
            <div style={{ 
              background: "var(--bg-card)", 
              borderRadius: "24px", 
              padding: "32px",
              border: "1px solid var(--border-light)",
              textAlign: "center"
            }}>
              
              {/* Avatar */}
              <div style={{ 
                width: "100px", 
                height: "100px", 
                background: "linear-gradient(135deg, var(--accent-primary), var(--accent-primary-dark))",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                fontSize: "48px"
              }}>
                <FontAwesomeIcon icon={faUser} style={{ color: "#000" }} />
              </div>

              {/* Düzenleme Modu */}
              {editing ? (
                <div style={{ textAlign: "left" }}>
                  {/* Kullanıcı Adı */}
                  <div style={{ marginBottom: "20px" }}>
                    <label className="auth-label">Kullanıcı Adı</label>
                    <input
                      type="text"
                      className="auth-input"
                      value={username}
                      onChange={handleUsernameChange}
                      style={{ borderColor: usernameError ? "#ff6b6b" : undefined }}
                    />
                    {usernameError && (
                      <p style={{ fontSize: "11px", color: "#ff6b6b", marginTop: "4px" }}>
                        {usernameError}
                      </p>
                    )}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
                      <span style={{ fontSize: "11px", color: username.length === MAX_USERNAME ? "orange" : "var(--text-muted)" }}>
                        {username.length}/{MAX_USERNAME}
                      </span>
                    </div>
                  </div>

                  {/* Ad Soyad */}
                  <div style={{ marginBottom: "20px" }}>
                    <label className="auth-label">Ad Soyad</label>
                    <input
                      type="text"
                      className="auth-input"
                      value={fullName}
                      onChange={handleFullNameChange}
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
                      <span style={{ fontSize: "11px", color: fullName.length === MAX_FULLNAME ? "orange" : "var(--text-muted)" }}>
                        {fullName.length}/{MAX_FULLNAME}
                      </span>
                    </div>
                  </div>

                  {/* Biyografi */}
                  <div style={{ marginBottom: "24px" }}>
                    <label className="auth-label">Biyografi</label>
                    <textarea
                      className="auth-input"
                      rows={4}
                      value={bio}
                      onChange={handleBioChange}
                      placeholder="Kendinden bahset..."
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
                      <span style={{ fontSize: "11px", color: bio.length === MAX_BIO ? "orange" : "var(--text-muted)" }}>
                        {bio.length}/{MAX_BIO}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button 
                      onClick={handleSave} 
                      className="btn btn--primary" 
                      disabled={saving || !!usernameError} 
                      style={{ flex: 1 }}
                    >
                      <FontAwesomeIcon icon={faSave} style={{ marginRight: "8px" }} />
                      {saving ? "Kaydediliyor..." : "Kaydet"}
                    </button>
                    <button onClick={() => setEditing(false)} className="btn btn--secondary" style={{ flex: 1 }}>
                      <FontAwesomeIcon icon={faTimes} style={{ marginRight: "8px" }} />
                      İptal
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 style={{ fontSize: "28px", marginBottom: "8px", wordBreak: "break-word" }}>
                    {username}
                  </h2>
                  {fullName && (
                    <p style={{ color: "var(--text-secondary)", marginBottom: "16px", wordBreak: "break-word" }}>
                      {fullName}
                    </p>
                  )}
                  
                  {bio && (
                    <div style={{ 
                      marginBottom: "24px", 
                      padding: "16px", 
                      background: "rgba(45,212,191,0.05)",
                      borderRadius: "12px",
                      textAlign: "left"
                    }}>
                      <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
                        {bio}
                      </p>
                    </div>
                  )}

                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    gap: "12px",
                    marginBottom: "24px",
                    color: "var(--text-muted)",
                    fontSize: "14px"
                  }}>
                    <FontAwesomeIcon icon={faEnvelope} style={{ color: "var(--accent-primary)" }} />
                    <span style={{ wordBreak: "break-word" }}>{user.email}</span>
                  </div>

                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    gap: "12px",
                    marginBottom: "32px",
                    color: "var(--text-muted)",
                    fontSize: "14px"
                  }}>
                    <FontAwesomeIcon icon={faCalendar} style={{ color: "var(--accent-primary)" }} />
                    <span>Katılım: {new Date(user.created_at).toLocaleDateString("tr-TR")}</span>
                  </div>

                  <button onClick={() => setEditing(true)} className="btn btn--secondary" style={{ width: "100%" }}>
                    <FontAwesomeIcon icon={faPen} style={{ marginRight: "8px" }} />
                    Profili Düzenle
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}