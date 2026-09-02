/** Catalogue produits (source locale — sera remplacé / synchronisé avec WooCommerce) */
export const PRODUCTS = [
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

export const FREE_SHIPPING_THRESHOLD = 229;
export const SHIPPING_FEE = 24.9;

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

export function filterProducts({ category = null, search = "" } = {}) {
  return PRODUCTS
    .filter((p) => (category ? p.category === category : true))
    .filter((p) =>
      search
        ? p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
        : true
    );
}
