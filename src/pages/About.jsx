import { Award, ArrowRight, Check, Package, TreePine } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <section className="section">
      <div className="page-hero page-hero-dark">
        <div><span className="section-kicker">UNSER ANSPRUCH</span><h1 className="page-title">Zuverlässige Wärme beginnt mit klaren Informationen.</h1><p>AM Holzbrennstoffe UG bündelt die wichtigsten Angaben zu festen Brennstoffen, damit Sie sicher vergleichen und auswählen können.</p></div>
        <TreePine size={58} strokeWidth={1.1} />
      </div>
      <div className="about-story"><div><span className="section-kicker">Übersichtlich auswählen</span><h2>Vom Produkt bis zur Warenannahme zählt jedes Detail.</h2></div><p>Unser Katalog orientiert sich an der Praxis: Brennstoff verstehen, Eigenschaften prüfen, die passende Verpackung wählen und die Lieferung vorbereiten. Produktqualität und ein einfacher Bestellablauf gehören für uns zusammen.</p></div>
      <div className="about-grid">
        <div className="about-block">
          <Award size={22} strokeWidth={1.5} />
          <h2 className="info-col-title">Klare Produktangaben</h2>
          <p>Jeder Artikel nennt verfügbare Zertifikate, Feuchtigkeit, Heizwert und Verpackung.</p>
        </div>
        <div className="about-block">
          <TreePine size={22} strokeWidth={1.5} />
          <h2 className="info-col-title">Verantwortungsvolle Auswahl</h2>
          <p>Bei unseren Artikeln stehen Herkunft, Zusammensetzung und die jeweiligen Produktinformationen im Mittelpunkt.</p>
        </div>
        <div className="about-block">
          <Package size={22} strokeWidth={1.5} />
          <h2 className="info-col-title">Palettenlogistik</h2>
          <p>Palettenverpackungen erleichtern die Handhabung und schützen die Ware während des Transports.</p>
        </div>
      </div>
      <div className="about-promise"><div><span className="section-kicker">Unser Versprechen</span><h2>Transparent von Anfang an</h2></div><ul><li><Check size={17} /> Produktmerkmale klar dargestellt</li><li><Check size={17} /> Lieferbedingungen vor der Bestellung sichtbar</li><li><Check size={17} /> Direkter Kontakt bei praktischen Fragen</li></ul><Link to="/contact" className="btn btn-primary">Team kontaktieren <ArrowRight size={16} /></Link></div>
      <div className="callout">
        <p>
          Die Unternehmensangaben der AM Holzbrennstoffe UG (haftungsbeschränkt) beruhen auf öffentlichen Registerdaten.
          Bitte beachten Sie das Impressum und bei Bedarf die aktuellen amtlichen Registerunterlagen.
        </p>
      </div>
    </section>
  );
}
