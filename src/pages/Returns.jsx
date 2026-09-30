import { ArrowRight, FileText, Mail, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { COMPANY } from "../data/legalContent";

export default function Returns() {
  return (
    <section className="section">
      <div className="page-hero page-hero-dark">
        <div>
          <span className="section-kicker">WIDERRUF, RÜCKGABE UND TRANSPORTSCHÄDEN</span>
          <h1 className="page-title">Wir klären den nächsten Schritt mit Ihnen.</h1>
          <p>Bei Brennstoffen auf Palette ist ein abgestimmter Rücktransport wichtig. Ihre gesetzlichen Rechte bleiben davon unberührt.</p>
        </div>
        <ShieldCheck size={58} strokeWidth={1.1} />
      </div>

      <div className="service-grid">
        <article className="service-card service-card-featured">
          <FileText size={24} />
          <span className="service-card-label">Widerruf</span>
          <h2>Maßgeblich sind Gesetz und AGB</h2>
          <p>Sofern das gesetzliche Widerrufsrecht gilt, beträgt die Frist grundsätzlich 14 Tage ab Erhalt der Ware. Die Widerrufsbelehrung mit Fristbeginn, Ausübung und Folgen erhalten Sie im Bestellprozess beziehungsweise mit der Auftragsbestätigung. Ihre gesetzlichen Rechte bleiben unberührt.</p>
          <Link to="/conditions-generales-de-vente" className="order-text-link">AGB lesen <ArrowRight size={15} /></Link>
        </article>
        <article className="service-card">
          <Truck size={24} />
          <span className="service-card-label">Rücktransport</span>
          <h2>Palette nicht unangekündigt zurücksenden</h2>
          <p>Kontaktieren Sie uns vor dem Rücktransport mit Ihrer Bestellnummer und dem betroffenen Artikel. Wir stimmen mit Ihnen ab, wie eine Palette sicher zurückgeführt werden kann. Die Hinweise zu den Rücksendekosten finden Sie in Ihrer Widerrufsbelehrung.</p>
          <Link to="/contact" className="order-text-link">Rückgabe mit uns abstimmen <ArrowRight size={15} /></Link>
        </article>
      </div>

      <div className="delivery-return">
        <div>
          <Mail size={22} />
          <div>
            <h2>Transportschaden bei der Anlieferung?</h2>
            <p>Vermerken Sie sichtbare Schäden möglichst auf dem Lieferschein und senden Sie uns Fotos sowie Ihre Bestellnummer. Für eine schnelle Bearbeitung bitten wir um Nachricht innerhalb von 48 Stunden; gesetzliche Rechte bleiben unberührt.</p>
          </div>
        </div>
        <a className="btn btn-primary checkout-action-button" href={`mailto:${COMPANY.email}?subject=Transportschaden%20oder%20R%C3%BCckgabe`}>
          {COMPANY.email} <ArrowRight size={16} />
        </a>
      </div>

      <p className="legal-links-note">Nach einem wirksamen Widerruf erfolgt die Erstattung innerhalb der gesetzlichen Frist. Wir können sie bis zum Erhalt der Ware oder bis zum Nachweis der Rücksendung zurückhalten. Wenn Sie uns schreiben, nennen Sie bitte Ihre Bestellnummer und schildern Sie kurz Ihr Anliegen.</p>
    </section>
  );
}