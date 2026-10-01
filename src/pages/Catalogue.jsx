import { useParams, useSearchParams, Link, Navigate } from "react-router-dom";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { CATEGORIES } from "../data/categories";
import { filterProducts } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Catalogue() {
  const { categoryId } = useParams();
  const [params] = useSearchParams();
  const search = params.get("q") || "";

  const activeCat = CATEGORIES.find((c) => c.id === categoryId || c.slug === categoryId);
  const filtered = filterProducts({ category: activeCat?.id || categoryId || null, search });

  // Redirect legacy French/internal category paths to their German public URL.
  if (activeCat && categoryId !== activeCat.slug) {
    const query = params.toString();
    return <Navigate replace to={`/katalog/${activeCat.slug}${query ? `?${query}` : ""}`} />;
  }

  return (
    <section className="section">
      <div className="catalogue-intro-bar">
        <div>
          <span className="section-kicker">AM Holzbrennstoffe UG · FÜR PROFIS UND PRIVATKUNDEN</span>
          <p>{activeCat ? `${filtered.length} Produkt(e) in dieser Kategorie` : "Brennstoffe einfach vergleichen und auswählen"}</p>
        </div>
        <Link to="/kontakt" className="catalogue-help-link">Beratung gewünscht? <ArrowRight size={15} /></Link>
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
              to="/katalog"
              className="filter-chip active"
            >
              Alle
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                to={`/katalog/${c.slug}`}
                className="filter-chip"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </>
      )}
      {activeCat && <div className="catalogue-active-note"><SlidersHorizontal size={16} /><span>Aktiver Filter: <strong>{activeCat.name}</strong></span><Link to="/katalog">Alle anzeigen</Link></div>}
      {filtered.length === 0 ? (
        <div className="empty-state"><p>Keine Produkte entsprechen Ihrer Suche.</p><Link to="/katalog" className="btn btn-primary">Suche zurücksetzen</Link></div>
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
