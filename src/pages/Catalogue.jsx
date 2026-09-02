import { useParams, useSearchParams, Link } from "react-router-dom";
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
      <h1 className="page-title">
        {activeCat ? activeCat.name : "Catalogue"}
      </h1>
      <p className="page-lede">
        {search
          ? `${filtered.length} résultat(s) pour « ${search} »`
          : activeCat
            ? activeCat.blurb
            : `${filtered.length} produits disponibles, livrés sur palette complète ou en petit conditionnement pour l'allumage.`}
      </p>
      <div className="filter-row">
        <Link
          to="/catalogue"
          className={"filter-chip" + (!categoryId ? " active" : "")}
        >
          Tout
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            to={`/catalogue/${c.id}`}
            className={"filter-chip" + (categoryId === c.id ? " active" : "")}
          >
            {c.name}
          </Link>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="page-lede">Aucun produit ne correspond à cette recherche.</p>
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
