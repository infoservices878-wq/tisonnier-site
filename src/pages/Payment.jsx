import { ArrowRight, Check, CreditCard, Mail, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Payment() {
  return (
    <section className="section">
      <div className="page-hero page-hero-dark">
        <div>
          <span className="section-kicker">ZAHLUNG UND BESTELLABLAUF</span>
          <h1 className="page-title">Jeder Schritt klar nachvollziehbar.</h1>
          <p>Mit erfolgreichem Eingang Ihrer über „Zahlungspflichtig bestellen“ abgegebenen Bestellung kommt der Kaufvertrag zustande. Die Vertragsbestätigung mit Bankverbindung und Zahlungsreferenz erhalten Sie per E-Mail.</p>
        </div>
        <CreditCard size={58} strokeWidth={1.1} />
      </div>

      <div className="delivery-timeline">
        <div><span>01</span><div><strong>Warenkorb und Lieferadresse prüfen</strong><p>Im Warenkorb sehen Sie Artikel, Versandkosten und Gesamtbetrag inklusive Mehrwertsteuer.</p></div></div>
        <div><span>02</span><div><strong>Verbindlich bestellen</strong><p>Mit erfolgreichem Eingang Ihrer Bestellung kommt der Kaufvertrag zustande. Die Vertragsbestätigung enthält Zahlbetrag, Bankverbindung und Zahlungsreferenz.</p></div></div>
        <div><span>03</span><div><strong>Innerhalb von 7 Tagen überweisen</strong><p>Der vollständige Betrag muss innerhalb von 7 Kalendertagen ab Zugang der Vertragsbestätigung auf unserem Konto eingehen. Verwenden Sie die Zahlungsreferenz im Verwendungszweck. Nach Zahlungseingang bereiten wir Ihre Bestellung vor. Bei verspäteter Zahlung erinnern wir Sie und setzen eine angemessene Nachfrist.</p></div></div>
      </div>

      <div className="service-grid">
        <article className="service-card service-card-featured">
          <CreditCard size={24} />
          <span className="service-card-label">Zahlungsart</span>
          <h2>Banküberweisung</h2>
          <p>Die Zahlung erfolgt per Überweisung. Ihre Bankdaten müssen Sie nicht in ein Zahlungsformular auf der Website eingeben.</p>
          <ul>
            <li><Check size={16} /> Bankverbindung und Referenz mit der Vertragsbestätigung</li>
            <li><Check size={16} /> Zahlungsziel: 7 Kalendertage ab Erhalt der Bestätigung</li>
            <li><Check size={16} /> Gesamtbetrag vor dem Absenden im Warenkorb</li>
          </ul>
        </article>
        <article className="service-card">
          <Mail size={24} />
          <span className="service-card-label">Keine Bestätigung gefunden?</span>
          <h2>Prüfen Sie Ihr E-Mail-Postfach</h2>
          <p>Kontrollieren Sie auch den Spam-Ordner. Wenn die Nachricht fehlt oder Angaben unklar sind, kontaktieren Sie uns mit Ihrer Bestellnummer.</p>
          <Link to="/kontakt" className="order-text-link">Kontakt aufnehmen <ArrowRight size={15} /></Link>
        </article>
      </div>

      <div className="faq-contact">
        <div><span className="section-kicker">BEREIT FÜR DEN NÄCHSTEN SCHRITT?</span><h2>Prüfen Sie Ihren Warenkorb.</h2></div>
        <Link to="/warenkorb" className="btn btn-primary checkout-action-button"><ShoppingCart size={16} /> Zum Warenkorb</Link>
      </div>
      <p className="legal-links-note">Die gesetzliche 30-Tage-Regel in § 286 Abs. 3 BGB ist keine Zahlungsfrist. Sie betrifft den Eintritt des Zahlungsverzugs; gegenüber Verbrauchern gilt sie nur mit ausdrücklichem Hinweis auf der Rechnung. Unser vereinbartes Zahlungsziel beträgt 7 Kalendertage ab Zugang der Vertragsbestätigung. Bei Verzug beachten wir die gesetzlichen Voraussetzungen und setzen vor einem Rücktritt grundsätzlich eine angemessene Nachfrist. <a href="https://www.gesetze-im-internet.de/bgb/__286.html" target="_blank" rel="noreferrer">§ 286 BGB</a> · <a href="https://www.gesetze-im-internet.de/bgb/__323.html" target="_blank" rel="noreferrer">§ 323 BGB</a></p>
    </section>
  );
}
