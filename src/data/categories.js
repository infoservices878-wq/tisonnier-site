import { Flame, Layers, TreePine, Mountain, Sparkles } from "lucide-react";

export const CATEGORIES = [
  {
    id: "granules",
    name: "Granulés de bois",
    icon: Flame,
    blurb: "Pour poêles et chaudières automatiques",
    image: "/optimized/category-pellets.webp",
  },
  {
    id: "briquettes",
    name: "Briquettes de bois",
    icon: Layers,
    blurb: "Combustion longue, faible entretien",
    image: "/optimized/category-wood-briquettes.webp",
  },
  {
    id: "bois-chauffage",
    name: "Bois de chauffage",
    icon: TreePine,
    blurb: "Bûches et bûchettes compressées",
    image: "/optimized/category-firewood.webp",
  },
  {
    id: "charbon",
    name: "Charbon & lignite",
    icon: Mountain,
    blurb: "Braises durables, chaleur continue",
    image: "/optimized/category-coal.webp",
  },
  {
    id: "allume-feu",
    name: "Allume-feu",
    icon: Sparkles,
    blurb: "Démarrage rapide et sans odeur",
    image: "/optimized/category-kindling.webp",
  },
];
