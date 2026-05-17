"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      const adminEmails = ["nazfc7@gmail.com"];
      setIsAdmin(adminEmails.includes(user?.email || ""));
    };
    
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      const adminEmails = ["nazfc7@gmail.com"];
      setIsAdmin(adminEmails.includes(session?.user?.email || ""));
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link href="/" className="navbar__logo">
          Naz İçen
        </Link>

        <ul className="navbar__menu">
          <li><Link href="/" className="navbar__link">Ana Sayfa</Link></li>
          <li><Link href="/blog" className="navbar__link">Blog</Link></li>
          <li><Link href="/#projeler" className="navbar__link">Projeler</Link></li>
          <li><Link href="/iletisim" className="navbar__link">İletişim</Link></li>
          {isAdmin && (
            <li><Link href="/admin" className="navbar__link" style={{ color: "var(--accent-primary)" }}>Admin</Link></li>
          )}
        </ul>

        <div className="navbar__auth">
          {user ? (
            <>
              <Link href="/profile" className="btn--auth btn--login" style={{ fontWeight: "600", background: "rgba(45,212,191,0.1)" }}>
                👤 {user.user_metadata?.username || user.email?.split("@")[0]}
              </Link>
              <button onClick={handleLogout} className="btn--auth btn--signup">
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn--auth btn--login">Giriş yap</Link>
              <Link href="/register" className="btn--auth btn--signup">Kayıt ol</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}