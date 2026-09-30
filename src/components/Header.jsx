import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu, X, ShoppingCart, Search, Truck, ChevronDown, UserRound, Heart, Phone,
} from "lucide-react";
import Logo from "./Logo";
import { CATEGORIES } from "../data/categories";
import { PRODUCTS } from "../data/products";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAccount } from "../context/AccountContext";
import { formatPrice } from "../lib/format";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "../data/products";
import { COMPANY } from "../data/legalContent";

export default function Header() {
  const { count } = useCart();
  const { favoriteCount } = useFavorites();
  const { account } = useAccount();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();

  const normalizedSearch = search.trim().toLowerCase();
  const suggestions = normalizedSearch
    ? [
        ...CATEGORIES
          .filter((category) => category.name.toLowerCase().includes(normalizedSearch))
          .map((category) => ({
            key: `category-${category.id}`,
            label: category.name,
            type: "Kategorie",
            to: `/catalogue?q=${encodeURIComponent(category.name)}`,
          })),
        ...PRODUCTS
          .filter((product) => product.name.toLowerCase().includes(normalizedSearch))
          .map((product) => ({
            key: `product-${product.id}`,
            label: product.name,
            type: "Produkt",
            to: `/catalogue?q=${encodeURIComponent(product.name)}`,
          })),
      ].slice(0, 5)
    : [];

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(search ? `/catalogue?q=${encodeURIComponent(search)}` : "/catalogue");
    setShowSuggestions(false);
    setMenuOpen(false);
    setMobileSearchOpen(false);
  };

  const close = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="topbar-info">
          <span className="topbar-shipping">Aktionspreise auf feste Brennstoffe · Palettenversand</span>
          <span className="topbar-legal">AM Holzbrennstoffe UG · Handel mit festen Brennstoffen</span>
        </div>
        <div className="topbar-actions">
          {COMPANY.phone && <a className="topbar-phone" href={COMPANY.phoneHref} aria-label={`Kundenservice anrufen: ${COMPANY.phone}`} title={COMPANY.phoneNotice}><Phone size={14} strokeWidth={1.8} /><span>{COMPANY.phone}</span></a>}
          <div className="topbar-country" aria-label="Ausgewähltes Lieferland">
            <Truck size={14} strokeWidth={1.8} />
            <strong>DE · EUR</strong>
            <ChevronDown size={13} strokeWidth={1.8} />
          </div>
        </div>
      </div>

      <div className="nav-main">
        <Logo />
        <form className="search-bar nav-search-wrap" onSubmit={submitSearch}>
          <Search size={17} strokeWidth={1.8} className="search-icon" />
          <input
            type="text"
            placeholder="Brennstoff oder Produkt suchen"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            aria-label="Produkt suchen"
          />
          {search && (
            <button
              type="button"
              className="search-clear"
              onClick={() => {
                setSearch("");
                setShowSuggestions(false);
              }}
              aria-label="Suche löschen"
            >
              <X size={15} strokeWidth={2} />
            </button>
          )}
          <button type="submit" className="search-submit"><Search size={17} strokeWidth={1.8} className="search-submit-icon" /><span>Suchen</span></button>
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions" role="listbox" aria-label="Suchvorschläge">
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
          <button
            type="button"
            className="icon-btn mobile-search-toggle"
            onClick={() => {
              setMobileSearchOpen((open) => !open);
              setMenuOpen(false);
              setShowSuggestions(false);
            }}
            aria-label={mobileSearchOpen ? "Suche schließen" : "Suche öffnen"}
            title={mobileSearchOpen ? "Suche schließen" : "Suche öffnen"}
          >
            {mobileSearchOpen ? <X size={21} /> : <Search size={20} strokeWidth={1.8} />}
          </button>
          <Link to="/connexion" className="action-btn">
            <UserRound size={20} strokeWidth={1.6} />
            <span>{account ? account.name : "Anmelden"}</span>
          </Link>
          <Link to="/favoris" className="action-btn">
            <span className="action-btn-icon-wrap">
              <Heart size={20} strokeWidth={1.6} />
              {favoriteCount > 0 && <span className="cart-count">{favoriteCount}</span>}
            </span>
            <span>Favoriten</span>
          </Link>
          <Link to="/panier" className="action-btn cart-btn" aria-label="Warenkorb anzeigen">
            <span className="action-btn-icon-wrap">
              <ShoppingCart size={20} strokeWidth={1.6} />
              {count > 0 && <span className="cart-count">{count}</span>}
            </span>
            <span>Warenkorb</span>
          </Link>
          <button
            type="button"
            className="icon-btn menu-toggle"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="mobile-search-panel">
          <form className="mobile-search-form" onSubmit={submitSearch}>
            <Search size={17} strokeWidth={1.8} className="search-icon" />
            <input
              type="text"
              placeholder="Brennstoff oder Produkt suchen"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              aria-label="Produkt suchen"
              autoFocus
            />
            {search && (
              <button type="button" className="search-clear" onClick={() => setSearch("")} aria-label="Suche löschen">
                <X size={15} strokeWidth={2} />
              </button>
            )}
            <button type="submit" className="search-submit">Suchen</button>
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions" role="listbox" aria-label="Suchvorschläge">
                {suggestions.map((suggestion) => (
                  <button key={suggestion.key} type="button" className="search-suggestion" onClick={() => { setSearch(suggestion.label); navigate(suggestion.to); setShowSuggestions(false); setMobileSearchOpen(false); }}>
                    <span className="search-suggestion-label">{suggestion.label}</span>
                    <span className="search-suggestion-type">{suggestion.type}</span>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>
      )}

      <nav className="category-nav" aria-label="Katalog">
          <NavLink end to="/catalogue" className={({ isActive }) => "category-nav-link category-nav-primary" + (isActive ? " active" : "") }>
          <span className="category-nav-swatch" />
          Katalog
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
        <NavLink to="/livraison" className={({ isActive }) => "category-nav-link" + (isActive ? " active" : "")}>Lieferung</NavLink>
        <NavLink to="/entreprise" className={({ isActive }) => "category-nav-link" + (isActive ? " active" : "")}>Über uns</NavLink>
        <NavLink to="/faq" className={({ isActive }) => "category-nav-link" + (isActive ? " active" : "")}>FAQ</NavLink>
        <NavLink to="/contact" className={({ isActive }) => "category-nav-link" + (isActive ? " active" : "")}>Contact</NavLink>
      </nav>

      {menuOpen && (
        <div className="nav-drawer">
          <Link to="/" className="nav-drawer-link" onClick={close}>Startseite</Link>
          <Link to="/catalogue" className="nav-drawer-link" onClick={close}>Katalog</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.id} to={`/catalogue/${c.id}`} className="nav-drawer-link nav-drawer-sub" onClick={close}>
              {c.name}
            </Link>
          ))}
          <Link to="/livraison" className="nav-drawer-link" onClick={close}>Lieferung</Link>
          <Link to="/entreprise" className="nav-drawer-link" onClick={close}>Über uns</Link>
          <Link to="/faq" className="nav-drawer-link" onClick={close}>FAQ</Link>
          <Link to="/contact" className="nav-drawer-link" onClick={close}>Contact</Link>
          <Link to="/connexion" className="nav-drawer-link" onClick={close}>Anmelden</Link>
          <Link to="/favoris" className="nav-drawer-link" onClick={close}>Favoriten</Link>
          <Link to="/panier" className="nav-drawer-link" onClick={close}>Warenkorb ({count})</Link>
        </div>
      )}
    </header>
  );
}
