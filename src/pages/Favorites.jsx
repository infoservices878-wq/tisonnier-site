import { ArrowRight, Heart, Leaf, PackageCheck, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { PRODUCTS } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useFavorites } from "../context/FavoritesContext";

export default function Favorites() {
  const { favoriteIds } = useFavorites();
  const favorites = favoriteIds.map((id) => PRODUCTS.find((product) => product.id === id)).filter(Boolean);

  return (
    <section className="section account-page">
      <div className="account-hero account-hero-ember">
        <div>
          <span className="section-kicker">IHRE AUSWAHL</span>
          <h1 className="page-title">Ihre Favoriten immer griffbereit.</h1>
          <p>Speichern Sie Brennstoffe, die Sie vergleichen oder später wieder bestellen möchten.</p>
        </div>
        <Heart size={58} strokeWidth={1.1} />
      </div>
      {favorites.length === 0 ? <div className="favorites-empty"><div className="favorites-empty-icon"><Heart size={28} /></div><span className="section-kicker">Keine Favoriten gespeichert</span><h2>Ihre Auswahl ist noch leer.</h2><p>Durchsuchen Sie den Katalog und speichern Sie interessante Produkte für später.</p><Link to="/catalogue" className="btn btn-primary">Katalog ansehen <ArrowRight size={16} /></Link></div> : <div className="favorites-results"><div className="favorites-results-heading"><div><span className="section-kicker">{favorites.length} Produkt(e) gespeichert</span><h2>Ihre Favoriten</h2></div><Trash2 size={22} aria-hidden="true" /></div><div className="product-grid">{favorites.map((product) => <ProductCard key={product.id} product={product} />)}</div></div>}
      <div className="favorites-points"><div><PackageCheck size={21} /><strong>Schneller vergleichen</strong><span>Interessante Produkte jederzeit wiederfinden.</span></div><div><Leaf size={21} /><strong>Bewusst auswählen</strong><span>Ihre Kriterien und Gewohnheiten im Blick behalten.</span></div></div>
    </section>
  );
}
