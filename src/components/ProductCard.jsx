import { Link } from "react-router-dom";
import { CATEGORIES } from "../data/categories";
import { formatPrice } from "../lib/format";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { add } = useCart();
  const cat = CATEGORIES.find((c) => c.id === product.category);

  return (
    <div className="product-card">
      <Link to={`/produit/${product.id}`} className="product-card-visual">
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
          <button type="button" className="btn btn-small" onClick={() => add(product.id)}>
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
