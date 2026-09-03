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
    title: "Mentions légales",
    lede: "Informations d’identification et coordonnées publiques relatives à OSSAU BOIS.",
    sections: MENTIONS_SECTIONS,
  },
  "/politique-de-confidentialite": {
    title: "Politique de confidentialité",
    lede: "Comment OSSAU BOIS traite les données personnelles collectées via le site.",
    sections: PRIVACY_SECTIONS,
  },
  "/conditions-generales-de-vente": {
    title: "Conditions générales de vente",
    lede: "Conditions applicables aux ventes de combustibles solides réalisées via le site.",
    sections: CGV_SECTIONS,
  },
};

export default function LegalPage() {
  const { pathname } = useLocation();
  const page = CONFIG[pathname];

  if (!page) {
    return (
      <section className="section">
        <h1 className="page-title">Page introuvable</h1>
      </section>
    );
  }

  return (
    <section className="section legal-page">
      <div className="legal-heading"><div><span className="section-kicker">DOCUMENTATION OSSAU BOIS</span><h1 className="page-title">{page.title}</h1><p className="page-lede">{page.lede}</p></div><FileText size={46} strokeWidth={1.2} /></div>
      {page.sections.map((s) => (
        <div className="legal-block" key={s.title}>
          <h2 className="legal-h2">{s.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: s.html }} />
        </div>
      ))}
      <section className="legal-links-section" aria-labelledby="legal-links-title">
        <div>
          <span className="section-kicker">RÉFÉRENCES UTILES</span>
          <h2 id="legal-links-title">Documents et liens légaux</h2>
          <p>Retrouvez les textes applicables au site et les sources publiques permettant de vérifier les informations d’OSSAU BOIS.</p>
        </div>
        <div className="legal-links-grid">
          <Link to="/mentions-legales"><span>Mentions légales</span><ArrowUpRight size={16} /></Link>
          <Link to="/politique-de-confidentialite"><span>Politique de confidentialité</span><ArrowUpRight size={16} /></Link>
          <Link to="/conditions-generales-de-vente"><span>Conditions générales de vente</span><ArrowUpRight size={16} /></Link>
          <a href={COMPANY.inpiExtractUrl} target="_blank" rel="noreferrer"><span>Extrait INPI</span><ArrowUpRight size={16} /></a>
        </div>
        <p className="legal-links-note">Les sources externes sont consultées indépendamment du site. Les documents officiels les plus récents font foi.</p>
      </section>
    </section>
  );
}
