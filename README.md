# AM Holzbrennstoffe UG — site e-commerce (React + Vite)

Architecture modulaire prête pour une connexion **WooCommerce**.

## Structure

```
AM-Holzbrennstoffe-UG-site/
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
| `/katalog` | Catalogue |
| `/katalog/:categoryId` | Filtre catégorie |
| `/produkt/:productId` | Fiche produit |
| `/warenkorb` | Panier |
| `/bestellung` | Commande |
| `/anmelden` | Compte client |
| `/favoriten` | Favoris |
| `/kontakt` | Contact |
| `/ueber-uns` | À propos |
| `/lieferung` | Livraison sur palette |
| `/zahlung` | Paiement |
| `/retouren` | Retours |
| `/faq` | FAQ |
| `/impressum` | Mentions légales |
| `/datenschutz` | Confidentialité |
| `/agb` | CGV |

## Connexion WordPress et commandes

Le plugin à installer dans WordPress se trouve dans `server/wordpress-plugin/`.
L'URL de base doit être celle du site WordPress, sans `/wp-json` ni barre oblique finale. La valeur actuellement prévue est `https://boutique.amholzbrennstoffeug.de` ; vérifiez qu'elle correspond à l'adresse qui ouvre réellement WordPress.

Pour un déploiement Vite sur Hostinger, créez `.env.production` à partir de `.env.example`, renseignez `VITE_WORDPRESS_API_URL` et `VITE_WORDPRESS_API_KEY`, puis reconstruisez et redéployez le site. Vite intègre ces valeurs au moment de `npm run build` : changer une variable dans Hostinger après le build ne modifie pas le bundle déjà publié.

Dans `wp-config.php` du site WordPress, définissez le même jeton avant la ligne « That's all, stop editing » :

```php
define( 'OSSAU_ORDER_API_TOKEN', 'remplacer-par-un-jeton-long-et-aleatoire' );
define( 'OSSAU_FRONTEND_URL', 'https://amholzbrennstoffeug.de' );
```

Le nom de route historique est conservé pour compatibilité : les commandes sont envoyées à `/wp-json/ossau/v1/command`, les autres fonctions client à `/wp-json/ossau/v1/auth/...`.

**Sécurité :** `VITE_WORDPRESS_API_KEY` est public une fois le site compilé et visible par tout visiteur. Il ne doit pas être considéré comme un secret ni comme une protection contre les commandes frauduleuses. Pour une protection réelle, les requêtes doivent passer par un backend privé (proxy/API) qui conserve le secret côté serveur et valide les prix. Ne mettez jamais de clés WooCommerce `consumer_secret` dans une variable `VITE_*`.

Diagnostic rapide :

- `ossau_api_not_configured` (500) : le plugin est actif, mais `OSSAU_ORDER_API_TOKEN` manque dans `wp-config.php`.
- `rest_no_route` : vérifiez que le plugin est actif et que l'URL WordPress est correcte.
- `woocommerce_missing` : WooCommerce n'est pas actif sur ce WordPress.
- Erreur CORS dans la console du navigateur : autorisez l'origine exacte du site React sur WordPress et vérifiez que le serveur transmet l'en-tête `Authorization` aux requêtes REST.
- Réponse `rest_cookie_invalid_nonce` : une extension de sécurité, un proxy ou une règle serveur modifie l'accès à l'API REST.

Le plugin utilise WordPress pour les commandes, les formulaires de contact et les comptes clients. Le catalogue utilise encore les données locales de `src/data/products.js`.

## Build

```bash
npm run build
npm run preview
```
