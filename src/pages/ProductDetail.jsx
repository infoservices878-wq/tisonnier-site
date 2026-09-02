import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getProductById } from "../data/products";
import { CATEGORIES } from "../data/categories";
import { formatPrice } from "../lib/format";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { productId } = useParams();
  const product = getProductById(productId);
  const { add } = useCart();

  if (!product) {
    return (
      <section className="section">
        <h1 className="page-title">Produit introuvable</h1>
        <Link to="/catalogue" className="btn btn-primary">Retour au catalogue</Link>
      </section>
    );
  }

  const cat = CATEGORIES.find((c) => c.id === product.category);

  return (
    <section className="section product-detail">
      <Link to="/catalogue" className="back-link">
        <ArrowLeft size={16} /> Retour au catalogue
      </Link>
      <div className="product-detail-grid">
        <div className="product-detail-visual">
          {cat?.icon ? <cat.icon size={64} strokeWidth={1.2} /> : null}
        </div>
        <div className="product-detail-info">
          <span className="product-tag">{cat?.name}</span>
          <h1 className="page-title" style={{ marginBottom: 8 }}>{product.name}</h1>
          <p className="product-packaging">{product.packaging}</p>
          <p className="product-stock">{product.stock}</p>
          <p className="product-price-lg">{formatPrice(product.price)}</p>
          <p className="page-lede" style={{ marginTop: 12 }}>{product.description}</p>
          <button type="button" className="btn btn-primary" onClick={() => add(product.id)}>
            Ajouter au panier
          </button>
          {product.specs?.length > 0 && (
            <table className="specs-table">
              <tbody>
                {product.specs.map(([k, v]) => (
                  <tr key={k}>
                    <th>{k}</th>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}
