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
          <span className="section-kicker">VOTRE SÉLECTION</span>
          <h1 className="page-title">Gardez vos références préférées sous la main.</h1>
          <p>Ajoutez les combustibles que vous souhaitez comparer ou recommander, puis retrouvez-les facilement lors de votre prochaine visite.</p>
        </div>
        <Heart size={58} strokeWidth={1.1} />
      </div>
      {favorites.length === 0 ? <div className="favorites-empty"><div className="favorites-empty-icon"><Heart size={28} /></div><span className="section-kicker">Aucune référence enregistrée</span><h2>Votre sélection est encore vide.</h2><p>Explorez le catalogue pour comparer les conditionnements et conserver vos produits favoris.</p><Link to="/catalogue" className="btn btn-primary">Parcourir le catalogue <ArrowRight size={16} /></Link></div> : <div className="favorites-results"><div className="favorites-results-heading"><div><span className="section-kicker">{favorites.length} référence(s) enregistrée(s)</span><h2>Vos produits favoris</h2></div><Trash2 size={22} aria-hidden="true" /></div><div className="product-grid">{favorites.map((product) => <ProductCard key={product.id} product={product} />)}</div></div>}
      <div className="favorites-points"><div><PackageCheck size={21} /><strong>Comparer plus vite</strong><span>Retrouvez les références qui vous intéressent.</span></div><div><Leaf size={21} /><strong>Choisir avec attention</strong><span>Gardez vos critères et vos habitudes en tête.</span></div></div>
    </section>
  );
}
