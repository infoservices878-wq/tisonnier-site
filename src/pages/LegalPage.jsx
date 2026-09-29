import { useLocation, Link } from "react-router-dom";
import { ArrowUpRight, FileText } from "lucide-react";
import {
  MENTIONS_SECTIONS,
  PRIVACY_SECTIONS,
  CGV_SECTIONS,
  COMPANY,
} from "../data/legalContent";

const CONFIG = {
  "/mentions-legales": {
    title: "Impressum",
    lede: "Unternehmens- und Registerangaben der AM Holzbrennstoffe UG (haftungsbeschränkt).",
    sections: MENTIONS_SECTIONS,
  },
  "/politique-de-confidentialite": {
    title: "Datenschutzerklärung",
    lede: "Informationen zur Verarbeitung personenbezogener Daten.",
    sections: PRIVACY_SECTIONS,
  },
  "/conditions-generales-de-vente": {
    title: "Allgemeine Geschäftsbedingungen",
    lede: "Bedingungen für den Verkauf fester Brennstoffe über diese Website.",
    sections: CGV_SECTIONS,
  },
};

export default function LegalPage() {
  const { pathname } = useLocation();
  const page = CONFIG[pathname];

  if (!page) {
    return (
      <section className="section">
        <h1 className="page-title">Seite nicht gefunden</h1>
      </section>
    );
  }

  return (
    <section className="section legal-page">
      <div className="legal-heading"><div><span className="section-kicker">RECHTLICHE INFORMATIONEN</span><h1 className="page-title">{page.title}</h1><p className="page-lede">{page.lede}</p></div><FileText size={46} strokeWidth={1.2} /></div>
      {page.sections.map((s) => (
        <div className="legal-block" key={s.title}>
          <h2 className="legal-h2">{s.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: s.html }} />
        </div>
      ))}
      <section className="legal-links-section" aria-labelledby="legal-links-title">
        <div>
          <span className="section-kicker">WEITERE INFORMATIONEN</span>
          <h2 id="legal-links-title">Rechtliche Hinweise und Quellen</h2>
          <p>Hier finden Sie die rechtlichen Informationen dieser Website und den öffentlichen Registerhinweis zum Unternehmen.</p>
        </div>
        <div className="legal-links-grid">
          <Link to="/mentions-legales"><span>Impressum</span><ArrowUpRight size={16} /></Link>
          <Link to="/politique-de-confidentialite"><span>Datenschutz</span><ArrowUpRight size={16} /></Link>
          <Link to="/conditions-generales-de-vente"><span>AGB</span><ArrowUpRight size={16} /></Link>
          <a href={COMPANY.registerUrl} target="_blank" rel="noreferrer"><span>Handelsregister (offizielle Suche)</span><ArrowUpRight size={16} /></a>
        </div>
        <p className="legal-links-note">Maßgeblich sind die jeweils aktuellen amtlichen Registerunterlagen.</p>
      </section>
    </section>
  );
}
