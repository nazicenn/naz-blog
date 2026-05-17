import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToolbox, faLock, faBolt, faBox, faDesktop, faKey, faArrowsSpin, faGlobe, faFileLines, faPalette, faCode, faGear, faImage } from "@fortawesome/free-solid-svg-icons";

export default function ToolCantamPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      
      <main className="toolbox" style={{ flex: 1 }}>
        <div className="container">
          {/* Back Button */}
          <div className="toolbox__back">
            <Link href="/" className="toolbox__back-link">
              ← Ana Sayfaya Dön
            </Link>
          </div>

          <div className="toolbox__container">
            {/* Header */}
            <div className="toolbox__header">
              <div className="toolbox__icon">
                <FontAwesomeIcon icon={faToolbox} style={{ fontSize: "32px", color: "var(--accent-primary)" }} />
              </div>
              <h1 className="toolbox__title">Tool Çantam</h1>
              <p className="toolbox__subtitle">
                70+ geliştirici aracını tek platformda toplayan WPF masaüstü uygulaması
              </p>
            </div>

            {/* Description */}
            <div className="toolbox__description">
              <p className="toolbox__text">
                <strong>Tool Çantam</strong>, geliştiricilerin günlük ihtiyaç duyabileceği 
                şifreleme, dönüştürme, ağ araçları ve daha fazlasını bir araya getiren 
                bir WPF masaüstü uygulamasıdır.
              </p>
              <p className="toolbox__text">
                Tüm işlemler <strong>client-side</strong> çalışır. Verileriniz asla sunucuya 
                gitmez, bilgisayarınızdan dışarı çıkmaz. Bu sayede <strong>veri gizliliğiniz</strong> 
                tamamen korunur.
              </p>
              <div className="toolbox__tags">
                <span className="toolbox__tag">WPF</span>
                <span className="toolbox__tag">C#</span>
                <span className="toolbox__tag">.NET</span>
                <span className="toolbox__tag">MVVM</span>
                <span className="toolbox__tag">Client-Side</span>
                <span className="toolbox__tag">70+ Araç</span>
              </div>
            </div>

            {/* Features - Özellikler */}
            <h2 className="toolbox__features-title">Özellikler</h2>
            <div className="toolbox__features-grid">
              <div className="toolbox__feature-card">
                <div style={{ fontSize: "14px", marginBottom: "8px", color: "var(--accent-primary)" }}>
                  <FontAwesomeIcon icon={faLock} />
                </div>
                <p className="toolbox__feature-text">
                  <strong>Veri Gizliliği</strong><br />
                  Tüm işlemler bilgisayarınızda çalışır, verileriniz asla dışarı çıkmaz.
                </p>
              </div>
              <div className="toolbox__feature-card">
                <div style={{ fontSize: "14px", marginBottom: "8px", color: "var(--accent-primary)" }}>
                  <FontAwesomeIcon icon={faBolt} />
                </div>
                <p className="toolbox__feature-text">
                  <strong>Hızlı ve Hafif</strong><br />
                  WPF ile geliştirilmiş, optimize edilmiş performans.
                </p>
              </div>
              <div className="toolbox__feature-card">
                <div style={{ fontSize: "14px", marginBottom: "8px", color: "var(--accent-primary)" }}>
                  <FontAwesomeIcon icon={faBox} />
                </div>
                <p className="toolbox__feature-text">
                  <strong>70+ Araç</strong><br />
                  Şifreleme, dönüştürücü, ağ araçları, üreteçler ve daha fazlası.
                </p>
              </div>
              <div className="toolbox__feature-card">
                <div style={{ fontSize: "14px", marginBottom: "8px", color: "var(--accent-primary)" }}>
                  <FontAwesomeIcon icon={faDesktop} />
                </div>
                <p className="toolbox__feature-text">
                  <strong>Windows Desteği</strong><br />
                  .NET ile geliştirilmiş, Windows işletim sisteminde çalışır.
                </p>
              </div>
            </div>

            {/* Categories - Araç Kategorileri */}
            <h2 className="toolbox__features-title" style={{ marginTop: "48px" }}>Araç Kategorileri</h2>
            <div className="toolbox__features-grid">
              <div className="toolbox__feature-card">
                <p className="toolbox__feature-text">
                  <strong><FontAwesomeIcon icon={faKey} style={{ fontSize: "10px", marginRight: "4px" }} /> Şifreleme</strong><br />
                  AES, RSA, JWT, Hash, HMAC
                </p>
              </div>
              <div className="toolbox__feature-card">
                <p className="toolbox__feature-text">
                  <strong><FontAwesomeIcon icon={faArrowsSpin} style={{ fontSize: "10px", marginRight: "4px" }} /> Dönüştürücüler</strong><br />
                  Base64, Hex, Binary, Unicode
                </p>
              </div>
              <div className="toolbox__feature-card">
                <p className="toolbox__feature-text">
                  <strong><FontAwesomeIcon icon={faGlobe} style={{ fontSize: "10px", marginRight: "4px" }} /> Ağ Araçları</strong><br />
                  DNS, Ping, WHOIS, Port Scanner
                </p>
              </div>
              <div className="toolbox__feature-card">
                <p className="toolbox__feature-text">
                  <strong><FontAwesomeIcon icon={faFileLines} style={{ fontSize: "10px", marginRight: "4px" }} /> Metin Araçları</strong><br />
                  Regex, Text Diff, Case Converter
                </p>
              </div>
              <div className="toolbox__feature-card">
                <p className="toolbox__feature-text">
                  <strong><FontAwesomeIcon icon={faPalette} style={{ fontSize: "10px", marginRight: "4px" }} /> Tasarım</strong><br />
                  Renk Seçici, CSS Gradient
                </p>
              </div>
              <div className="toolbox__feature-card">
                <p className="toolbox__feature-text">
                  <strong><FontAwesomeIcon icon={faCode} style={{ fontSize: "10px", marginRight: "4px" }} /> Biçimlendiriciler</strong><br />
                  JSON, SQL, XML, YAML
                </p>
              </div>
              <div className="toolbox__feature-card">
                <p className="toolbox__feature-text">
                  <strong><FontAwesomeIcon icon={faGear} style={{ fontSize: "10px", marginRight: "4px" }} /> Üreteçler</strong><br />
                  UUID, Şifre, Slug, Fake Data
                </p>
              </div>
              <div className="toolbox__feature-card">
                <p className="toolbox__feature-text">
                  <strong><FontAwesomeIcon icon={faImage} style={{ fontSize: "10px", marginRight: "4px" }} /> Medya</strong><br />
                  QR Code, EXIF Viewer
                </p>
              </div>
            </div>

            {/* Download Button */}
            <div className="toolbox__footer">
              <Link href="#" className="btn btn--primary" style={{ marginTop: "32px" }}>
                İndir (Windows)
              </Link>
              <p style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "16px" }}>
                Ücretsiz • Açık Kaynak • Veri Güvenli
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}