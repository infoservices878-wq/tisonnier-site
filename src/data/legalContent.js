/** Informations d’identification publiques vérifiées le 03/09/2026. */

export const COMPANY = {
  name: "OSSAU BOIS",
  legalForm: "SARL, société à responsabilité limitée",
  capital: "10 000 €",
  siren: "101 289 247",
  address: "6 chemin de l'Oasis",
  city: "64260 Gère-Bélesten",
  country: "France",
  rcs: "101 289 247 R.C.S. Pau",
  siret: "101 289 247 00013",
  tva: "FR24101289247",
  manager: "Marie Bourdieu",
  inpiExtractUrl: "https://data.inpi.fr/export/companies?format=pdf&ids=[%22101289247%22]",
  email: "info@ossau-bois.com",
  phone: "+33 1 23 45 67 89",
  phoneHref: "tel:+33123456789",
  hours: "Lundi–vendredi, 08:00–16:00",
  warehouse: {
    address: "ZA, Rue de l'Europe",
    city: "57370 Phalsbourg",
    country: "France",
    note: "Retrait et paiement sur place uniquement après réservation et confirmation préalables.",
  },
};

export const MENTIONS_SECTIONS = [
  {
    title: "Éditeur du site",
    html: `<strong>${COMPANY.name}</strong><br />
      ${COMPANY.legalForm} au capital de ${COMPANY.capital}<br />
      ${COMPANY.address}, ${COMPANY.city}, ${COMPANY.country}<br />
      ${COMPANY.rcs}<br />
      SIRET : ${COMPANY.siret}<br />
      TVA intracommunautaire : ${COMPANY.tva}<br />
      Gérant : ${COMPANY.manager}`,
  },
  {
    title: "Contact",
    html: `E-mail : <a href="mailto:${COMPANY.email}">${COMPANY.email}</a><br />
      Téléphone : ${COMPANY.phone}<br />
      Horaires : ${COMPANY.hours}`,
  },
  {
    title: "Hébergement",
    html: `Les coordonnées de l'hébergeur et du responsable technique du site sont tenues à
      disposition du client et peuvent être communiquées sur demande à l'adresse
      <a href="mailto:${COMPANY.email}">${COMPANY.email}</a>.`,
  },
  {
    title: "Propriété intellectuelle",
    html: `L'ensemble des éléments du site (textes, visuels, structure, marques)
      est protégé. Toute reproduction non autorisée est interdite.
      Toute demande relative à l'utilisation d'un contenu doit être adressée à ${COMPANY.email}.`,
  },
];

export const PRIVACY_SECTIONS = [
  {
    title: "1. Responsable du traitement",
    html: `${COMPANY.name} — ${COMPANY.address}, ${COMPANY.city} —
      <a href="mailto:${COMPANY.email}">${COMPANY.email}</a>`,
  },
  {
    title: "2. Données collectées",
    html: `Via le formulaire de contact : nom, adresse e-mail, contenu du message.
      Via la navigation : données techniques usuelles (adresse IP, type de navigateur)
      si des outils d'audience sont activés.`,
  },
  {
    title: "3. Finalités",
    html: `<ul>
      <li>Répondre aux demandes de contact et de devis</li>
      <li>Traiter les commandes et la relation client</li>
      <li>Améliorer le site et la sécurité (logs techniques)</li>
    </ul>`,
  },
  {
    title: "4. Base légale",
    html: `Exécution de mesures précontractuelles ou contractuelles, intérêt légitime
      (sécurité, amélioration du service) et, le cas échéant, consentement (cookies non essentiels).`,
  },
  {
    title: "5. Durée de conservation",
    html: `Messages de contact : 3 ans après le dernier échange.
      Données de commande : durée légale comptable et fiscale.`,
  },
  {
    title: "6. Destinataires",
    html: `Personnel habilité de OSSAU BOIS et prestataires techniques strictement
      nécessaires (hébergeur, transporteur). Aucune vente de données.`,
  },
  {
    title: "7. Vos droits",
    html: `Vous disposez des droits d'accès, de rectification, d'effacement,
      de limitation, d'opposition et de portabilité, dans les conditions prévues par le RGPD.
      Pour les exercer : <a href="mailto:${COMPANY.email}">${COMPANY.email}</a>.
      Vous pouvez également saisir la CNIL.`,
  },
  {
    title: "8. Cookies",
    html: `Le bandeau cookies permet d'accepter ou de refuser les traceurs non
      essentiels. Les préférences peuvent être modifiées à tout moment.`,
  },
];

export const CGV_SECTIONS = [
  {
    title: "Article 1 — Objet",
    html: `Les présentes CGV régissent les ventes de produits (granulés, briquettes,
      bois de chauffage, charbon, allume-feu) proposés par ${COMPANY.name} aux
      clients particuliers et professionnels.`,
  },
  {
    title: "Article 2 — Produits et prix",
    html: `Les caractéristiques essentielles des produits figurent sur les fiches
      catalogue. Les prix sont indiqués en euros TTC. OSSAU BOIS se réserve
      le droit de modifier ses tarifs ; le prix applicable est celui affiché
      au moment de la validation de la commande.`,
  },
  {
    title: "Article 3 — Commande",
    html: `La commande est ferme après validation et paiement (ou confirmation
      écrite pour un retrait sur place). Un e-mail de confirmation récapitule
      le contenu, le montant et les modalités de livraison ou de retrait.`,
  },
  {
    title: "Article 4 — Livraison",
    html: `Livraison sur palette au bord de voie carrossable. Délai indicatif :
      6 à 8 jours ouvrés. Le client doit vérifier l'état de la marchandise
      à réception et émettre des réserves motivées sur le bon de livraison
      en cas d'anomalie.`,
  },
  {
    title: "Article 5 — Retrait sur place",
    html: `Possible uniquement sur rendez-vous confirmé, avec véhicule adapté.
      Paiement sur place accepté le jour du retrait.`,
  },
  {
    title: "Article 6 — Droit de rétractation",
    html: `Conformément au Code de la consommation, le client particulier dispose
      d'un délai de 14 jours pour se rétracter, sauf exceptions légales
      (produits susceptibles de se détériorer rapidement, etc.). Les frais
      de retour restent à la charge du client sauf accord contraire.`,
  },
  {
    title: "Article 7 — Garantie et réclamations",
    html: `Les produits bénéficient de la garantie légale de conformité et de la
      garantie des vices cachés. Toute réclamation doit être adressée à
      ${COMPANY.email} avec photos et n° de commande.`,
  },
  {
    title: "Article 8 — Responsabilité",
    html: `OSSAU BOIS ne saurait être tenu responsable des dommages indirects.
      L'usage des combustibles doit respecter les consignes des appareils
      de chauffage et la réglementation en vigueur.`,
  },
  {
    title: "Article 9 — Droit applicable",
    html: `Les présentes CGV sont soumises au droit français. En cas de litige,
      une solution amiable sera recherchée avant toute action judiciaire.`,
  },
];
