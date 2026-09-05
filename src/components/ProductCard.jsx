import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { CATEGORIES } from "../data/categories";
import { formatPrice } from "../lib/format";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";

export default function ProductCard({ product }) {
  const { add } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const cat = CATEGORIES.find((c) => c.id === product.category);

  return (
    <div className="product-card">
      <div className="product-card-visual">
        <Link to={`/produit/${product.id}`} className="product-card-image-link" aria-label={`Voir ${product.name}`}>
          {(product.image || cat?.image) && (
            <img src={product.image || cat.image} alt={product.name} loading="lazy" />
          )}
          <span className="product-card-icon" aria-hidden>
            {cat?.icon ? <cat.icon size={36} strokeWidth={1.3} /> : null}
          </span>
        </Link>
        <button
          type="button"
          className={`favorite-button${isFavorite(product.id) ? " is-favorite" : ""}`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleFavorite(product.id);
          }}
          aria-label={isFavorite(product.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart size={17} fill={isFavorite(product.id) ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="product-card-body">
        <span className="product-tag">{cat?.name}</span>
        <Link to={`/produit/${product.id}`} className="product-name">
          {product.name}
        </Link>
        <span className="product-packaging">{product.packaging}</span>
        <div className="product-card-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
          <button type="button" className="btn btn-primary add-cart-button checkout-action-button" onClick={() => add(product.id)}>
            <ShoppingCart size={16} strokeWidth={1.8} />
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
