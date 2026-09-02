import { Link } from "react-router-dom";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";

export default function Cart() {
  const { lines, setQty, remove, subtotal, shipping, total, count, FREE_SHIPPING_THRESHOLD } = useCart();

  if (count === 0) {
    return (
      <section className="section">
        <h1 className="page-title">Panier</h1>
        <div className="empty-state">
          <p>Votre panier est vide.</p>
          <Link to="/catalogue" className="btn btn-primary">Parcourir le catalogue</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <h1 className="page-title">Panier ({count})</h1>
      <div className="cart-layout">
        <div className="cart-lines">
          {lines.map(({ product, qty, lineTotal }) => (
            <div className="cart-line" key={product.id}>
              <div>
                <Link to={`/produit/${product.id}`} className="product-name">{product.name}</Link>
                <span className="product-packaging">{product.packaging}</span>
              </div>
              <div className="cart-qty">
                <button type="button" onClick={() => setQty(product.id, qty - 1)} aria-label="Diminuer">
                  <Minus size={14} />
                </button>
                <span>{qty}</span>
                <button type="button" onClick={() => setQty(product.id, qty + 1)} aria-label="Augmenter">
                  <Plus size={14} />
                </button>
              </div>
              <span className="product-price">{formatPrice(lineTotal)}</span>
              <button type="button" className="icon-btn" onClick={() => remove(product.id)} aria-label="Retirer">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <aside className="cart-summary">
          <h2>Récapitulatif</h2>
          <div className="summary-row"><span>Sous-total</span><span>{formatPrice(subtotal)}</span></div>
          <div className="summary-row"><span>Livraison</span><span>{shipping === 0 ? "Offerte" : formatPrice(shipping)}</span></div>
          {shipping > 0 && (
            <p className="summary-hint">
              Plus que {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} pour la livraison offerte.
            </p>
          )}
          <div className="summary-row summary-total"><span>Total</span><span>{formatPrice(total)}</span></div>
          <button type="button" className="btn btn-primary btn-block" disabled>
            Commander (démo)
          </button>
          <p className="summary-hint">Paiement réel à brancher via WooCommerce.</p>
        </aside>
      </div>
    </section>
  );
}
