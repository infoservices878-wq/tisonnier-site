import { useParams, useSearchParams, Link } from "react-router-dom";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { CATEGORIES } from "../data/categories";
import { filterProducts } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Catalogue() {
  const { categoryId } = useParams();
  const [params] = useSearchParams();
  const search = params.get("q") || "";

  const filtered = filterProducts({ category: categoryId || null, search });
  const activeCat = CATEGORIES.find((c) => c.id === categoryId);

  return (
    <section className="section">
      <div className="catalogue-intro-bar">
        <div>
          <span className="section-kicker">OSSAU BOIS · SÉLECTION PROFESSIONNELLE</span>
          <p>{activeCat ? `${filtered.length} référence(s) dans cette catégorie` : "Des combustibles choisis pour comparer simplement"}</p>
        </div>
        <Link to="/contact" className="catalogue-help-link">Besoin d&apos;un conseil <ArrowRight size={15} /></Link>
      </div>
      {!activeCat && (
        <>
          <h1 className="page-title">Catalogue</h1>
          <p className="page-lede">
            {search
              ? `${filtered.length} résultat(s) pour « ${search} »`
              : `${filtered.length} produits disponibles, livrés sur palette complète ou en petit conditionnement pour l'allumage.`}
          </p>
          <div className="filter-row">
            <Link
              to="/catalogue"
              className="filter-chip active"
            >
              Tout
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                to={`/catalogue/${c.id}`}
                className="filter-chip"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </>
      )}
      {activeCat && <div className="catalogue-active-note"><SlidersHorizontal size={16} /><span>Filtre actif : <strong>{activeCat.name}</strong></span><Link to="/catalogue">Voir tout</Link></div>}
      {filtered.length === 0 ? (
        <div className="empty-state"><p>Aucun produit ne correspond à cette recherche.</p><Link to="/catalogue" className="btn btn-primary">Réinitialiser la recherche</Link></div>
      ) : (
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
