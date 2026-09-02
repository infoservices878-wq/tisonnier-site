# Tisonnier — site de démonstration

Site e-commerce (React + Vite) pour une marque fictive de combustibles solides
(granulés, briquettes, bois de chauffage, charbon, allume-feu), inspiré du
fonctionnement d'un site comme PelletWerk mais avec identité, contenus et
design originaux.

## Lancer le projet en local

Prérequis : [Node.js](https://nodejs.org) 18 ou plus récent.

```bash
npm install
npm run dev
```

Le site est alors accessible sur http://localhost:5173

## Build de production

```bash
npm run build
npm run preview
```

Les fichiers finaux sont générés dans le dossier `dist/`.

## Structure

```
index.html          point d'entrée HTML
src/main.jsx         montage React
src/App.jsx           composant unique : toutes les pages, données produits, styles
```

## À faire avant une mise en ligne réelle

- Remplacer les informations fictives (entreprise, adresse, téléphone, e-mail)
- Brancher un vrai backend pour le panier, le paiement et l'envoi du formulaire de contact
- Ajouter un vrai routing par URL (ex. react-router) si besoin de liens partageables par page
- Remplacer les icônes de visuel produit par de vraies photos
