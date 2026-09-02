import React, { useState, useMemo } from "react";
import {
  Flame, TreePine, Layers, Mountain, Sparkles, Truck, MapPin, Phone, Mail,
  Menu, X, ShoppingCart, Plus, Minus, Trash2, ChevronRight, ChevronDown,
  Check, ArrowLeft, Clock, Award, Package, Search, MessageCircle,
  ClipboardList, Globe
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* DONNÉES                                                             */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  { id: "granules", name: "Granulés de bois", icon: Flame, blurb: "Pour poêles et chaudières automatiques" },
  { id: "briquettes", name: "Briquettes de bois", icon: Layers, blurb: "Combustion longue, faible entretien" },
  { id: "bois-chauffage", name: "Bois de chauffage", icon: TreePine, blurb: "Bûches et bûchettes compressées" },
  { id: "charbon", name: "Charbon & lignite", icon: Mountain, blurb: "Braises durables, chaleur continue" },
  { id: "allume-feu", name: "Allume-feu", icon: Sparkles, blurb: "Démarrage rapide et sans odeur" },
];

const PRODUCTS = [
  {
    id: "granules-ardenne-6mm",
    category: "granules",
    name: "Granulés de résineux Ardenne 6 mm",
    packaging: "Palette de 975 kg — 65 sacs de 15 kg",
    price: 349,
    stock: "En stock",
    description:
      "Granulés certifiés ENplus A1, produits à partir de sciure de résineux sans additif. Diamètre régulier de 6 mm, taux de fines réduit grâce à un tamisage avant conditionnement.",
    specs: [
      ["Certification", "ENplus A1"],
      ["Diamètre", "6 mm"],
      ["Taux d'humidité", "< 10 %"],
      ["Taux de cendres", "< 0,5 %"],
      ["Pouvoir calorifique", "≈ 4,8 kWh/kg"],
    ],
  },
  {
    id: "granules-or-6mm",
    category: "granules",
    name: "Granulés Premium Foyer Or 6 mm",
    packaging: "Palette de 990 kg — 66 sacs de 15 kg",
    price: 379,
    stock: "En stock",
    description:
      "Sélection de résineux clairs à faible teneur en écorce. Combustion propre recommandée pour les appareils sensibles à l'encrassement.",
    specs: [
      ["Certification", "ENplus A1"],
      ["Diamètre", "6 mm"],
      ["Taux d'humidité", "< 8 %"],
      ["Taux de cendres", "< 0,3 %"],
      ["Pouvoir calorifique", "≈ 5,0 kWh/kg"],
    ],
  },
  {
    id: "granules-eco-6mm",
    category: "granules",
    name: "Granulés éco Forêt Claire 6 mm",
    packaging: "Palette de 960 kg — 64 sacs de 15 kg",
    price: 279,
    stock: "En stock",
    description:
      "Granulés standards à prix maîtrisé, issus de résidus de sciage. Adaptés aux appareils tolérant un taux de fines plus élevé.",
    specs: [
      ["Certification", "DINplus"],
      ["Diamètre", "6 mm"],
      ["Taux d'humidité", "< 12 %"],
      ["Taux de cendres", "< 0,7 %"],
      ["Pouvoir calorifique", "≈ 4,6 kWh/kg"],
    ],
  },
  {
    id: "briquettes-ruf-chene",
    category: "briquettes",
    name: "Briquettes RUF Chêne massif",
    packaging: "Palette de 960 kg — 96 paquets de 10 kg",
    price: 309,
    stock: "En stock",
    description:
      "Briquettes compactes pressées à froid sans liant chimique, à base de sciure de chêne. Format rectangulaire facile à empiler.",
    specs: [
      ["Format", "RUF rectangulaire"],
      ["Essence", "Chêne 100 %"],
      ["Taux d'humidité", "< 10 %"],
      ["Pouvoir calorifique", "≈ 5,2 kWh/kg"],
      ["Durée de combustion", "≈ 1h30 par briquette"],
    ],
  },
  {
    id: "briquettes-nid-hetre",
    category: "briquettes",
    name: "Briquettes Nid d'Abeille Hêtre",
    packaging: "Palette de 950 kg — 95 paquets de 10 kg",
    price: 295,
    stock: "En stock",
    description:
      "Briquettes cylindriques perforées en sciure de hêtre, pensées pour une montée en température rapide et un allumage facilité.",
    specs: [
      ["Format", "Cylindrique perforé"],
      ["Essence", "Hêtre 100 %"],
      ["Taux d'humidité", "< 10 %"],
      ["Pouvoir calorifique", "≈ 5,0 kWh/kg"],
      ["Durée de combustion", "≈ 1h15 par briquette"],
    ],
  },
  {
    id: "briquettes-ecorce-veille",
    category: "briquettes",
    name: "Briquettes Longue Veille Écorce",
    packaging: "Palette de 960 kg — 48 paquets de 20 kg",
    price: 339,
    stock: "Stock limité",
    description:
      "Briquettes très densifiées à base d'écorce, conçues pour maintenir des braises actives plusieurs heures dans les appareils compatibles.",
    specs: [
      ["Format", "Bûchette dense"],
      ["Matière", "Écorce compressée"],
      ["Taux d'humidité", "< 12 %"],
      ["Pouvoir calorifique", "≈ 4,4 kWh/kg"],
      ["Durée de braise", "≈ 6 à 8 heures"],
    ],
  },
  {
    id: "buches-compressees-4h",
    category: "bois-chauffage",
    name: "Bûches compressées 4h Hêtre-Chêne",
    packaging: "Palette de 960 kg — 96 paquets de 10 kg",
    price: 319,
    stock: "En stock",
    description:
      "Bûches reconstituées par compression de sciure sèche, sans colle ajoutée. Combustion régulière d'environ quatre heures par bûche.",
    specs: [
      ["Format", "Bûche compressée Ø10 cm"],
      ["Essence", "Hêtre et chêne"],
      ["Taux d'humidité", "< 8 %"],
      ["Pouvoir calorifique", "≈ 4,9 kWh/kg"],
      ["Durée de combustion", "≈ 4 heures par bûche"],
    ],
  },
  {
    id: "bois-fendu-33cm",
    category: "bois-chauffage",
    name: "Bois de chauffage fendu 33 cm",
    packaging: "Palette de 2 stères — filets de 800 L",
    price: 259,
    stock: "En stock",
    description:
      "Bûches de bois naturel fendu, séchées en hangar ventilé. Mélange de feuillus régionaux, coupe prête à l'emploi.",
    specs: [
      ["Longueur", "33 cm"],
      ["Essence", "Feuillus mélangés"],
      ["Taux d'humidité", "< 20 %"],
      ["Pouvoir calorifique", "≈ 4,0 kWh/kg"],
      ["Origine", "Forêts régionales gérées"],
    ],
  },
  {
    id: "lignite-foyer-continu",
    category: "charbon",
    name: "Briquettes de lignite Foyer Continu",
    packaging: "Palette de 900 kg — 90 paquets de 10 kg",
    price: 389,
    stock: "En stock",
    description:
      "Briquettes de lignite à combustion lente, pensées pour une chaleur stable sur de longues plages horaires.",
    specs: [
      ["Format", "Briquette pressée"],
      ["Matière", "Lignite"],
      ["Pouvoir calorifique", "≈ 5,3 kWh/kg"],
      ["Durée de combustion", "≈ 2 heures par briquette"],
      ["Taux de cendres", "≈ 6 %"],
    ],
  },
  {
    id: "charbon-grillade-intense",
    category: "charbon",
    name: "Charbon de bois Grillade Intense",
    packaging: "Palette de 540 kg — 54 sacs de 10 kg",
    price: 429,
    stock: "Stock limité",
    description:
      "Charbon de bois pour cuisson extérieure, calibré pour une montée en chaleur rapide et une combustion homogène.",
    specs: [
      ["Calibre", "40 à 80 mm"],
      ["Essence", "Feuillus durs"],
      ["Taux d'humidité", "< 8 %"],
      ["Pouvoir calorifique", "≈ 7,5 kWh/kg"],
      ["Usage", "Barbecue et cuisson extérieure"],
    ],
  },
  {
    id: "allume-feu-cire",
    category: "allume-feu",
    name: "Allume-feu Cire Naturelle",
    packaging: "Carton de 200 pièces",
    price: 24.9,
    stock: "En stock",
    description:
      "Allume-feu en copeaux de bois imprégnés de cire naturelle, sans solvant ni odeur chimique. Allumage en quelques secondes.",
    specs: [
      ["Composition", "Copeaux de bois et cire végétale"],
      ["Durée d'allumage", "≈ 8 minutes par unité"],
      ["Odeur", "Neutre"],
    ],
  },
  {
    id: "petit-bois-allumage",
    category: "allume-feu",
    name: "Petit bois d'allumage sec",
    packaging: "Filet de 15 kg",
    price: 14.9,
    stock: "En stock",
    description:
      "Petit bois résineux fendu et séché, calibré pour l'amorçage du feu avant l'ajout de bûches ou de granulés.",
    specs: [
      ["Longueur", "20 à 25 cm"],
      ["Essence", "Résineux"],
      ["Taux d'humidité", "< 15 %"],
    ],
  },
];

const FAQ_ITEMS = [
  {
    q: "Comment se déroule la livraison sur palette ?",
    a: "La palette est acheminée par transporteur avec hayon jusqu'au bord de votre accès carrossable. Le chauffeur ne rentre pas la marchandise à l'intérieur : prévoyez un moyen de déplacer la palette (diable, brouette) une fois posée au sol.",
  },
  {
    q: "Quel est le délai de livraison ?",
    a: "Comptez en moyenne 6 à 8 jours ouvrés entre la validation de la commande et la livraison, selon la région et la disponibilité du produit choisi. Un créneau indicatif vous est communiqué par e-mail avant passage du transporteur.",
  },
  {
    q: "Puis-je retirer ma commande moi-même ?",
    a: "Oui, un retrait sur rendez-vous est possible à notre point de stockage. Contactez-nous avant de vous déplacer : le retrait n'est possible qu'après confirmation écrite et avec un véhicule adapté au poids de la palette.",
  },
  {
    q: "Que faire si un produit arrive endommagé ?",
    a: "Signalez toute anomalie (sacs éventrés, palette abîmée) sur le bon de livraison à réception, puis contactez-nous sous 48 heures avec des photos. Un échange ou un avoir est proposé selon la situation.",
  },
  {
    q: "Comment bien stocker mes granulés ou briquettes ?",
    a: "Conservez les sacs et paquets dans un endroit sec, ventilé et à l'abri de la lumière directe. Évitez le contact direct avec un sol humide en surélevant la palette sur des cales.",
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    a: "Le paiement en ligne s'effectue par carte bancaire au moment de la commande. Pour un retrait sur place, le règlement peut aussi se faire sur place le jour du rendez-vous.",
  },
];

const FREE_SHIPPING_THRESHOLD = 229;
const SHIPPING_FEE = 24.9;

/* ------------------------------------------------------------------ */
/* UTILITAIRES                                                         */
/* ------------------------------------------------------------------ */

const formatPrice = (n) =>
  n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

function useCart() {
  const [cart, setCart] = useState({});
  const add = (id, qty = 1) =>
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + qty }));
  const setQty = (id, qty) =>
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  const remove = (id) =>
    setCart((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  return { cart, add, setQty, remove, count };
}

/* ------------------------------------------------------------------ */
/* COMPOSANTS D'INTERFACE                                              */
/* ------------------------------------------------------------------ */

function Logo({ onClick }) {
  return (
    <button className="logo" onClick={onClick} aria-label="Retour à l'accueil">
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2C13 2 8 8 8 13.5C8 17.09 10.24 20 13 20C15.76 20 18 17.09 18 13.5C18 8 13 2 13 2Z" fill="var(--ember)" />
        <path d="M13 9C13 9 10.5 12.5 10.5 15.2C10.5 17.03 11.6 18.5 13 18.5C14.4 18.5 15.5 17.03 15.5 15.2C15.5 12.5 13 9 13 9Z" fill="var(--paper)" opacity="0.85" />
      </svg>
      <span className="logo-word">Tisonnier</span>
    </button>
  );
}

function TopBar() {
  return (
    <div className="topbar">
      <span className="topbar-item topbar-shipping">
        Livraison offerte dès {formatPrice(FREE_SHIPPING_THRESHOLD)} · sinon {formatPrice(SHIPPING_FEE)} · délai de 6 à 8 jours
      </span>
      <span className="topbar-item topbar-legal">Tisonnier SAS · Vente de combustibles solides</span>
      <button className="topbar-item topbar-country">
        <Globe size={14} strokeWidth={1.8} />
        <span>Livraison en</span>
        <strong>FR · Français</strong>
        <ChevronDown size={13} strokeWidth={1.8} />
      </button>
    </div>
  );
}

function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");
  const submit = (e) => {
    e.preventDefault();
    onSearch(value);
  };
  return (
    <form className="search-bar" onSubmit={submit}>
      <Search size={17} strokeWidth={1.8} className="search-icon" />
      <input
        type="text"
        placeholder="Rechercher un combustible ou un produit"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Rechercher un produit"
      />
      <button type="submit" className="search-submit">Rechercher</button>
    </form>
  );
}

function NavBar({ page, goTo, cartCount, menuOpen, setMenuOpen, onSearch }) {
  const pageLinks = [
    { id: "delivery", label: "Livraison" },
    { id: "about", label: "Entreprise" },
    { id: "faq", label: "Questions fréquentes" },
    { id: "contact", label: "Contact" },
  ];
  return (
    <header className="nav">
      <TopBar />

      <div className="nav-main">
        <Logo onClick={() => { goTo("home"); setMenuOpen(false); }} />
        <div className="nav-search-wrap">
          <SearchBar onSearch={(q) => { onSearch(q); goTo("catalogue"); }} />
        </div>
        <div className="nav-actions">
          <button className="action-btn" onClick={() => goTo("contact")}>
            <MessageCircle size={19} strokeWidth={1.6} />
            <span>Contact</span>
          </button>
          <button className="action-btn">
            <ClipboardList size={19} strokeWidth={1.6} />
            <span>Suivre ma commande</span>
          </button>
          <button className="action-btn cart-btn" onClick={() => goTo("cart")} aria-label="Voir le panier">
            <span className="action-btn-icon-wrap">
              <ShoppingCart size={19} strokeWidth={1.6} />
              <span className="cart-count">{cartCount}</span>
            </span>
            <span>Panier</span>
          </button>
          <button className="icon-btn menu-toggle" onClick={() => setMenuOpen((v) => !v)} aria-label="Ouvrir le menu">
            {menuOpen ? <X size={20} strokeWidth={1.7} /> : <Menu size={20} strokeWidth={1.7} />}
          </button>
        </div>
      </div>

      <nav className="category-nav">
        <button
          className={"category-nav-link category-nav-primary" + (page === "catalogue" ? " active" : "")}
          onClick={() => goTo("catalogue")}
        >
          <span className="category-nav-swatch" /> Tout le catalogue
        </button>
        {CATEGORIES.map((c) => (
          <button key={c.id} className="category-nav-link" onClick={() => goTo("catalogue", c.id)}>
            {c.name}
          </button>
        ))}
        <span className="category-nav-spacer" />
        {pageLinks.slice(0, 2).map((l) => (
          <button
            key={l.id}
            className={"category-nav-link" + (page === l.id ? " active" : "")}
            onClick={() => goTo(l.id)}
          >
            {l.label}
          </button>
        ))}
      </nav>

      {menuOpen && (
        <nav className="nav-drawer">
          <button className={"nav-drawer-link" + (page === "home" ? " active" : "")} onClick={() => { goTo("home"); setMenuOpen(false); }}>
            Accueil <ChevronRight size={16} strokeWidth={1.7} />
          </button>
          <button className={"nav-drawer-link" + (page === "catalogue" ? " active" : "")} onClick={() => { goTo("catalogue"); setMenuOpen(false); }}>
            Tout le catalogue <ChevronRight size={16} strokeWidth={1.7} />
          </button>
          {CATEGORIES.map((c) => (
            <button key={c.id} className="nav-drawer-link nav-drawer-sub" onClick={() => { goTo("catalogue", c.id); setMenuOpen(false); }}>
              {c.name} <ChevronRight size={16} strokeWidth={1.7} />
            </button>
          ))}
          {pageLinks.map((l) => (
            <button
              key={l.id}
              className={"nav-drawer-link" + (page === l.id ? " active" : "")}
              onClick={() => { goTo(l.id); setMenuOpen(false); }}
            >
              {l.label} <ChevronRight size={16} strokeWidth={1.7} />
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

function ValueStrip() {
  const items = [
    { icon: Truck, title: "Livraison en 6-8 jours", text: "Acheminement planifié sur palette" },
    { icon: Package, title: `Franco dès ${FREE_SHIPPING_THRESHOLD} €`, text: `${formatPrice(SHIPPING_FEE)} en dessous` },
    { icon: MapPin, title: "Retrait possible", text: "Sur rendez-vous, paiement sur place" },
  ];
  return (
    <div className="value-strip">
      {items.map((it, i) => (
        <div className="value-item" key={i}>
          <it.icon size={20} strokeWidth={1.5} />
          <div>
            <div className="value-title">{it.title}</div>
            <div className="value-text">{it.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* Scène façon photo d'usine (silos, structure métallique, pile de palettes
   filmées) construite en SVG/CSS — pas de photo réelle hotlinkée, pour rester
   dans un rendu maîtrisé et libre de droits, avec le même esprit "photo
   industrielle sombre" que la référence. */
function HeroScene() {
  return (
    <div className="hero-scene" aria-hidden="true">
      <svg viewBox="0 0 800 520" preserveAspectRatio="xMidYMax slice" className="hero-scene-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0E1A12" />
            <stop offset="100%" stopColor="#1B2E1E" />
          </linearGradient>
          <linearGradient id="siloShade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3A4A3B" />
            <stop offset="55%" stopColor="#54695A" />
            <stop offset="100%" stopColor="#2C3A2E" />
          </linearGradient>
        </defs>
        <rect width="800" height="520" fill="url(#skyFade)" />
        {/* silos */}
        {[110, 210, 310].map((x, i) => (
          <g key={x}>
            <rect x={x} y={90 + i * 6} width="72" height="230" rx="8" fill="url(#siloShade)" />
            <ellipse cx={x + 36} cy={90 + i * 6} rx="36" ry="12" fill="#5C7360" />
          </g>
        ))}
        {/* structure métallique / passerelle */}
        <rect x="90" y="320" width="310" height="6" fill="#71614A" opacity="0.7" />
        <rect x="120" y="326" width="6" height="60" fill="#71614A" opacity="0.6" />
        <rect x="260" y="326" width="6" height="60" fill="#71614A" opacity="0.6" />
        <rect x="380" y="326" width="6" height="60" fill="#71614A" opacity="0.6" />
        {/* pile de palettes filmées, alignée à droite comme dans la référence */}
        {[0, 1, 2].map((row) => (
          <g key={row} transform={`translate(0 ${row * -58})`}>
            <rect x="430" y="410" width="120" height="52" fill="#161C12" opacity="0.85" />
            <rect x="430" y="410" width="120" height="52" fill="none" stroke="#3E4A38" strokeWidth="2" />
            <rect x="560" y="410" width="120" height="52" fill="#20281B" opacity="0.85" />
            <rect x="560" y="410" width="120" height="52" fill="none" stroke="#3E4A38" strokeWidth="2" />
          </g>
        ))}
        <rect x="410" y="470" width="290" height="16" fill="#3E4A38" opacity="0.6" />
        {/* touche ember, un rappel de chaleur/feu en accent */}
        <circle cx="680" cy="120" r="30" fill="var(--ember)" opacity="0.55" />
      </svg>
      <div className="hero-scene-overlay" />
    </div>
  );
}

function CategoryTiles({ goTo }) {
  return (
    <div className="cat-grid">
      {CATEGORIES.map((c) => (
        <button key={c.id} className="cat-tile" onClick={() => goTo("catalogue", c.id)}>
          <span className="cat-bar" />
          <c.icon size={22} strokeWidth={1.5} />
          <span className="cat-name">{c.name}</span>
          <span className="cat-blurb">{c.blurb}</span>
        </button>
      ))}
    </div>
  );
}

function ProductCard({ product, goTo, add }) {
  const cat = CATEGORIES.find((c) => c.id === product.category);
  return (
    <div className="product-card">
      <button className="product-card-visual" onClick={() => goTo("product", null, product.id)}>
        <cat.icon size={30} strokeWidth={1.3} />
      </button>
      <div className="product-card-body">
        <span className="product-tag">{cat.name}</span>
        <button className="product-name" onClick={() => goTo("product", null, product.id)}>
          {product.name}
        </button>
        <span className="product-packaging">{product.packaging}</span>
        <div className="product-card-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
          <button className="btn btn-small" onClick={() => add(product.id)}>Ajouter</button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PAGES                                                                */
/* ------------------------------------------------------------------ */

function HomePage({ goTo, add }) {
  const featured = PRODUCTS.slice(0, 6);
  return (
    <>
      <section className="hero">
        <HeroScene />
        <div className="hero-content">
          <p className="hero-kicker">Combustibles pour particuliers et professionnels</p>
          <h1 className="hero-title">Une chaleur sur laquelle vous pouvez compter.</h1>
          <p className="hero-sub">
            Granulés, briquettes, bois de chauffage et charbon, avec des fiches produit précises,
            une logistique sur palette maîtrisée et une équipe joignable en semaine.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => goTo("catalogue")}>Voir le catalogue</button>
            <button className="btn btn-ghost-light" onClick={() => goTo("about")}>Découvrir l'entreprise</button>
          </div>
        </div>
      </section>

      <ValueStrip />

      <section className="section">
        <h2 className="section-title">Trouvez le combustible adapté à votre appareil</h2>
        <CategoryTiles goTo={goTo} />
      </section>

      <section className="section">
        <div className="section-head-row">
          <h2 className="section-title">Une sélection à comparer facilement</h2>
          <button className="link-btn" onClick={() => goTo("catalogue")}>
            Tout le catalogue <ChevronRight size={16} strokeWidth={1.7} />
          </button>
        </div>
        <div className="product-grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} goTo={goTo} add={add} />
          ))}
        </div>
      </section>

      <section className="section steps-section">
        <h2 className="section-title">Commander en trois étapes</h2>
        <div className="steps">
          {[
            { n: "1", title: "Choisir un produit", text: "Comparez le conditionnement, les spécifications et le prix." },
            { n: "2", title: "Livraison ou retrait", text: "Faites-vous livrer la palette ou réservez un retrait avec paiement sur place." },
            { n: "3", title: "Confirmation écrite", text: "Recevez par e-mail le récapitulatif et le créneau prévu." },
          ].map((s) => (
            <div className="step" key={s.n}>
              <span className="step-n">{s.n}</span>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-text">{s.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function CataloguePage({ goTo, add, activeCategory, setActiveCategory, search }) {
  const filtered = PRODUCTS
    .filter((p) => (activeCategory ? p.category === activeCategory : true))
    .filter((p) => (search ? p.name.toLowerCase().includes(search.toLowerCase()) : true));

  return (
    <section className="section">
      <h1 className="page-title">Catalogue</h1>
      <p className="page-lede">
        {search
          ? `${filtered.length} résultat(s) pour « ${search} »`
          : `${PRODUCTS.length} produits disponibles, livrés sur palette complète ou en petit conditionnement pour l'allumage.`}
      </p>
      <div className="filter-row">
        <button
          className={"filter-chip" + (!activeCategory ? " active" : "")}
          onClick={() => setActiveCategory(null)}
        >
          Tout
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={"filter-chip" + (activeCategory === c.id ? " active" : "")}
            onClick={() => setActiveCategory(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="page-lede">Aucun produit ne correspond à cette recherche.</p>
      ) : (
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} goTo={goTo} add={add} />
          ))}
        </div>
      )}
    </section>
  );
}

function ProductPage({ productId, goTo, add }) {
  const product = PRODUCTS.find((p) => p.id === productId);
  const [qty, setQty] = useState(1);
  if (!product) return null;
  const cat = CATEGORIES.find((c) => c.id === product.category);
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <section className="section">
      <button className="back-link" onClick={() => goTo("catalogue")}>
        <ArrowLeft size={16} strokeWidth={1.7} /> Retour au catalogue
      </button>
      <div className="product-detail">
        <div className="product-detail-visual">
          <cat.icon size={64} strokeWidth={1.1} />
        </div>
        <div className="product-detail-body">
          <span className="product-tag">{cat.name}</span>
          <h1 className="product-detail-title">{product.name}</h1>
          <p className="product-packaging">{product.packaging}</p>
          <p className={"stock-badge " + (product.stock === "En stock" ? "ok" : "low")}>
            <Check size={14} strokeWidth={2} /> {product.stock}
          </p>
          <p className="product-description">{product.description}</p>

          <table className="specs-table">
            <tbody>
              {product.specs.map(([label, value]) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="purchase-row">
            <span className="product-detail-price">{formatPrice(product.price)}</span>
            <div className="qty-control">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuer la quantité"><Minus size={15} /></button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Augmenter la quantité"><Plus size={15} /></button>
            </div>
            <button className="btn btn-primary" onClick={() => add(product.id, qty)}>Ajouter au panier</button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="related-block">
          <h2 className="section-title">Dans la même famille</h2>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} goTo={goTo} add={add} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function CartPage({ cart, setQty, remove, goTo }) {
  const items = Object.entries(cart).map(([id, qty]) => ({
    product: PRODUCTS.find((p) => p.id === id),
    qty,
  })).filter((i) => i.product);

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <section className="section confirmation">
        <Check size={40} strokeWidth={1.3} className="confirmation-icon" />
        <h1 className="page-title">Commande enregistrée</h1>
        <p className="page-lede">
          Ceci est une démonstration : aucune commande réelle n'a été transmise. Dans une version connectée,
          vous recevriez ici la confirmation écrite avec le créneau de livraison prévu.
        </p>
        <button className="btn btn-primary" onClick={() => goTo("home")}>Retour à l'accueil</button>
      </section>
    );
  }

  return (
    <section className="section">
      <h1 className="page-title">Panier</h1>
      {items.length === 0 ? (
        <div className="empty-state">
          <p>Votre panier est vide pour le moment.</p>
          <button className="btn btn-primary" onClick={() => goTo("catalogue")}>Parcourir le catalogue</button>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {items.map(({ product, qty }) => (
              <div className="cart-row" key={product.id}>
                <div className="cart-row-info">
                  <button className="product-name" onClick={() => goTo("product", null, product.id)}>{product.name}</button>
                  <span className="product-packaging">{product.packaging}</span>
                </div>
                <div className="qty-control">
                  <button onClick={() => setQty(product.id, qty - 1)} aria-label="Diminuer la quantité"><Minus size={15} /></button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(product.id, qty + 1)} aria-label="Augmenter la quantité"><Plus size={15} /></button>
                </div>
                <span className="cart-row-price">{formatPrice(product.price * qty)}</span>
                <button className="icon-btn" onClick={() => remove(product.id)} aria-label="Retirer l'article">
                  <Trash2 size={17} strokeWidth={1.6} />
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="summary-row"><span>Sous-total</span><span>{formatPrice(subtotal)}</span></div>
            <div className="summary-row">
              <span>Livraison</span>
              <span>{shipping === 0 ? "Offerte" : formatPrice(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className="summary-note">
                Ajoutez {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} pour la livraison offerte.
              </p>
            )}
            <div className="summary-row summary-total"><span>Total</span><span>{formatPrice(total)}</span></div>
            <button className="btn btn-primary btn-block" onClick={() => setConfirmed(true)}>
              Valider la commande
            </button>
          </div>
        </>
      )}
    </section>
  );
}

function DeliveryPage() {
  return (
    <section className="section">
      <h1 className="page-title">Livraison &amp; retrait</h1>
      <p className="page-lede">
        Toutes nos palettes sont acheminées par transporteur avec hayon. Voici comment se prépare
        la réception, et comment fonctionne le retrait sur rendez-vous.
      </p>

      <div className="info-columns">
        <div className="info-col">
          <Truck size={22} strokeWidth={1.5} />
          <h2 className="info-col-title">Livraison à domicile</h2>
          <ul className="info-list">
            <li>Délai moyen de 6 à 8 jours ouvrés après validation de la commande.</li>
            <li>Livraison offerte à partir de {formatPrice(FREE_SHIPPING_THRESHOLD)} d'achat, sinon {formatPrice(SHIPPING_FEE)}.</li>
            <li>Le chauffeur dépose la palette au sol, au bord de l'accès carrossable le plus proche.</li>
            <li>Un accès dégagé et un sol stable facilitent la manœuvre du hayon.</li>
          </ul>
        </div>
        <div className="info-col">
          <MapPin size={22} strokeWidth={1.5} />
          <h2 className="info-col-title">Retrait sur rendez-vous</h2>
          <ul className="info-list">
            <li>Réservation obligatoire par téléphone ou via le formulaire de contact.</li>
            <li>Retrait uniquement après confirmation écrite du créneau.</li>
            <li>Prévoyez un véhicule adapté au poids et à l'encombrement de la palette.</li>
            <li>Le paiement peut s'effectuer sur place le jour du retrait.</li>
          </ul>
        </div>
      </div>

      <div className="callout">
        <Clock size={20} strokeWidth={1.5} />
        <p>
          Un e-mail de confirmation vous indique un créneau indicatif avant le passage du transporteur.
          Le chauffeur peut vous contacter le jour même pour affiner l'horaire.
        </p>
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <section className="section">
      <h1 className="page-title">L'entreprise</h1>
      <p className="page-lede">
        Tisonnier est né du constat que le chauffage au bois mérite des informations aussi claires
        que n'importe quel autre poste d'équipement de la maison : composition, humidité, pouvoir
        calorifique et conditions de livraison, sans jargon inutile.
      </p>

      <div className="about-grid">
        <div className="about-block">
          <Award size={22} strokeWidth={1.5} />
          <h2 className="info-col-title">Une sélection resserrée</h2>
          <p>
            Plutôt qu'un catalogue interminable, nous travaillons avec un nombre limité de producteurs
            que nous connaissons, pour des fiches produit fiables plutôt qu'exhaustives.
          </p>
        </div>
        <div className="about-block">
          <TreePine size={22} strokeWidth={1.5} />
          <h2 className="info-col-title">Bois d'origine régionale</h2>
          <p>
            Une partie de nos bûches et briquettes provient de résidus de scieries et de forêts
            gérées durablement, à proximité de nos points de conditionnement.
          </p>
        </div>
        <div className="about-block">
          <Package size={22} strokeWidth={1.5} />
          <h2 className="info-col-title">Logistique sur palette</h2>
          <p>
            Le conditionnement sur palette housse limite la manutention et protège les sacs
            de l'humidité pendant le transport et le stockage.
          </p>
        </div>
      </div>

      <div className="callout">
        <p>
          Cette page présente une entreprise fictive à but de démonstration : les informations
          juridiques réelles (raison sociale, adresse, numéro d'immatriculation) restent à compléter
          avant toute mise en ligne effective.
        </p>
      </div>
    </section>
  );
}

function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="section">
      <h1 className="page-title">Questions fréquentes</h1>
      <div className="faq-list">
        {FAQ_ITEMS.map((item, i) => (
          <div className={"faq-item" + (openIndex === i ? " open" : "")} key={i}>
            <button className="faq-question" onClick={() => setOpenIndex(openIndex === i ? -1 : i)}>
              <span>{item.q}</span>
              <ChevronDown size={18} strokeWidth={1.7} className="faq-chevron" />
            </button>
            {openIndex === i && <p className="faq-answer">{item.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="section">
      <h1 className="page-title">Contact</h1>
      <p className="page-lede">
        Une question sur un produit, une livraison ou un retrait sur rendez-vous ? Écrivez-nous
        ou appelez-nous en semaine.
      </p>

      <div className="contact-grid">
        <div className="contact-info">
          <div className="contact-line"><Phone size={18} strokeWidth={1.6} /><span>01 23 45 67 89</span></div>
          <div className="contact-line"><Mail size={18} strokeWidth={1.6} /><span>contact@tisonnier.fr</span></div>
          <div className="contact-line"><Clock size={18} strokeWidth={1.6} /><span>Lundi – vendredi, 8h à 16h</span></div>
          <div className="contact-line"><MapPin size={18} strokeWidth={1.6} /><span>Point de retrait sur rendez-vous uniquement</span></div>
        </div>

        <form className="contact-form" onSubmit={submit}>
          {sent ? (
            <div className="empty-state">
              <Check size={28} strokeWidth={1.4} />
              <p>Merci, votre message a bien été pris en compte dans cette démonstration.</p>
            </div>
          ) : (
            <>
              <label className="field">
                <span>Nom</span>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label className="field">
                <span>E-mail</span>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              <label className="field">
                <span>Message</span>
                <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </label>
              <button className="btn btn-primary btn-block" type="submit">Envoyer</button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

function Footer({ goTo }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <Logo onClick={() => goTo("home")} />
          <p className="footer-text">
            Combustibles solides pour particuliers et professionnels, livrés sur palette
            avec des fiches produit lisibles.
          </p>
        </div>
        <div>
          <h3 className="footer-heading">Catalogue</h3>
          {CATEGORIES.map((c) => (
            <button key={c.id} className="footer-link" onClick={() => goTo("catalogue", c.id)}>{c.name}</button>
          ))}
        </div>
        <div>
          <h3 className="footer-heading">Aide</h3>
          <button className="footer-link" onClick={() => goTo("delivery")}>Livraison et retrait</button>
          <button className="footer-link" onClick={() => goTo("faq")}>Questions fréquentes</button>
          <button className="footer-link" onClick={() => goTo("contact")}>Contact</button>
        </div>
        <div>
          <h3 className="footer-heading">Entreprise</h3>
          <button className="footer-link" onClick={() => goTo("about")}>À propos</button>
        </div>
      </div>
      <div className="footer-bottom">© 2026 Tisonnier — site de démonstration</div>
    </footer>
  );
}

function CookieBanner({ onChoice }) {
  return (
    <div className="cookie-banner" role="dialog" aria-label="Préférences de cookies">
      <p className="cookie-title">Vos préférences</p>
      <p className="cookie-text">
        Les cookies indispensables au fonctionnement du site restent actifs. Les cookies de mesure
        d'audience ne sont activés qu'avec votre accord.
      </p>
      <div className="cookie-actions">
        <button className="btn btn-cookie-secondary" onClick={() => onChoice("essential")}>Essentiels uniquement</button>
        <button className="btn btn-cookie-primary" onClick={() => onChoice("all")}>Tout accepter</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* APPLICATION                                                         */
/* ------------------------------------------------------------------ */

export default function App() {
  const [page, setPage] = useState("home");
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [cookieChoice, setCookieChoice] = useState(null);
  const { cart, add, setQty, remove, count } = useCart();

  const goTo = (target, category = null, productId = null) => {
    setPage(target);
    if (category !== null || target === "catalogue") setActiveCategory(category);
    if (productId) setSelectedProductId(productId);
    setMenuOpen(false);
    window?.scrollTo?.({ top: 0, behavior: "auto" });
  };

  const content = useMemo(() => {
    switch (page) {
      case "catalogue":
        return <CataloguePage goTo={goTo} add={add} activeCategory={activeCategory} setActiveCategory={setActiveCategory} search={search} />;
      case "product":
        return <ProductPage productId={selectedProductId} goTo={goTo} add={add} />;
      case "cart":
        return <CartPage cart={cart} setQty={setQty} remove={remove} goTo={goTo} />;
      case "delivery":
        return <DeliveryPage />;
      case "about":
        return <AboutPage />;
      case "faq":
        return <FAQPage />;
      case "contact":
        return <ContactPage />;
      default:
        return <HomePage goTo={goTo} add={add} />;
    }
  }, [page, activeCategory, selectedProductId, cart, search]);

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800;900&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        :root {
          --ink: #221D14;
          --ink-soft: #5B5240;
          --paper: #F6F0E2;
          --card: #FFFCF4;
          --pine: #2E3B26;
          --pine-dark: #202B1B;
          --ember: #B8451F;
          --ember-dark: #93381A;
          --bronze: #8A6F3E;
          --line: rgba(34, 29, 20, 0.15);
          --font-display: 'Archivo', sans-serif;
          --font-body: 'IBM Plex Sans', sans-serif;
          --font-mono: 'IBM Plex Mono', monospace;
        }

        .app * { box-sizing: border-box; }
        .app {
          font-family: var(--font-body);
          color: var(--ink);
          background: var(--paper);
          line-height: 1.55;
          font-size: 15px;
        }
        .app h1, .app h2, .app h3 { font-family: var(--font-display); font-weight: 700; margin: 0; letter-spacing: -0.01em; }
        .app button { font-family: inherit; cursor: pointer; background: none; border: none; color: inherit; }
        .app a { color: inherit; }
        .app ul { margin: 0; padding: 0; list-style: none; }
        .app input, .app textarea { font-family: inherit; font-size: 14px; }

        /* -------- Nav -------- */
        .nav { position: sticky; top: 0; z-index: 30; background: var(--paper); border-bottom: 1px solid var(--line); }

        .topbar { background: var(--pine-dark); color: rgba(246,240,226,0.85); font-size: 12px; display: flex; align-items: center; gap: 16px; padding: 7px 18px; overflow-x: auto; white-space: nowrap; }
        .topbar-shipping { font-weight: 500; color: var(--paper); }
        .topbar-legal { display: none; color: rgba(246,240,226,0.6); }
        .topbar-country { margin-left: auto; display: flex; align-items: center; gap: 6px; color: var(--paper); flex-shrink: 0; }
        .topbar-country strong { font-weight: 600; }
        @media (min-width: 760px) { .topbar-legal { display: inline; } }

        .nav-main { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; padding: 14px 18px; max-width: 1240px; margin: 0 auto; }
        .logo { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .logo-word { font-family: var(--font-display); font-weight: 800; font-size: 21px; letter-spacing: -0.01em; }
        .nav-search-wrap { order: 3; flex: 1 1 100%; }
        .search-bar { display: flex; align-items: center; border: 1px solid var(--line); background: var(--card); max-width: 640px; }
        .search-icon { margin-left: 12px; color: var(--ink-soft); flex-shrink: 0; }
        .search-bar input { flex: 1; border: none; background: transparent; padding: 10px 10px; color: var(--ink); }
        .search-bar input:focus { outline: none; }
        .search-submit { background: var(--pine); color: var(--paper); padding: 10px 18px; font-size: 13px; font-weight: 500; flex-shrink: 0; }
        .search-submit:hover { background: var(--pine-dark); }
        .nav-actions { display: flex; align-items: center; gap: 4px; margin-left: auto; }
        .action-btn { display: none; flex-direction: column; align-items: center; gap: 3px; padding: 6px 10px; font-size: 11.5px; color: var(--ink-soft); border-radius: 2px; }
        .action-btn:hover { color: var(--ink); background: rgba(138,111,62,0.12); }
        .action-btn-icon-wrap { position: relative; display: inline-flex; }
        .cart-count { position: absolute; top: -6px; right: -9px; background: var(--ember); color: var(--card); font-size: 10px; font-family: var(--font-mono); min-width: 15px; height: 15px; border-radius: 8px; display: flex; align-items: center; justify-content: center; padding: 0 3px; }
        .icon-btn { position: relative; padding: 8px; border-radius: 2px; display: inline-flex; }
        .icon-btn:hover { background: rgba(138,111,62,0.12); }
        .menu-toggle { display: inline-flex; }
        @media (min-width: 860px) {
          .nav-search-wrap { order: 0; flex: 1 1 auto; }
          .action-btn { display: flex; }
          .menu-toggle { display: none; }
        }

        .category-nav { display: none; align-items: center; gap: 2px; padding: 0 18px; max-width: 1240px; margin: 0 auto; border-top: 1px solid var(--line); overflow-x: auto; }
        .category-nav-link { padding: 12px 12px; font-size: 13.5px; color: var(--ink-soft); white-space: nowrap; }
        .category-nav-link:hover, .category-nav-link.active { color: var(--ink); }
        .category-nav-primary { display: flex; align-items: center; gap: 8px; background: var(--bronze); color: var(--paper); font-weight: 600; }
        .category-nav-primary:hover, .category-nav-primary.active { background: var(--pine-dark); color: var(--paper); }
        .category-nav-swatch { width: 10px; height: 10px; background: var(--paper); }
        .category-nav-spacer { flex: 1; }
        @media (min-width: 860px) { .category-nav { display: flex; } }

        .nav-drawer { display: flex; flex-direction: column; border-top: 1px solid var(--line); padding: 6px 18px 12px; max-height: 70vh; overflow-y: auto; }
        .nav-drawer-link { display: flex; align-items: center; justify-content: space-between; padding: 12px 4px; border-bottom: 1px solid var(--line); font-size: 15px; }
        .nav-drawer-link.active { color: var(--ember); }
        .nav-drawer-sub { padding-left: 14px; font-size: 13.5px; color: var(--ink-soft); }
        @media (min-width: 860px) { .nav-drawer { display: none; } }

        /* -------- Layout helpers -------- */
        .section { max-width: 1180px; margin: 0 auto; padding: 40px 18px; }
        .section-title { font-size: 22px; margin-bottom: 18px; }
        .section-head-row { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
        .section-head-row .section-title { margin-bottom: 0; }
        .page-title { font-size: 28px; margin-bottom: 10px; }
        .page-lede { color: var(--ink-soft); max-width: 640px; margin-bottom: 28px; }
        .link-btn { display: inline-flex; align-items: center; gap: 4px; color: var(--ember-dark); font-size: 14px; white-space: nowrap; }

        /* -------- Hero -------- */
        .hero { position: relative; min-height: 420px; display: flex; align-items: flex-end; overflow: hidden; }
        .hero-scene { position: absolute; inset: 0; z-index: 0; }
        .hero-scene-svg { width: 100%; height: 100%; display: block; }
        .hero-scene-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(14,26,18,0.35) 0%, rgba(14,26,18,0.55) 55%, rgba(14,26,18,0.92) 100%); }
        .hero-content { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; padding: 40px 18px 44px; width: 100%; color: var(--paper); }
        .hero-kicker { color: var(--ember); text-transform: uppercase; letter-spacing: 0.04em; font-size: 12.5px; font-weight: 700; margin: 0 0 14px; }
        .hero-title { font-family: var(--font-display); font-weight: 800; font-size: 34px; line-height: 1.08; max-width: 14ch; margin-bottom: 16px; color: var(--paper); }
        .hero-sub { color: rgba(246,240,226,0.82); max-width: 46ch; margin-bottom: 24px; }
        .hero-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        @media (min-width: 860px) {
          .hero { min-height: 520px; }
          .hero-content { padding: 60px 18px 60px; }
          .hero-title { font-size: 50px; max-width: 13ch; }
        }

        /* -------- Cookie banner -------- */
        .cookie-banner { position: fixed; left: 18px; right: 18px; bottom: 18px; z-index: 50; background: var(--pine-dark); color: var(--paper); padding: 18px 20px; max-width: 640px; box-shadow: 0 12px 30px rgba(0,0,0,0.25); }
        .cookie-title { font-family: var(--font-display); font-weight: 700; font-size: 15px; margin-bottom: 6px; }
        .cookie-text { font-size: 13px; color: rgba(246,240,226,0.8); margin-bottom: 14px; }
        .cookie-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .btn-cookie-secondary { background: var(--paper); color: var(--ink); }
        .btn-cookie-secondary:hover { background: var(--card); }
        .btn-cookie-primary { background: var(--ember); color: var(--paper); }
        .btn-cookie-primary:hover { background: var(--ember-dark); }

        /* -------- Buttons -------- */
        .btn { padding: 11px 20px; border-radius: 2px; font-size: 14px; font-weight: 500; border: 1px solid transparent; transition: background 0.15s ease, border-color 0.15s ease; }
        .btn-primary { background: var(--ember); color: var(--card); }
        .btn-primary:hover { background: var(--ember-dark); }
        .btn-ghost { border-color: var(--line); color: var(--ink); }
        .btn-ghost:hover { border-color: var(--bronze); }
        .btn-ghost-light { border: 1px solid rgba(246,240,226,0.5); color: var(--paper); }
        .btn-ghost-light:hover { border-color: var(--paper); background: rgba(246,240,226,0.1); }
        .btn-small { padding: 7px 12px; font-size: 13px; border: 1px solid var(--line); }
        .btn-small:hover { border-color: var(--ember); color: var(--ember-dark); }
        .btn-block { width: 100%; }

        /* -------- Value strip -------- */
        .value-strip { max-width: 1180px; margin: 0 auto; padding: 0 18px 36px; display: grid; grid-template-columns: 1fr; border-top: 1px solid var(--line); }
        .value-item { display: flex; gap: 12px; align-items: flex-start; padding: 18px 0; border-bottom: 1px solid var(--line); color: var(--bronze); }
        .value-title { font-family: var(--font-mono); font-size: 13px; color: var(--ink); }
        .value-text { font-size: 13px; color: var(--ink-soft); }
        @media (min-width: 700px) {
          .value-strip { grid-template-columns: repeat(3, 1fr); border-bottom: 1px solid var(--line); }
          .value-item { border-bottom: none; border-right: 1px solid var(--line); padding: 20px 20px; }
          .value-item:last-child { border-right: none; }
        }

        /* -------- Category tiles -------- */
        .cat-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
        .cat-tile { position: relative; text-align: left; padding: 18px 18px 18px 22px; background: var(--card); border: 1px solid var(--line); display: flex; flex-direction: column; gap: 6px; color: var(--ember-dark); }
        .cat-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--ember); }
        .cat-name { font-family: var(--font-display); font-size: 16px; color: var(--ink); font-weight: 600; }
        .cat-blurb { font-size: 13px; color: var(--ink-soft); }
        @media (min-width: 700px) { .cat-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1000px) { .cat-grid { grid-template-columns: repeat(5, 1fr); } }

        /* -------- Product grid / cards -------- */
        .product-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 620px) { .product-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 980px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }
        .product-card { border: 1px solid var(--line); background: var(--card); display: flex; flex-direction: column; }
        .product-card-visual { display: flex; align-items: center; justify-content: center; height: 96px; background: var(--paper); color: var(--bronze); border-bottom: 1px solid var(--line); }
        .product-card-body { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .product-tag { font-family: var(--font-mono); font-size: 11px; color: var(--bronze); }
        .product-name { text-align: left; font-size: 14.5px; font-weight: 600; line-height: 1.3; }
        .product-name:hover { color: var(--ember-dark); }
        .product-packaging { font-size: 12.5px; color: var(--ink-soft); }
        .product-card-footer { margin-top: auto; padding-top: 10px; display: flex; align-items: center; justify-content: space-between; }
        .product-price { font-family: var(--font-mono); font-size: 15px; }

        /* -------- Steps -------- */
        .steps-section { }
        .steps { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 760px) { .steps { grid-template-columns: repeat(3, 1fr); } }
        .step { border-top: 2px solid var(--ember); padding-top: 12px; }
        .step-n { font-family: var(--font-mono); color: var(--bronze); font-size: 13px; }
        .step-title { font-size: 17px; margin: 6px 0 6px; }
        .step-text { color: var(--ink-soft); font-size: 13.5px; }

        /* -------- Filters -------- */
        .filter-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
        .filter-chip { padding: 8px 14px; border: 1px solid var(--line); border-radius: 20px; font-size: 13px; color: var(--ink-soft); }
        .filter-chip.active { background: var(--pine); border-color: var(--pine); color: var(--paper); }

        /* -------- Product detail -------- */
        .back-link { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--ink-soft); margin-bottom: 20px; }
        .back-link:hover { color: var(--ink); }
        .product-detail { display: flex; flex-direction: column; gap: 24px; margin-bottom: 40px; }
        .product-detail-visual { background: var(--card); border: 1px solid var(--line); height: 180px; display: flex; align-items: center; justify-content: center; color: var(--bronze); }
        .product-detail-title { font-size: 24px; margin: 8px 0 6px; }
        .stock-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; padding: 3px 8px; border-radius: 20px; margin: 10px 0; }
        .stock-badge.ok { background: rgba(46,59,38,0.12); color: var(--pine); }
        .stock-badge.low { background: rgba(184,69,31,0.12); color: var(--ember-dark); }
        .product-description { color: var(--ink-soft); margin-bottom: 18px; max-width: 60ch; }
        .specs-table { width: 100%; border-collapse: collapse; margin-bottom: 22px; font-size: 13.5px; }
        .specs-table td { padding: 8px 4px; border-bottom: 1px solid var(--line); }
        .specs-table td:first-child { color: var(--ink-soft); width: 55%; }
        .specs-table td:last-child { font-family: var(--font-mono); text-align: right; }
        .purchase-row { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; }
        .product-detail-price { font-family: var(--font-mono); font-size: 22px; }
        @media (min-width: 760px) {
          .product-detail { flex-direction: row; }
          .product-detail-visual { width: 260px; height: auto; flex-shrink: 0; }
        }

        .qty-control { display: inline-flex; align-items: center; border: 1px solid var(--line); }
        .qty-control button { padding: 8px 10px; }
        .qty-control button:hover { background: rgba(138,111,62,0.12); }
        .qty-control span { min-width: 26px; text-align: center; font-family: var(--font-mono); font-size: 14px; }

        .related-block { margin-top: 20px; }

        /* -------- Cart -------- */
        .cart-list { display: flex; flex-direction: column; margin-bottom: 24px; }
        .cart-row { display: grid; grid-template-columns: 1fr auto auto auto; gap: 12px; align-items: center; padding: 14px 0; border-bottom: 1px solid var(--line); }
        .cart-row-info { display: flex; flex-direction: column; gap: 3px; }
        .cart-row-price { font-family: var(--font-mono); font-size: 14px; }
        .cart-summary { max-width: 360px; margin-left: auto; border-top: 2px solid var(--ink); padding-top: 14px; }
        .summary-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
        .summary-total { font-family: var(--font-mono); font-size: 17px; border-top: 1px solid var(--line); margin-top: 6px; padding-top: 12px; }
        .summary-note { font-size: 12.5px; color: var(--ink-soft); margin: 4px 0 12px; }
        .empty-state { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; color: var(--ink-soft); }

        .confirmation { display: flex; flex-direction: column; align-items: flex-start; max-width: 520px; }
        .confirmation-icon { color: var(--pine); margin-bottom: 12px; }

        /* -------- Delivery / About -------- */
        .info-columns { display: grid; grid-template-columns: 1fr; gap: 28px; margin-bottom: 30px; }
        @media (min-width: 760px) { .info-columns { grid-template-columns: 1fr 1fr; } }
        .info-col { color: var(--bronze); }
        .info-col-title { font-size: 17px; color: var(--ink); margin: 10px 0 12px; }
        .info-list li { padding: 8px 0; border-bottom: 1px solid var(--line); color: var(--ink-soft); font-size: 13.5px; }
        .callout { display: flex; gap: 12px; background: var(--card); border: 1px solid var(--line); padding: 16px 18px; color: var(--ink-soft); font-size: 13.5px; align-items: flex-start; }
        .callout svg { flex-shrink: 0; color: var(--bronze); margin-top: 2px; }

        .about-grid { display: grid; grid-template-columns: 1fr; gap: 24px; margin-bottom: 30px; }
        @media (min-width: 760px) { .about-grid { grid-template-columns: repeat(3, 1fr); } }
        .about-block { color: var(--bronze); }
        .about-block p { color: var(--ink-soft); font-size: 13.5px; margin-top: 8px; }

        /* -------- FAQ -------- */
        .faq-list { max-width: 720px; border-top: 1px solid var(--line); }
        .faq-item { border-bottom: 1px solid var(--line); }
        .faq-question { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 16px 4px; text-align: left; font-size: 15px; font-weight: 500; }
        .faq-chevron { transition: transform 0.15s ease; flex-shrink: 0; color: var(--bronze); }
        .faq-item.open .faq-chevron { transform: rotate(180deg); }
        .faq-answer { padding: 0 4px 16px; color: var(--ink-soft); font-size: 13.5px; max-width: 60ch; }

        /* -------- Contact -------- */
        .contact-grid { display: grid; grid-template-columns: 1fr; gap: 30px; }
        @media (min-width: 760px) { .contact-grid { grid-template-columns: 1fr 1.3fr; } }
        .contact-info { display: flex; flex-direction: column; gap: 14px; }
        .contact-line { display: flex; align-items: center; gap: 10px; color: var(--ink-soft); font-size: 14px; }
        .contact-line svg { color: var(--bronze); }
        .contact-form { display: flex; flex-direction: column; gap: 14px; }
        .field { display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--ink-soft); }
        .field input, .field textarea { border: 1px solid var(--line); background: var(--card); padding: 10px 12px; border-radius: 2px; color: var(--ink); }
        .field input:focus, .field textarea:focus { outline: 2px solid var(--ember); outline-offset: 1px; }

        /* -------- Footer -------- */
        .footer { background: var(--pine-dark); color: var(--paper); margin-top: 40px; }
        .footer .logo-word, .footer .logo svg path { color: var(--paper); }
        .footer-grid { max-width: 1180px; margin: 0 auto; padding: 40px 18px; display: grid; grid-template-columns: 1fr; gap: 28px; }
        @media (min-width: 760px) { .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; } }
        .footer-text { font-size: 13px; color: rgba(246,240,226,0.65); margin-top: 12px; max-width: 34ch; }
        .footer-heading { font-size: 13px; color: rgba(246,240,226,0.55); margin-bottom: 10px; font-weight: 500; }
        .footer-link { display: block; text-align: left; font-size: 13.5px; padding: 5px 0; color: rgba(246,240,226,0.85); }
        .footer-link:hover { color: var(--paper); text-decoration: underline; }
        .footer-bottom { border-top: 1px solid rgba(246,240,226,0.15); padding: 16px 18px; text-align: center; font-size: 12px; color: rgba(246,240,226,0.5); }

        @media (prefers-reduced-motion: reduce) {
          .app * { transition: none !important; }
        }
      `}</style>

      <NavBar page={page} goTo={goTo} cartCount={count} menuOpen={menuOpen} setMenuOpen={setMenuOpen} onSearch={setSearch} />
      {content}
      <Footer goTo={goTo} />
      {cookieChoice === null && <CookieBanner onChoice={setCookieChoice} />}
    </div>
  );
}
