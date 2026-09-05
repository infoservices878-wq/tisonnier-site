import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Heart, Minus, Plus, ShieldCheck, ShoppingCart, Truck, Warehouse } from "lucide-react";
import { getProductById } from "../data/products";
import { CATEGORIES } from "../data/categories";
import { formatPrice } from "../lib/format";
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
        <h1 className="page-title">Produit introuvable</h1>
        <Link to="/catalogue" className="btn btn-primary">Retour au catalogue</Link>
      </section>
    );
  }

  const cat = CATEGORIES.find((c) => c.id === product.category);
  const highlights = [
    ["Marque", product.brand || "Ossau Bois"],
    ["Référence", product.reference || product.id],
    ["Conditionnement", product.packaging],
    ...(product.specs || []).slice(0, 3),
  ];

  const addToCart = () => {
    add(product.id, quantity);
    setAdded(true);
  };

  return (
    <section className="section product-page">
      <nav className="product-breadcrumbs" aria-label="Fil d’Ariane">
        <Link to="/">Accueil</Link>
        <span className="product-breadcrumb-separator" aria-hidden="true">›</span>
        <Link to={`/catalogue/${product.category}`}>{cat?.name}</Link>
        <span className="product-breadcrumb-separator" aria-hidden="true">›</span>
        <strong aria-current="page">{product.name}</strong>
      </nav>

      <div className="product-detail-grid">
        <div className="product-gallery">
          <div className="product-detail-visual">
            {(product.image || cat?.image) && <img src={product.image || cat.image} alt={product.name} />}
            <span className="product-gallery-label">{cat?.name}</span>
          </div>
          <div className="product-gallery-note"><Check size={16} /> Conditionnement professionnel sur palette</div>
        </div>

        <div className="product-detail-info">
          <span className="product-tag">{cat?.name}</span>
          <div className="product-title-row">
            <h1 className="product-detail-title">{product.name}</h1>
            <button
              type="button"
              className={`favorite-button favorite-button-detail${isFavorite(product.id) ? " is-favorite" : ""}`}
              onClick={() => toggleFavorite(product.id)}
              aria-label={isFavorite(product.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart size={19} fill={isFavorite(product.id) ? "currentColor" : "none"} />
            </button>
          </div>
          <p className="product-detail-reference">Référence : {product.reference || product.id}{product.brand && ` · Marque : ${product.brand}`}</p>
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
              <span className="product-price-note">Prix TTC · par unité</span>
            </div>
            <div className="product-stock-line"><Check size={16} /> {product.stock}</div>
            <p className="product-packaging product-packaging-highlight">{product.packaging}</p>
            <div className="product-buy-row">
              <div className="quantity-control" aria-label="Quantité">
                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Diminuer la quantité"><Minus size={16} /></button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label="Augmenter la quantité"><Plus size={16} /></button>
              </div>
              <button type="button" className="btn btn-primary add-cart-button product-add-button checkout-action-button" onClick={addToCart}>
                {added ? <><Check size={17} /> Ajouté au panier</> : <><ShoppingCart size={17} /> Ajouter au panier</>}
              </button>
            </div>
            {added && <Link to="/panier" className="product-cart-link">Voir mon panier →</Link>}
          </div>
          <div className="product-service-list">
            <div><Truck size={20} /><span><strong>Livraison sur palette</strong><small>Offerte dès {formatPrice(FREE_SHIPPING_THRESHOLD)}, sinon {formatPrice(SHIPPING_FEE)}</small></span></div>
            <div><Warehouse size={20} /><span><strong>Retrait sur rendez-vous</strong><small>Point de retrait à Phalsbourg, véhicule adapté requis</small></span></div>
            <div><ShieldCheck size={20} /><span><strong>Commande accompagnée</strong><small>Confirmation écrite et créneau de livraison communiqué</small></span></div>
          </div>
        </div>
      </div>

      {product.specs?.length > 0 && (
        <section className="product-specs-section">
          <div className="product-overview">
            <span className="section-kicker">Fiche technique</span>
            <h2 className="product-section-title">Produit et contenu de la palette</h2>
            <p className="product-section-lede">Une sélection professionnelle, conditionnée pour simplifier le transport, le stockage et l’utilisation au quotidien.</p>
            <div className="product-info-cards">
              <article><h3>Principaux avantages</h3><ul>{(product.benefits || []).map((benefit) => <li key={benefit}>{benefit}</li>)}</ul></article>
              <article><h3>Comment le produit est-il préparé ?</h3><p>{product.preparation || "Produit préparé et conditionné avec soin pour le transport."}</p></article>
              <article><h3>Utilisation</h3><p>{product.usage || "Adapté aux appareils compatibles avec cette catégorie de combustible."}</p></article>
              <article><h3>Stockage</h3><p>{product.storage || "Conserver dans un espace sec et protégé de l’humidité."}</p></article>
              <article className="product-reception-card"><h3>Préparer la réception</h3><p>{product.delivery || "Prévoyez une zone accessible au véhicule de livraison et un moyen de déplacer la palette."}</p><div><span>Livraison offerte dès {formatPrice(FREE_SHIPPING_THRESHOLD)}</span><span>Délai indicatif : 7 jours</span></div></article>
            </div>
          </div>
          <aside className="product-specs-panel">
            <h2>Caractéristiques techniques</h2>
            <table className="specs-table">
              <tbody>{product.specs.map(([key, value]) => <tr key={key}><th>{key}</th><td>{value}</td></tr>)}</tbody>
            </table>
          </aside>
        </section>
      )}
    </section>
  );
}
