"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const supabase = createClient();

  // Kullanıcı adı kontrolü (3-20 karakter)
  const checkUsername = async (value: string) => {
    if (value.length < 3) {
      setUsernameError("Kullanıcı adı en az 3 karakter olmalıdır.");
      return false;
    }
    if (value.length > 20) {
      setUsernameError("Kullanıcı adı en fazla 20 karakter olabilir.");
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameError("Sadece harf, rakam ve alt çizgi kullanabilirsiniz.");
      return false;
    }
    
    setCheckingUsername(true);
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", value)
      .maybeSingle();
    setCheckingUsername(false);
    
    if (existingProfile) {
      setUsernameError("Bu kullanıcı adı zaten alınmış.");
      return false;
    }
    
    setUsernameError("");
    return true;
  };

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    if (value.length >= 3 && value.length <= 20) {
      await checkUsername(value);
    } else if (value.length > 0 && value.length < 3) {
      setUsernameError("Kullanıcı adı en az 3 karakter olmalıdır.");
    } else if (value.length > 20) {
      setUsernameError("Kullanıcı adı en fazla 20 karakter olabilir.");
    } else {
      setUsernameError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validasyonlar
    if (username.length < 3) {
      setError("Kullanıcı adı en az 3 karakter olmalıdır.");
      setLoading(false);
      return;
    }
    if (username.length > 20) {
      setError("Kullanıcı adı en fazla 20 karakter olabilir.");
      setLoading(false);
      return;
    }
    
    const isUnique = await checkUsername(username);
    if (!isUnique) {
      setLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Geçerli bir e-posta adresi giriniz.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      setLoading(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    });

    if (signUpError) {
      if (signUpError.message.includes("User already registered")) {
        setError("Bu e-posta adresi zaten kayıtlı.");
      } else {
        setError(signUpError.message);
      }
    } else {
      router.push("/login?message=Hesabınız oluşturuldu! Lütfen e-postanızı doğrulayın.");
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      
      <main style={{ flex: 1, paddingTop: "120px", paddingBottom: "80px" }}>
        <div className="container">
          <div className="auth-card" style={{ margin: "0 auto" }}>
            <h2 className="auth-title">Kayıt Ol</h2>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label className="auth-label">Kullanıcı Adı (3-20 karakter)</label>
                <input
                  type="text"
                  className="auth-input"
                  value={username}
                  onChange={handleUsernameChange}
                  required
                  placeholder="kullanici_adi"
                />
                {checkingUsername && (
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                    Kontrol ediliyor...
                  </p>
                )}
                {usernameError && (
                  <p style={{ fontSize: "12px", color: "#ff6b6b", marginTop: "4px" }}>
                    {usernameError}
                  </p>
                )}
                {username.length >= 3 && username.length <= 20 && !usernameError && username && !checkingUsername && (
                  <p style={{ fontSize: "12px", color: "var(--accent-primary)", marginTop: "4px" }}>
                    ✓ Kullanılabilir
                  </p>
                )}
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label className="auth-label">E-posta</label>
                <input
                  type="email"
                  className="auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label className="auth-label">Şifre (en az 6 karakter)</label>
                <input
                  type="password"
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn--primary" 
                style={{ width: "100%" }}
                disabled={loading || !!usernameError || username.length < 3 || username.length > 20}
              >
                {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
              </button>
            </form>
            <div className="auth-footer">
              Zaten hesabın var mı? <Link href="/login">Giriş Yap</Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}