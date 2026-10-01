import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Heart, Minus, Plus, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { getProductById } from "../data/products";
import { CATEGORIES } from "../data/categories";
import { formatPrice } from "../lib/format";
import { versionedImageUrl } from "../lib/versionedImageUrl";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";

export default function ProductDetail() {
  const { productId } = useParams();
  const product = getProductById(productId);
  const { add, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <section className="section">
        <h1 className="page-title">Produkt nicht gefunden</h1>
        <Link to="/katalog" className="btn btn-primary">Zurück zum Katalog</Link>
      </section>
    );
  }

  // Keep external links and search-engine entries that use the old internal
  // (French) identifiers working, but always expose the German URL.
  if (productId !== product.slug) {
    return <Navigate to={`/produkt/${product.slug}`} replace />;
  }

  const cat = CATEGORIES.find((c) => c.id === product.category);
  const highlights = [
    ["Marke", product.brand || "Holzbrennstoffe"],
    ["Artikelnummer", product.reference || product.id],
    ["Verpackung", product.packaging],
    ...(product.specs || []).slice(0, 3),
  ];

  const addToCart = () => {
    add(product.id, quantity);
    setAdded(true);
  };

  return (
    <section className="section product-page">
      <nav className="product-breadcrumbs" aria-label="Brotkrümelnavigation">
        <Link to="/">Startseite</Link>
        <span className="product-breadcrumb-separator" aria-hidden="true">›</span>
        <Link to={`/katalog/${cat?.slug}`}>{cat?.name}</Link>
        <span className="product-breadcrumb-separator" aria-hidden="true">›</span>
        <strong aria-current="page">{product.name}</strong>
      </nav>

      <div className="product-detail-grid">
        <div className="product-gallery">
          <div className="product-detail-visual">
            {(product.image || cat?.image) && <img src={versionedImageUrl(product.image || cat.image)} alt={product.name} decoding="async" />}
            <span className="product-gallery-label">{cat?.name}</span>
          </div>
          <div className="product-gallery-note"><Check size={16} /> Professionelle Palettenverpackung</div>
        </div>

        <div className="product-detail-info">
          <span className="product-tag">{cat?.name}</span>
          <div className="product-title-row">
            <h1 className="product-detail-title">{product.name}</h1>
            <button
              type="button"
              className={`favorite-button favorite-button-detail${isFavorite(product.id) ? " is-favorite" : ""}`}
              onClick={() => toggleFavorite(product.id)}
              aria-label={isFavorite(product.id) ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
            >
              <Heart size={19} fill={isFavorite(product.id) ? "currentColor" : "none"} />
            </button>
          </div>
          <p className="product-detail-reference">Artikelnummer: {product.reference || product.id}{product.brand && ` · Marke: ${product.brand}`}</p>
          <p className="product-detail-description">{product.description}</p>
          <div className="product-highlights">
            {highlights.map(([label, value]) => (
              <div key={label}><span>{label}</span><strong>{value}</strong></div>
            ))}
          </div>
          <div className="product-purchase-box">
            <div className="product-price-row">
              <strong className="product-price-lg">
                {formatPrice(product.promoPrice ?? product.price)}
                {product.promoPrice && <del>{formatPrice(product.price)}</del>}
              </strong>
              <span className="product-price-note">Preis inkl. MwSt. · pro Einheit</span>
            </div>
            <div className="product-stock-line"><Check size={16} /> {product.stock}</div>
            <p className="product-packaging product-packaging-highlight">{product.packaging}</p>
            <div className="product-buy-row">
              <div className="quantity-control" aria-label="Menge">
                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Menge verringern"><Minus size={16} /></button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label="Menge erhöhen"><Plus size={16} /></button>
              </div>
              <button type="button" className="btn btn-primary add-cart-button product-add-button checkout-action-button" onClick={addToCart}>
                {added ? <><Check size={17} /> Zum Warenkorb hinzugefügt</> : <><ShoppingCart size={17} /> In den Warenkorb</>}
              </button>
            </div>
            {added && <Link to="/warenkorb" className="product-cart-link">Warenkorb anzeigen →</Link>}
          </div>
          <div className="product-service-list">
            <div><Truck size={20} /><span><strong>Palettenlieferung</strong><small>Kostenlos ab {formatPrice(FREE_SHIPPING_THRESHOLD)}, sonst {formatPrice(SHIPPING_FEE)}</small></span></div>
            <div><ShieldCheck size={20} /><span><strong>Planbare Bestellung</strong><small>Schriftliche Bestätigung und Lieferinformation</small></span></div>
            <div><ShieldCheck size={20} /><span><strong>Persönlicher Service</strong><small>Wichtige Informationen vor dem Versand</small></span></div>
          </div>
        </div>
      </div>

      {product.specs?.length > 0 && (
        <section className="product-specs-section">
          <div className="product-overview">
            <span className="section-kicker">PRODUKTINFORMATIONEN</span>
            <h2 className="product-section-title">Produkt und Paletteninhalt</h2>
            <p className="product-section-lede">Professionell verpackt für einfachen Transport, trockene Lagerung und die tägliche Nutzung.</p>
            <div className="product-info-cards">
              <article><h3>Ihre Vorteile</h3><ul>{(product.benefits || []).map((benefit) => <li key={benefit}>{benefit}</li>)}</ul></article>
              <article><h3>Produktaufbereitung</h3><p>{product.preparation || "Sorgfältig für den Transport vorbereitet und verpackt."}</p></article>
              <article><h3>Anwendung</h3><p>{product.usage || "Für Geräte geeignet, die mit dieser Brennstoffkategorie betrieben werden können."}</p></article>
              <article><h3>Lagerung</h3><p>{product.storage || "Trocken und vor Feuchtigkeit geschützt lagern."}</p></article>
              <article className="product-reception-card"><h3>Warenannahme vorbereiten</h3><p>{product.delivery || "Bitte halten Sie eine für das Lieferfahrzeug zugängliche Fläche und eine Möglichkeit zum Bewegen der Palette bereit."}</p><div><span>Kostenlose Lieferung ab {formatPrice(FREE_SHIPPING_THRESHOLD)}</span><span>Vorbereitung 1–2 Tage · Lieferung 3–5 Tage</span></div></article>
            </div>
          </div>
          <aside className="product-specs-panel">
            <h2>Technische Daten</h2>
            <table className="specs-table">
              <tbody>{product.specs.map(([key, value]) => <tr key={key}><th>{key}</th><td>{value}</td></tr>)}</tbody>
            </table>
          </aside>
        </section>
      )}
    </section>
  );
}
