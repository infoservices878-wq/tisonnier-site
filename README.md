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

## Connexion WordPress et commandes

Le formulaire de commande appelle directement l'endpoint WordPress :
`https://boutique.ossau-bois.com/wp-json/ossau/v1/command`.

Dans `.env`, configure :

```env
VITE_WORDPRESS_API_URL=https://boutique.ossau-bois.com
VITE_WORDPRESS_API_KEY=le-token-attendu-par-wordpress
```

La clé est intégrée au bundle du navigateur au moment du build.
Le serveur WordPress doit donc autoriser l'origine du frontend avec CORS.

Le catalogue utilise encore les données locales de `src/data/products.js`.

## Build

```bash
npm run build
npm run preview
```
