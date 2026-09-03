import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu, X, ShoppingCart, Search, Globe, ChevronDown, MessageCircle, ClipboardList,
} from "lucide-react";
import Logo from "./Logo";
import { CATEGORIES } from "../data/categories";
import { PRODUCTS } from "../data/products";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "../data/products";

export default function Header() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const normalizedSearch = search.trim().toLowerCase();
  const suggestions = normalizedSearch
    ? [
        ...CATEGORIES
          .filter((category) => category.name.toLowerCase().includes(normalizedSearch))
          .map((category) => ({
            key: `category-${category.id}`,
            label: category.name,
            type: "Catégorie",
            to: `/catalogue?q=${encodeURIComponent(category.name)}`,
          })),
        ...PRODUCTS
          .filter((product) => product.name.toLowerCase().includes(normalizedSearch))
          .map((product) => ({
            key: `product-${product.id}`,
            label: product.name,
            type: "Produit",
            to: `/catalogue?q=${encodeURIComponent(product.name)}`,
          })),
      ].slice(0, 5)
    : [];

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(search ? `/catalogue?q=${encodeURIComponent(search)}` : "/catalogue");
    setShowSuggestions(false);
    setMenuOpen(false);
  };

  const close = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="topbar">
        <span className="topbar-item topbar-shipping">
          Livraison offerte dès {formatPrice(FREE_SHIPPING_THRESHOLD)} · sinon {formatPrice(SHIPPING_FEE)} · délai de 6 à 8 jours
        </span>
        <span className="topbar-item topbar-legal">OSSAU BOIS SAS · Vente de combustibles solides</span>
        <div className="topbar-item topbar-country" aria-label="Pays de livraison sélectionné">
          <Globe size={14} strokeWidth={1.8} />
          <span>Livraison en</span>
          <strong>FR · Français</strong>
          <ChevronDown size={13} strokeWidth={1.8} />
        </div>
      </div>

      <div className="nav-main">
        <Logo />
        <form className="search-bar nav-search-wrap" onSubmit={submitSearch}>
          <Search size={17} strokeWidth={1.8} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un combustible ou un produit"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            aria-label="Rechercher un produit"
          />
          {search && (
            <button
              type="button"
              className="search-clear"
              onClick={() => {
                setSearch("");
                setShowSuggestions(false);
              }}
              aria-label="Effacer la recherche"
            >
              <X size={15} strokeWidth={2} />
            </button>
          )}
          <button type="submit" className="search-submit">Rechercher</button>
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions" role="listbox" aria-label="Suggestions de recherche">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.key}
                  type="button"
                  className="search-suggestion"
                  onClick={() => {
                    setSearch(suggestion.label);
                    setShowSuggestions(false);
                    navigate(suggestion.to);
                  }}
                >
                  <span className="search-suggestion-label">{suggestion.label}</span>
                  <span className="search-suggestion-type">{suggestion.type}</span>
                </button>
              ))}
            </div>
          )}
        </form>
        <div className="nav-actions">
          <Link to="/contact" className="action-btn">
            <MessageCircle size={20} strokeWidth={1.6} />
            <span>Contact</span>
          </Link>
          <Link to="/livraison" className="action-btn">
            <ClipboardList size={20} strokeWidth={1.6} />
            <span>Livraison</span>
          </Link>
          <Link to="/panier" className="action-btn cart-btn" aria-label="Voir le panier">
            <span className="action-btn-icon-wrap">
              <ShoppingCart size={20} strokeWidth={1.6} />
              {count > 0 && <span className="cart-count">{count}</span>}
            </span>
            <span>Panier</span>
          </Link>
          <button
            type="button"
            className="icon-btn menu-toggle"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <nav className="category-nav" aria-label="Catalogue">
          <NavLink end to="/catalogue" className={({ isActive }) => "category-nav-link category-nav-primary" + (isActive ? " active" : "") }>
          <span className="category-nav-swatch" />
          Catalogue
        </NavLink>
        {CATEGORIES.map((c) => (
          <NavLink
            key={c.id}
            to={`/catalogue/${c.id}`}
            className={({ isActive }) => "category-nav-link" + (isActive ? " active" : "")}
          >
            {c.name}
          </NavLink>
        ))}
        <span className="category-nav-spacer" />
        <NavLink to="/livraison" className={({ isActive }) => "category-nav-link" + (isActive ? " active" : "")}>Livraison</NavLink>
        <NavLink to="/entreprise" className={({ isActive }) => "category-nav-link" + (isActive ? " active" : "")}>Entreprise</NavLink>
        <NavLink to="/faq" className={({ isActive }) => "category-nav-link" + (isActive ? " active" : "")}>FAQ</NavLink>
        <NavLink to="/contact" className={({ isActive }) => "category-nav-link" + (isActive ? " active" : "")}>Contact</NavLink>
      </nav>

      {menuOpen && (
        <div className="nav-drawer">
          <Link to="/" className="nav-drawer-link" onClick={close}>Accueil</Link>
          <Link to="/catalogue" className="nav-drawer-link" onClick={close}>Catalogue</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.id} to={`/catalogue/${c.id}`} className="nav-drawer-link nav-drawer-sub" onClick={close}>
              {c.name}
            </Link>
          ))}
          <Link to="/livraison" className="nav-drawer-link" onClick={close}>Livraison</Link>
          <Link to="/entreprise" className="nav-drawer-link" onClick={close}>Entreprise</Link>
          <Link to="/faq" className="nav-drawer-link" onClick={close}>FAQ</Link>
          <Link to="/contact" className="nav-drawer-link" onClick={close}>Contact</Link>
          <Link to="/panier" className="nav-drawer-link" onClick={close}>Panier ({count})</Link>
        </div>
      )}
    </header>
  );
}
