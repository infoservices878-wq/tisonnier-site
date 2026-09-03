import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { CATEGORIES } from "../data/categories";
import { formatPrice } from "../lib/format";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { add } = useCart();
  const cat = CATEGORIES.find((c) => c.id === product.category);

  return (
    <div className="product-card">
      <Link to={`/produit/${product.id}`} className="product-card-visual">
        {(product.image || cat?.image) && (
          <img src={product.image || cat.image} alt={product.name} loading="lazy" />
        )}
        <span className="product-card-icon" aria-hidden>
          {cat?.icon ? <cat.icon size={36} strokeWidth={1.3} /> : null}
        </span>
      </Link>
      <div className="product-card-body">
        <span className="product-tag">{cat?.name}</span>
        <Link to={`/produit/${product.id}`} className="product-name">
          {product.name}
        </Link>
        <span className="product-packaging">{product.packaging}</span>
        <div className="product-card-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
          <button type="button" className="btn add-cart-button" onClick={() => add(product.id)}>
            <ShoppingCart size={16} strokeWidth={1.8} />
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
