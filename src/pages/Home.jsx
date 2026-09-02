import { Link } from "react-router-dom";
import { ChevronRight, Truck, Award, Package } from "lucide-react";
import { CATEGORIES } from "../data/categories";
import { PRODUCTS } from "../data/products";
import ProductCard from "../components/ProductCard";
import FaqSection from "../components/FaqSection";

function ValueStrip() {
  const items = [
    { icon: Truck, title: "Livraison palette", text: "Hayon, bord de voie carrossable" },
    { icon: Award, title: "Fiches précises", text: "Certifications et specs lisibles" },
    { icon: Package, title: "Retrait possible", text: "Sur rendez-vous confirmé" },
  ];
  return (
    <div className="value-strip">
      {items.map((it) => (
        <div className="value-item" key={it.title}>
          <it.icon size={22} strokeWidth={1.5} />
          <div>
            <strong>{it.title}</strong>
            <span>{it.text}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const featured = PRODUCTS.slice(0, 6);

  return (
    <>
      <section className="hero">
        <div className="hero-scene">
          <img
            src="/hero-production.jpg"
            alt="Atelier industriel de production et de transformation du bois"
          />
          <div className="hero-scene-overlay" aria-hidden="true" />
        </div>
        <div className="hero-content">
          <p className="hero-kicker">Combustibles pour particuliers et professionnels</p>
          <h1 className="hero-title">Une chaleur sur laquelle vous pouvez compter.</h1>
          <p className="hero-sub">
            Granulés, briquettes, bois de chauffage et charbon, avec des fiches produit précises,
            une logistique sur palette maîtrisée et une équipe joignable en semaine.
          </p>
          <div className="hero-actions">
            <Link to="/catalogue" className="btn btn-primary">Voir le catalogue</Link>
            <Link to="/entreprise" className="btn btn-ghost-light">Découvrir l&apos;entreprise</Link>
          </div>
        </div>
      </section>

      <ValueStrip />

      <section className="section">
        <h2 className="section-title">Trouvez le combustible adapté à votre appareil</h2>
        <div className="cat-tiles cat-tiles-primary">
          {CATEGORIES.slice(0, 2).map((c) => (
            <Link key={c.id} to={`/catalogue/${c.id}`} className="cat-tile">
              <img src={c.image} alt="" loading="lazy" />
              <span className="cat-tile-overlay">
                <strong>{c.name}</strong>
                <span>Voir les produits <span aria-hidden="true">→</span></span>
              </span>
            </Link>
          ))}
        </div>
        <div className="cat-tiles cat-tiles-secondary">
          {CATEGORIES.slice(2).map((c) => (
            <Link key={c.id} to={`/catalogue/${c.id}`} className="cat-tile">
              <img src={c.image} alt="" loading="lazy" />
              <span className="cat-tile-overlay">
                <strong>{c.name}</strong>
                <span>Voir les produits <span aria-hidden="true">→</span></span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head-row">
          <h2 className="section-title">Une sélection à comparer facilement</h2>
          <Link to="/catalogue" className="link-btn">
            Tout le catalogue <ChevronRight size={16} strokeWidth={1.7} />
          </Link>
        </div>
        <div className="product-grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="section steps-section">
        <h2 className="section-title">Commander en trois étapes</h2>
        <div className="steps">
          {[
            { n: "1", title: "Choisir un produit", text: "Comparez le conditionnement, les spécifications et le prix." },
            { n: "2", title: "Livraison ou retrait", text: "Faites-vous livrer la palette ou réservez un retrait avec paiement sur place." },
            { n: "3", title: "Confirmation écrite", text: "Recevez par e-mail le récapitulatif et le créneau prévu." },
          ].map((s) => (
            <div className="step" key={s.n}>
              <span className="step-n">{s.n}</span>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-text">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <FaqSection limit={4} showAllLink title="Questions fréquentes" />
    </>
  );
}
