import { ArrowRight, Check, Clock3, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Delivery() {
  return (
    <section className="section">
      <div className="page-hero page-hero-dark">
        <div><span className="section-kicker">EINFACHE UND PLANBARE WARENANNAHME</span><h1 className="page-title">Eine Lieferung, die zu Ihrer Zufahrt passt</h1><p>Jede Bestellung wird auf Palette an die angegebene Adresse versendet. Alle wichtigen Lieferdetails erhalten Sie vor der Zustellung.</p></div>
        <Truck size={58} strokeWidth={1.1} />
      </div>
      <div className="service-grid">
        <article className="service-card service-card-featured"><Truck size={24} /><span className="service-card-label">An Ihre Adresse</span><h2>Lieferung auf Palette</h2><p>Die Spedition stellt die Palette am Rand Ihrer befestigten Zufahrt ab, je nach Gegebenheiten mit Ladebordwand.</p><ul><li><Check size={16} /> Vorbereitung innerhalb von 1 bis 2 Werktagen nach Zahlung</li><li><Check size={16} /> Lieferung anschließend in 3 bis 5 Werktagen</li><li><Check size={16} /> Lieferinformation vor der Zustellung</li><li><Check size={16} /> Bitte organisieren Sie den Weitertransport der Palette</li></ul></article>
        <article className="service-card"><ShieldCheck size={24} /><span className="service-card-label">Bestellinformationen</span><h2>Planbar und dokumentiert</h2><p>Wir bereiten Ihre Bestellung sorgfältig vor und übermitteln Ihnen vor dem Versand alle wichtigen Informationen.</p><ul><li><Check size={16} /> Schriftliche Auftragsbestätigung</li><li><Check size={16} /> Lieferinformation vor der Zustellung</li><li><Check size={16} /> Unterstützung bei Transportschäden</li></ul></article>
      </div>
      <div className="delivery-timeline"><div><span>01</span><div><strong>Produkt auswählen</strong><p>Vergleichen Sie Formate und Verpackungen im Katalog.</p></div></div><div><span>02</span><div><strong>Adresse angeben</strong><p>Teilen Sie uns alle Informationen für eine passende Lieferung mit.</p></div></div><div><span>03</span><div><strong>Bestätigung erhalten</strong><p>Lieferinformationen und praktische Hinweise erhalten Sie schriftlich.</p></div></div></div>
      <div className="delivery-return"><div><Clock3 size={22} /><div><h2>Ein Problem bei der Warenannahme?</h2><p>Vermerken Sie sichtbare Schäden auf dem Lieferschein und senden Sie uns möglichst innerhalb von 48 Stunden Fotos und Ihre Bestellnummer. Ihre gesetzlichen Rechte bleiben unberührt.</p><Link to="/retouren" className="order-text-link">Informationen zu Widerruf und Rückgabe</Link></div></div><Link to="/contact" className="btn btn-primary checkout-action-button">Kontakt aufnehmen <ArrowRight size={16} /></Link></div>
    </section>
  );
}
