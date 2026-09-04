import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck, Warehouse } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";
import { CATEGORIES } from "../data/categories";

export default function Cart() {
  const { lines, setQty, remove, subtotal, shipping, total, count, FREE_SHIPPING_THRESHOLD } = useCart();
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  if (count === 0) {
    return (
      <section className="section cart-page">
        <div className="cart-breadcrumbs"><Link to="/">Accueil</Link><span aria-hidden="true">›</span><strong>Panier</strong></div>
        <div className="cart-empty-state">
          <div className="cart-empty-icon"><ShoppingBag size={34} strokeWidth={1.3} /></div>
          <span className="section-kicker">VOTRE SÉLECTION</span>
          <h1 className="page-title">Votre panier est encore vide</h1>
          <p>Choisissez vos combustibles et composez une commande adaptée à votre saison de chauffe.</p>
          <Link to="/catalogue" className="btn btn-primary">Découvrir le catalogue <ArrowRight size={16} /></Link>
        </div>
        <div className="cart-assurances"><span><Truck size={18} /> Livraison sur palette</span><span><ShieldCheck size={18} /> Commande accompagnée</span><span><Warehouse size={18} /> Retrait possible à Phalsbourg</span></div>
      </section>
    );
  }

  return (
    <section className="section cart-page">
      <div className="cart-breadcrumbs"><Link to="/">Accueil</Link><span aria-hidden="true">›</span><strong>Panier</strong></div>
      <div className="cart-heading"><div><span className="section-kicker">VOTRE SÉLECTION</span><h1 className="page-title">Panier <span>({count} article{count > 1 ? "s" : ""})</span></h1><p>Vérifiez vos références et choisissez ensuite le mode de réception adapté.</p></div><div className="cart-heading-mark"><ShieldCheck size={38} strokeWidth={1.2} /><span>Paiement sécurisé<br />et commande suivie</span></div></div>
      <div className="cart-shipping-progress">
        <div className="cart-shipping-copy"><span><Truck size={17} /> Livraison sur palette</span><strong>{shipping === 0 ? "La livraison est offerte pour cette commande" : `Plus que ${formatPrice(remainingForFreeShipping)} pour la livraison offerte`}</strong></div>
        <div className="cart-progress-track"><span style={{ width: `${shippingProgress}%` }} /></div>
        <div className="cart-progress-labels"><span>0 €</span><span>Livraison offerte dès {formatPrice(FREE_SHIPPING_THRESHOLD)}</span></div>
      </div>
      <div className="cart-layout">
        <div className="cart-lines">
          <div className="cart-lines-header"><span>Produit</span><span>Quantité</span><span>Total</span></div>
          {lines.map(({ product, qty, lineTotal }) => {
            const category = CATEGORIES.find((item) => item.id === product.category);
            return (
            <article className="cart-line" key={product.id}>
              <div className="cart-product-visual"><Link to={`/produit/${product.id}`} aria-label={`Voir ${product.name}`}><img src={product.image || category?.image} alt="" /></Link></div>
              <div className="cart-product-info">
                <span className="product-tag">{category?.name}</span>
                <Link to={`/produit/${product.id}`} className="product-name">{product.name}</Link>
                <span className="product-packaging">{product.packaging}</span>
                <span className="cart-unit-price">{formatPrice(product.price)} / unité</span>
              </div>
              <div className="cart-qty" aria-label={`Quantité de ${product.name}`}><button type="button" onClick={() => setQty(product.id, qty - 1)} aria-label="Diminuer"><Minus size={14} /></button><span>{qty}</span><button type="button" onClick={() => setQty(product.id, qty + 1)} aria-label="Augmenter"><Plus size={14} /></button></div>
              <div className="cart-line-total"><strong>{formatPrice(lineTotal)}</strong><button type="button" className="cart-remove" onClick={() => remove(product.id)}><Trash2 size={15} /> Retirer</button></div>
            </article>
            );
          })}
          <div className="cart-continue"><Link to="/catalogue"><ArrowLeft size={16} /> Continuer mes achats</Link><span><Check size={15} /> Prix TTC</span></div>
        </div>
        <aside className="cart-summary">
          <h2>Récapitulatif</h2>
          <div className="summary-row"><span>Sous-total</span><strong>{formatPrice(subtotal)}</strong></div>
          <div className="summary-row"><span>Livraison</span><strong>{shipping === 0 ? "Offerte" : formatPrice(shipping)}</strong></div>
          <div className="summary-total"><span>Total TTC</span><strong>{formatPrice(total)}</strong></div>
          <Link to="/commande" className="btn btn-primary btn-block cart-checkout-button">Passer la commande <ArrowRight size={17} /></Link>
          <div className="cart-summary-note"><ShieldCheck size={17} /><span>Vos données sont traitées de manière sécurisée.</span></div>
          <p className="summary-hint">Le paiement en ligne sera bientôt disponible. Nous vous confirmerons ensuite le créneau de livraison.</p>
          <div className="cart-summary-services"><span><Truck size={15} /> Livraison 6 à 8 jours</span><span><Warehouse size={15} /> Retrait à Phalsbourg</span></div>
        </aside>
      </div>
    </section>
  );
}
