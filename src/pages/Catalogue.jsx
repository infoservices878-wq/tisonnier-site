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
          <span className="section-kicker">AM Holzbrennstoffe UG · FÜR PROFIS UND PRIVATKUNDEN</span>
          <p>{activeCat ? `${filtered.length} Produkt(e) in dieser Kategorie` : "Brennstoffe einfach vergleichen und auswählen"}</p>
        </div>
        <Link to="/contact" className="catalogue-help-link">Beratung gewünscht? <ArrowRight size={15} /></Link>
      </div>
      {!activeCat && (
        <>
          <h1 className="page-title">Katalog</h1>
          <p className="page-lede">
            {search
              ? `${filtered.length} Ergebnis(se) für „${search}“`
              : `${filtered.length} Produkte verfügbar – als Palette oder in handlichen Verpackungen für das Anzünden.`}
          </p>
          <div className="filter-row">
            <Link
              to="/catalogue"
              className="filter-chip active"
            >
              Alle
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
      {activeCat && <div className="catalogue-active-note"><SlidersHorizontal size={16} /><span>Aktiver Filter: <strong>{activeCat.name}</strong></span><Link to="/catalogue">Alle anzeigen</Link></div>}
      {filtered.length === 0 ? (
        <div className="empty-state"><p>Keine Produkte entsprechen Ihrer Suche.</p><Link to="/catalogue" className="btn btn-primary">Suche zurücksetzen</Link></div>
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
