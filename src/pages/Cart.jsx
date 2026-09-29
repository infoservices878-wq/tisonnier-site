import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";
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
        <div className="cart-breadcrumbs"><Link to="/">Startseite</Link><span aria-hidden="true">›</span><strong>Warenkorb</strong></div>
        <div className="cart-empty-state">
          <div className="cart-empty-icon"><ShoppingBag size={34} strokeWidth={1.3} /></div>
          <span className="section-kicker">IHRE AUSWAHL</span>
          <h1 className="page-title">Ihr Warenkorb ist noch leer</h1>
          <p>Wählen Sie Ihre Brennstoffe und stellen Sie Ihre Bestellung für die Heizsaison zusammen.</p>
          <Link to="/catalogue" className="btn btn-primary">Katalog entdecken <ArrowRight size={16} /></Link>
        </div>
        <div className="cart-assurances"><span><Truck size={18} /> Palettenversand</span><span><ShieldCheck size={18} /> Persönlicher Service</span><span><Check size={18} /> Schriftliche Bestätigung</span></div>
      </section>
    );
  }

  return (
    <section className="section cart-page">
      <div className="cart-breadcrumbs"><Link to="/">Startseite</Link><span aria-hidden="true">›</span><strong>Warenkorb</strong></div>
      <div className="cart-heading"><div><span className="section-kicker">IHRE AUSWAHL</span><h1 className="page-title">Warenkorb <span>({count} Artikel)</span></h1><p>Prüfen Sie Ihre Auswahl und bereiten Sie Ihre Lieferadresse vor.</p></div><div className="cart-heading-mark"><ShieldCheck size={38} strokeWidth={1.2} /><span>Sichere Datenverarbeitung<br />und planbare Bestellung</span></div></div>
      <div className="cart-shipping-progress">
        <div className="cart-shipping-copy"><span><Truck size={17} /> Palettenlieferung</span><strong>{shipping === 0 ? "Für diese Bestellung ist die Lieferung kostenlos" : `Noch ${formatPrice(remainingForFreeShipping)} bis zur kostenlosen Lieferung`}</strong></div>
        <div className="cart-progress-track"><span style={{ width: `${shippingProgress}%` }} /></div>
        <div className="cart-progress-labels"><span>0 €</span><span>Kostenlose Lieferung ab {formatPrice(FREE_SHIPPING_THRESHOLD)}</span></div>
      </div>
      <div className="cart-layout">
        <div className="cart-lines">
          <div className="cart-lines-header"><span>Produkt</span><span>Menge</span><span>Gesamt</span></div>
          {lines.map(({ product, qty, lineTotal }) => {
            const category = CATEGORIES.find((item) => item.id === product.category);
            return (
            <article className="cart-line" key={product.id}>
              <div className="cart-product-visual"><Link to={`/produit/${product.id}`} aria-label={`${product.name} ansehen`}><img src={product.image || category?.image} alt="" /></Link></div>
              <div className="cart-product-info">
                <span className="product-tag">{category?.name}</span>
                <Link to={`/produit/${product.id}`} className="product-name">{product.name}</Link>
                <span className="product-packaging">{product.packaging}</span>
                <span className="cart-unit-price">{formatPrice(product.price)} / Einheit</span>
              </div>
              <div className="cart-qty" aria-label={`Menge von ${product.name}`}><button type="button" onClick={() => setQty(product.id, qty - 1)} aria-label="Verringern"><Minus size={14} /></button><span>{qty}</span><button type="button" onClick={() => setQty(product.id, qty + 1)} aria-label="Erhöhen"><Plus size={14} /></button></div>
              <div className="cart-line-total"><strong>{formatPrice(lineTotal)}</strong><button type="button" className="cart-remove" onClick={() => remove(product.id)}><Trash2 size={15} /> Entfernen</button></div>
            </article>
            );
          })}
          <div className="cart-continue"><Link to="/catalogue"><ArrowLeft size={16} /> Weiter einkaufen</Link><span><Check size={15} /> Preise inkl. MwSt.</span></div>
        </div>
        <aside className="cart-summary">
          <h2>Zusammenfassung</h2>
          <div className="summary-row"><span>Zwischensumme</span><strong>{formatPrice(subtotal)}</strong></div>
          <div className="summary-row"><span>Lieferung</span><strong>{shipping === 0 ? "Kostenlos" : formatPrice(shipping)}</strong></div>
          <div className="summary-total"><span>Gesamt inkl. MwSt.</span><strong>{formatPrice(total)}</strong></div>
          <Link to="/commande" className="btn btn-primary btn-block cart-checkout-button">Bestellung anfragen <ArrowRight size={17} /></Link>
          <div className="cart-summary-note"><ShieldCheck size={17} /><span>Ihre Daten werden sicher verarbeitet.</span></div>
          <p className="summary-hint">Nach Ihrer Anfrage erhalten Sie eine Auftragsbestätigung mit den Lieferdetails.</p>
          <div className="cart-summary-services"><span><Truck size={15} /> Lieferung in 6–8 Werktagen</span><span><Check size={15} /> Planbare Warenannahme</span></div>
        </aside>
      </div>
    </section>
  );
}
