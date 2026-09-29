import { Flame, Layers, TreePine, Mountain, Sparkles } from "lucide-react";

export const CATEGORIES = [
  {
    id: "granules",
    name: "Holzpellets",
    icon: Flame,
    blurb: "Für Pelletöfen und automatische Heizungen",
    image: "/optimized/category-pellets.webp",
  },
  {
    id: "briquettes",
    name: "Holzbriketts",
    icon: Layers,
    blurb: "Lange Brenndauer, wenig Asche",
    image: "/optimized/category-wood-briquettes.webp",
  },
  {
    id: "bois-chauffage",
    name: "Brennholz",
    icon: TreePine,
    blurb: "Scheitholz und Holzscheite",
    image: "/optimized/category-firewood.webp",
  },
  {
    id: "charbon",
    name: "Kohle & Braunkohle",
    icon: Mountain,
    blurb: "Langanhaltende Glut, gleichmäßige Wärme",
    image: "/optimized/category-coal.webp",
  },
  {
    id: "allume-feu",
    name: "Anzündhilfen",
    icon: Sparkles,
    blurb: "Schnelles und geruchsarmes Anzünden",
    image: "/optimized/category-kindling.webp",
  },
];
