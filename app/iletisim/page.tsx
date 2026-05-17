"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faLocationDot } from "@fortawesome/free-solid-svg-icons";

export default function IletisimPage() {
  const [isSent, setIsSent] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xkoewnye", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setIsSent(true);
        form.reset();
        setTimeout(() => setIsSent(false), 3000);
      } else {
        setIsError(true);
        setTimeout(() => setIsError(false), 3000);
      }
    } catch {
      setIsError(true);
      setTimeout(() => setIsError(false), 3000);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      
      <main style={{ flex: 1, paddingTop: "120px", paddingBottom: "80px" }}>
        <div className="container">
          <h1 style={{ fontSize: "48px", marginBottom: "16px", textAlign: "center" }}>İletişim</h1>
          <p style={{ color: "var(--text-secondary)", textAlign: "center", marginBottom: "48px", maxWidth: "600px", margin: "0 auto 48px" }}>
            Soruların, önerilerin veya işbirliği tekliflerin için bana ulaşabilirsin.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "48px", maxWidth: "1000px", margin: "0 auto" }}>
            {/* İletişim Bilgileri */}
            <div>
              <h2 style={{ fontSize: "24px", marginBottom: "24px" }}>Bilgilerim</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "40px", height: "40px", background: "rgba(45,212,191,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FontAwesomeIcon icon={faEnvelope} style={{ color: "var(--accent-primary)" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Email</div>
                    <a href="mailto:nazfc7@gmail.com" style={{ color: "var(--text-primary)", textDecoration: "none" }}>nazfc7@gmail.com</a>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "40px", height: "40px", background: "rgba(45,212,191,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FontAwesomeIcon icon={faPhone} style={{ color: "var(--accent-primary)" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Telefon</div>
                    <a href="tel:+905451911095" style={{ color: "var(--text-primary)", textDecoration: "none" }}>+90 545 191 10 95</a>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "40px", height: "40px", background: "rgba(45,212,191,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FontAwesomeIcon icon={faLocationDot} style={{ color: "var(--accent-primary)" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Konum</div>
                    <span style={{ color: "var(--text-primary)" }}>Türkiye</span>
                  </div>
                </div>
              </div>
            </div>

            {/* İletişim Formu */}
            <div>
              <h2 style={{ fontSize: "24px", marginBottom: "24px" }}>Mesaj Gönder</h2>
              <form onSubmit={handleSubmit}>
                <input type="hidden" name="_subject" value="Yeni İletişim Mesajı" />
                <div style={{ marginBottom: "20px" }}>
                  <label className="auth-label">Ad Soyad</label>
                  <input type="text" name="name" className="auth-input" required />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label className="auth-label">E-posta</label>
                  <input type="email" name="email" className="auth-input" required />
                </div>
                <div style={{ marginBottom: "24px" }}>
                  <label className="auth-label">Mesaj</label>
                  <textarea name="message" className="auth-input" rows={5} required />
                </div>
                <button type="submit" className="btn btn--primary" style={{ width: "100%" }}>
                  Gönder
                </button>
                {isSent && (
                  <p style={{ color: "var(--accent-primary)", marginTop: "16px", textAlign: "center" }}>
                    Mesajınız gönderildi! En kısa sürede dönüş yapacağım.
                  </p>
                )}
                {isError && (
                  <p style={{ color: "#ff6b6b", marginTop: "16px", textAlign: "center" }}>
                    Bir hata oluştu. Lütfen daha sonra tekrar deneyin.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}