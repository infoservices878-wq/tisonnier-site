import { Flame, Layers, TreePine, Mountain, Sparkles } from "lucide-react";

export const CATEGORIES = [
  {
    id: "granules",
    name: "Granulés de bois",
    icon: Flame,
    blurb: "Pour poêles et chaudières automatiques",
    image: "/category-pellets.jpg",
  },
  {
    id: "briquettes",
    name: "Briquettes de bois",
    icon: Layers,
    blurb: "Combustion longue, faible entretien",
    image: "/category-wood-briquettes.jpg",
  },
  {
    id: "bois-chauffage",
    name: "Bois de chauffage",
    icon: TreePine,
    blurb: "Bûches et bûchettes compressées",
    image: "/category-firewood.jpg",
  },
  {
    id: "charbon",
    name: "Charbon & lignite",
    icon: Mountain,
    blurb: "Braises durables, chaleur continue",
    image: "/category-coal.jpg",
  },
  {
    id: "allume-feu",
    name: "Allume-feu",
    icon: Sparkles,
    blurb: "Démarrage rapide et sans odeur",
    image: "/category-kindling.jpg",
  },
];
