import { Award, Package, TreePine } from "lucide-react";

export default function About() {
  return (
    <section className="section">
      <h1 className="page-title">L&apos;entreprise</h1>
      <p className="page-lede">
        OSSAU BOIS est une structure de démonstration dédiée à la vente de combustibles solides
        avec une exigence de clarté sur les fiches produit et la logistique.
      </p>
      <div className="about-grid">
        <div className="about-block">
          <Award size={22} strokeWidth={1.5} />
          <h2 className="info-col-title">Transparence produit</h2>
          <p>Chaque référence indique certification, humidité, pouvoir calorifique et conditionnement.</p>
        </div>
        <div className="about-block">
          <TreePine size={22} strokeWidth={1.5} />
          <h2 className="info-col-title">Origine régionale</h2>
          <p>Une partie de nos bûches et briquettes provient de résidus de scieries et de forêts gérées durablement.</p>
        </div>
        <div className="about-block">
          <Package size={22} strokeWidth={1.5} />
          <h2 className="info-col-title">Logistique sur palette</h2>
          <p>Le conditionnement sur palette housse limite la manutention et protège les sacs pendant le transport.</p>
        </div>
      </div>
      <div className="callout">
        <p>
          Cette page présente une entreprise fictive à but de démonstration : les informations
          juridiques réelles restent à compléter avant toute mise en ligne effective.
        </p>
      </div>
    </section>
  );
}
