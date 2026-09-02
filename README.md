# OSSAU BOIS — site e-commerce (React + Vite)

Architecture modulaire prête pour une connexion **WooCommerce**.

## Structure

```
OSSAU BOIS-site/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/          # UI réutilisable
│   │   ├── CookieConsent.jsx
│   │   ├── FaqSection.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Logo.jsx
│   │   ├── ProductCard.jsx
│   │   └── ScrollToTop.jsx
│   ├── context/
│   │   └── CartContext.jsx
│   ├── data/                # Données locales (remplaçables par WC)
│   │   ├── categories.js
│   │   ├── faq.js
│   │   ├── legalContent.js
│   │   └── products.js
│   ├── hooks/
│   ├── lib/
│   │   ├── format.js
│   │   └── woocommerce.js   # Stub API WooCommerce
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── Cart.jsx
│   │   ├── Catalogue.jsx
│   │   ├── Contact.jsx
│   │   ├── Delivery.jsx
│   │   ├── FAQ.jsx
│   │   ├── Home.jsx
│   │   ├── LegalPage.jsx
│   │   ├── NotFound.jsx
│   │   └── ProductDetail.jsx
│   ├── App.jsx              # Routes uniquement
│   ├── index.css
│   └── main.jsx
├── .env.example
├── package.json
├── vite.config.js
└── README.md
```

## Démarrage

```bash
npm install
npm run dev
```

## Routes

| URL | Page |
|-----|------|
| `/` | Accueil (+ FAQ) |
| `/catalogue` | Catalogue |
| `/catalogue/:categoryId` | Filtre catégorie |
| `/produit/:productId` | Fiche produit |
| `/panier` | Panier |
| `/contact` | Contact |
| `/entreprise` | À propos |
| `/livraison` | Livraison / retrait |
| `/faq` | FAQ |
| `/mentions-legales` | Mentions légales |
| `/politique-de-confidentialite` | Confidentialité |
| `/conditions-generales-de-vente` | CGV |

## WooCommerce (plus tard)

1. Copier `.env.example` → `.env`
2. Renseigner `VITE_WC_URL`, clé et secret
3. Utiliser `src/lib/woocommerce.js` dans Catalogue / ProductDetail
4. Remplacer progressivement `data/products.js` par l’API WC

## Build

```bash
npm run build
npm run preview
```
