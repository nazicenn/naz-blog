import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin, faOrcid } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__social">
        <a href="https://github.com/nazicenn" target="_blank" rel="noopener noreferrer" className="footer__social-link">
          <FontAwesomeIcon icon={faGithub} />
        </a>

        <a href="https://www.linkedin.com/in/nazfc7/" target="_blank" rel="noopener noreferrer" className="footer__social-link">
          <FontAwesomeIcon icon={faLinkedin} />
        </a>

                <a href="https://orcid.org/0009-0007-5848-1045" target="_blank" rel="noopener noreferrer" className="footer__social-link">
          <FontAwesomeIcon icon={faOrcid} />
        </a>

      </div>
      <div className="footer__copyright">
        © 2026 Naz İçen | Tüm hakları saklıdır.
      </div>
    </footer>
  );
}