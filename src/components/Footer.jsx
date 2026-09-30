import { Link } from "react-router-dom";
import { Euro } from "lucide-react";
import Logo from "./Logo";
import { CATEGORIES } from "../data/categories";
import { COMPANY } from "../data/legalContent";

function openCookieSettings() {
  window.dispatchEvent(new Event("AM Holzbrennstoffe UG:manage-cookies"));
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-top-inner">
          <div className="footer-brand">
            <Logo textOnly />
            <p className="footer-desc">
              Brennholz, Pellets und feste Brennstoffe mit klaren
              Produktinformationen und Palettenlogistik für Privat- und
              Gewerbekunden.
            </p>
          </div>
          <div className="footer-contact-box">
            <span className="footer-contact-label">KUNDENSERVICE</span>
            <a className="footer-contact-mail" href={`mailto:${COMPANY.email}`}>
              {COMPANY.email}
            </a>
            {COMPANY.phone && <><a className="footer-contact-phone" href={COMPANY.phoneHref}>{COMPANY.phone}</a><span className="footer-note">{COMPANY.phoneNotice}</span></>}
            {COMPANY.hours && <span className="footer-contact-hours">Erreichbarkeit: {COMPANY.hours}</span>}
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-main-inner">
          <div className="footer-col">
            <h3 className="footer-heading">KATALOG</h3>
            <Link className="footer-link" to="/catalogue">Gesamter Katalog</Link>
            {CATEGORIES.map((c) => (
              <Link key={c.id} className="footer-link" to={`/catalogue/${c.id}`}>
                {c.name}
              </Link>
            ))}
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">SERVICE</h3>
            <Link className="footer-link" to="/livraison">Lieferung und Warenannahme</Link>
            <Link className="footer-link" to="/zahlung">Zahlungsablauf</Link>
            <Link className="footer-link" to="/retouren">Widerruf und Rückgabe</Link>
            <Link className="footer-link" to="/contact">Bestellung anfragen</Link>
            <Link className="footer-link" to="/faq">Häufige Fragen</Link>
            <Link className="footer-link" to="/contact">Kontakt</Link>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">RECHTLICHES</h3>
            <Link className="footer-link" to="/mentions-legales">Impressum</Link>
            <Link className="footer-link" to="/politique-de-confidentialite">Datenschutz</Link>
            <Link className="footer-link" to="/conditions-generales-de-vente">AGB</Link>
            <button type="button" className="footer-link" onClick={openCookieSettings}>Datenschutzeinstellungen</button>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">ANBIETER</h3>
            <p className="footer-company-name">{COMPANY.name}</p>
            <p className="footer-address">
              {COMPANY.address}<br />
              {COMPANY.city}<br />
              {COMPANY.country}
            </p>
            <p className="footer-legal-info">
              Geschäftsführer: {COMPANY.manager}<br />
              {COMPANY.registerCourt}<br />
              Handelsregister: {COMPANY.registerNumber}
            </p>
          </div>

          <div className="footer-col footer-col-last">
            <h3 className="footer-heading">VERSAND</h3>
            <p className="footer-address">Palettenversand an die bei der Bestellung angegebene Lieferadresse.</p>
            <p className="footer-note">Die Lieferdetails erhalten Sie mit Ihrer Auftragsbestätigung.</p>
          </div>
        </div>
      </div>

      <div className="footer-payment-band">
        <h2 className="footer-payment-heading">SICHERES BEZAHLEN</h2>
        <div className="footer-payment-methods">
          <Link className="footer-payment-option footer-payment-bank" to="/zahlung">
            <span className="footer-payment-icon"><Euro size={19} strokeWidth={2.2} /></span>
            <span className="footer-payment-copy"><strong>Banküberweisung</strong><small>Sicher &amp; gebührenfrei</small></span>
          </Link>
          <div className="footer-payment-option footer-payment-mark footer-payment-visa"><img src="/payment-methods/visa.svg" alt="Visa" decoding="async" /></div>
          <div className="footer-payment-option footer-payment-mark footer-payment-mastercard"><img src="/payment-methods/mastercard.svg" alt="Mastercard" decoding="async" /></div>
          <div className="footer-payment-option footer-payment-mark footer-payment-amex"><img src="/payment-methods/amex.svg" alt="American Express" decoding="async" /></div>
          <div className="footer-payment-option footer-payment-mark footer-payment-paypal"><img src="/payment-methods/paypal.svg" alt="PayPal" decoding="async" /></div>
          <div className="footer-payment-option footer-payment-mark footer-payment-apple"><img src="/payment-methods/applepay.svg" alt="Apple Pay" decoding="async" /></div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>© 2026 AM Holzbrennstoffe UG</span>
          <span className="footer-bottom-sep">Alle Rechte vorbehalten</span>
          <span className="footer-bottom-sep">{COMPANY.registerNumber}</span>
        </div>
      </div>
    </footer>
  );
}
