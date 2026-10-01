import { Flame, Layers, TreePine, Mountain, Sparkles } from "lucide-react";

export const CATEGORIES = [
  {
    id: "granules",
    slug: "holzpellets",
    name: "Holzpellets",
    icon: Flame,
    blurb: "Für Pelletöfen und automatische Heizungen",
    image: "/optimized/category-pellets.jpg",
  },
  {
    id: "briquettes",
    slug: "holzbriketts",
    name: "Holzbriketts",
    icon: Layers,
    blurb: "Lange Brenndauer, wenig Asche",
    image: "/optimized/category-wood-briquettes.jpg",
  },
  {
    id: "bois-chauffage",
    slug: "brennholz",
    name: "Brennholz",
    icon: TreePine,
    blurb: "Scheitholz und Holzscheite",
    image: "/optimized/category-firewood.jpg",
  },
  {
    id: "charbon",
    slug: "kohle-braunkohle",
    name: "Kohle & Braunkohle",
    icon: Mountain,
    blurb: "Langanhaltende Glut, gleichmäßige Wärme",
    image: "/optimized/category-coal.jpg",
  },
  {
    id: "allume-feu",
    slug: "anzuendhilfen",
    name: "Anzündhilfen",
    icon: Sparkles,
    blurb: "Schnelles und geruchsarmes Anzünden",
    image: "/optimized/category-kindling.jpg",
  },
];
