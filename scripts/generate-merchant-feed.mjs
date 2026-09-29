import { mkdir, writeFile } from "node:fs/promises";
import { PRODUCTS } from "../src/data/products.js";

const SITE_URL = "https://amholzbrennstoffeug.de";
const OUTPUT_PATH = "public/google-merchant-feed.csv";

const productTypes = {
  granules: "Brennstoffe > Holzpellets",
  briquettes: "Brennstoffe > Holzbriketts",
  "bois-chauffage": "Brennstoffe > Brennholz",
  charbon: "Brennstoffe > Kohle und Braunkohle",
  "allume-feu": "Brennstoffe > Anzündhilfen",
};

const headers = [
  "id",
  "title",
  "description",
  "link",
  "image_link",
  "availability",
  "price",
  "sale_price",
  "condition",
  "brand",
  "gtin",
  "mpn",
  "identifier_exists",
  "product_type",
  "custom_label_0",
];

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function absoluteUrl(path) {
  return new URL(path, SITE_URL).href;
}

function productDescription(product) {
  return [product.description, product.packaging, ...(product.benefits || [])]
    .filter(Boolean)
    .join(" ");
}

const rows = PRODUCTS.map((product) => {
  // In this catalogue, promoPrice is the price shown to the customer and price
  // is the crossed-out price when promoPrice exists.
  const regularPrice = product.promoPrice ?? product.price;
  const salePrice = product.promoPrice ? product.price : "";

  return {
    id: product.id,
    title: product.name,
    description: productDescription(product),
    link: absoluteUrl(`/produit/${product.id}`),
    image_link: absoluteUrl(product.image),
    availability: product.stock === "Auf Lager" ? "in_stock" : "out_of_stock",
    price: `${regularPrice.toFixed(2)} EUR`,
    sale_price: salePrice === "" ? "" : `${salePrice.toFixed(2)} EUR`,
    condition: "new",
    brand: product.brand || "Holzbrennstoffe",
    gtin: product.gtin || "",
    mpn: product.mpn || "",
    // No GTIN or manufacturer-assigned MPN is stored for these products.
    identifier_exists: product.gtin || product.mpn ? "yes" : "no",
    product_type: productTypes[product.category] || product.category,
    custom_label_0: product.reference || product.id,
  };
});

const csv = [headers, ...rows.map((row) => headers.map((header) => row[header]))]
  .map((row) => row.map(csvCell).join(","))
  .join("\n");

await mkdir("public", { recursive: true });
await writeFile(OUTPUT_PATH, `\uFEFF${csv}\n`, "utf8");
console.log(`Generated ${OUTPUT_PATH} with ${rows.length} products.`);
