import { Award, ArrowRight, Check, Package, TreePine } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <section className="section">
      <div className="page-hero page-hero-dark">
        <div><span className="section-kicker">NOTRE MANIÈRE DE FAIRE</span><h1 className="page-title">Un combustible fiable commence par une information claire.</h1><p>OSSAU BOIS sélectionne des combustibles solides et met les informations essentielles au même endroit, pour décider avec confiance.</p></div>
        <TreePine size={58} strokeWidth={1.1} />
      </div>
      <div className="about-story"><div><span className="section-kicker">Une sélection lisible</span><h2>Du produit à la réception, chaque détail compte.</h2></div><p>Nous pensons le catalogue autour des usages réels : comprendre le combustible, vérifier ses caractéristiques, choisir le bon conditionnement et anticiper la réception. Cette méthode donne une place égale à la qualité du produit et à la simplicité de la commande.</p></div>
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
      <div className="about-promise"><div><span className="section-kicker">Nos engagements</span><h2>Une relation commerciale sans zones grises</h2></div><ul><li><Check size={17} /> Des caractéristiques présentées sans détour</li><li><Check size={17} /> Des modalités de livraison annoncées avant validation</li><li><Check size={17} /> Une équipe joignable pour les questions pratiques</li></ul><Link to="/contact" className="btn btn-primary">Parler à l&apos;équipe <ArrowRight size={16} /></Link></div>
      <div className="callout">
        <p>
          Les informations d’identification d’OSSAU BOIS sont issues de données publiques et
          doivent être maintenues à jour. Consultez les Mentions légales et les justificatifs
          officiels avant toute relation commerciale importante.
        </p>
      </div>
    </section>
  );
}
