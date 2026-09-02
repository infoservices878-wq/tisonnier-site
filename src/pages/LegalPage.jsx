import { useLocation } from "react-router-dom";
import {
  MENTIONS_SECTIONS,
  PRIVACY_SECTIONS,
  CGV_SECTIONS,
} from "../data/legalContent";

const CONFIG = {
  "/mentions-legales": {
    title: "Mentions légales",
    lede: "Informations obligatoires relatives à l'éditeur du site (démonstration).",
    sections: MENTIONS_SECTIONS,
  },
  "/politique-de-confidentialite": {
    title: "Politique de confidentialité",
    lede: "Comment Tisonnier traite les données personnelles collectées via le site (version démonstration).",
    sections: PRIVACY_SECTIONS,
  },
  "/conditions-generales-de-vente": {
    title: "Conditions générales de vente",
    lede: "Conditions applicables aux ventes de combustibles solides réalisées via le site (démonstration).",
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
      <h1 className="page-title">{page.title}</h1>
      <p className="page-lede">{page.lede}</p>
      {page.sections.map((s) => (
        <div className="legal-block" key={s.title}>
          <h2 className="legal-h2">{s.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: s.html }} />
        </div>
      ))}
      <div className="callout">
        <p>
          Document fictif fourni à titre de démonstration. Faites valider le contenu
          par un professionnel avant publication.
        </p>
      </div>
    </section>
  );
}
