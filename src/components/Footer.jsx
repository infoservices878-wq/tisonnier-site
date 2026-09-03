import { Link } from "react-router-dom";
import Logo from "./Logo";
import { CATEGORIES } from "../data/categories";
import { COMPANY } from "../data/legalContent";

function openCookieSettings() {
  window.dispatchEvent(new Event("OSSAU BOIS:manage-cookies"));
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-top-inner">
          <div className="footer-brand">
            <Logo textOnly />
            <p className="footer-desc">
              OSSAU BOIS réunit combustibles solides, informations produit
              transparentes et logistique sur palette pour les particuliers
              et professionnels.
            </p>
          </div>
          <div className="footer-contact-box">
            <span className="footer-contact-label">CONTACT CLIENT DIRECT</span>
            <a className="footer-contact-mail" href={`mailto:${COMPANY.email}`}>
              {COMPANY.email}
            </a>
            <a className="footer-contact-phone" href={COMPANY.phoneHref}>
              {COMPANY.phone}
            </a>
            <span className="footer-contact-hours">Horaires : {COMPANY.hours}</span>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-main-inner">
          <div className="footer-col">
            <h3 className="footer-heading">CATALOGUE</h3>
            <Link className="footer-link" to="/catalogue">Tout le catalogue</Link>
            {CATEGORIES.map((c) => (
              <Link key={c.id} className="footer-link" to={`/catalogue/${c.id}`}>
                {c.name}
              </Link>
            ))}
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">AIDE &amp; SERVICES</h3>
            <Link className="footer-link" to="/livraison">Livraison et réception de la palette</Link>
            <Link className="footer-link" to="/livraison">Une procédure de retour clairement expliquée</Link>
            <Link className="footer-link" to="/contact">Suivre ma commande</Link>
            <Link className="footer-link" to="/faq">Questions fréquentes</Link>
            <Link className="footer-link" to="/contact">Contact</Link>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">INFORMATIONS LÉGALES</h3>
            <Link className="footer-link" to="/mentions-legales">Mentions légales</Link>
            <Link className="footer-link" to="/politique-de-confidentialite">Politique de confidentialité</Link>
            <Link className="footer-link" to="/conditions-generales-de-vente">Conditions générales de vente</Link>
            <button type="button" className="footer-link" onClick={openCookieSettings}>Gérer la confidentialité</button>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">VENDEUR</h3>
            <p className="footer-company-name">{COMPANY.name}</p>
            <p className="footer-address">
              {COMPANY.address}<br />
              {COMPANY.city}<br />
              {COMPANY.country}
            </p>
            <p className="footer-legal-info">
              Gérant : {COMPANY.manager}<br />
              {COMPANY.rcs}<br />
              SIRET : {COMPANY.siret}<br />
              TVA : {COMPANY.tva}
            </p>
          </div>

          <div className="footer-col footer-col-last">
            <h3 className="footer-heading">ENTREPÔT DE RETRAIT</h3>
            <p className="footer-address">
              {COMPANY.warehouse.address}<br />
              {COMPANY.warehouse.city}<br />
              {COMPANY.warehouse.country}
            </p>
            <p className="footer-note">{COMPANY.warehouse.note}</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>© 2026 OSSAU BOIS</span>
          <span className="footer-bottom-sep">{COMPANY.name}</span>
          <span className="footer-bottom-sep">{COMPANY.rcs}</span>
        </div>
      </div>
    </footer>
  );
}
