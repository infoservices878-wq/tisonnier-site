/**
 * Client WooCommerce (stub).
 * Plus tard : brancher l'API REST WC avec VITE_WC_URL / clés.
 * Les pages catalogue / produit / panier pourront basculer
 * de `data/products.js` vers ces fonctions.
 */

const BASE = import.meta.env.VITE_WC_URL || "";
const KEY = import.meta.env.VITE_WC_CONSUMER_KEY || "";
const SECRET = import.meta.env.VITE_WC_CONSUMER_SECRET || "";

function authHeaders() {
  // Basic auth consumer key/secret (côté serveur préférable en prod)
  if (!KEY || !SECRET) return {};
  const token = btoa(`${KEY}:${SECRET}`);
  return { Authorization: `Basic ${token}` };
}

export async function fetchWcProducts(params = {}) {
  if (!BASE) {
    console.warn("[woocommerce] VITE_WC_URL non configuré — utiliser data locale");
    return null;
  }
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/wp-json/wc/v3/products?${qs}`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`WC products ${res.status}`);
  return res.json();
}

export async function fetchWcProduct(id) {
  if (!BASE) return null;
  const res = await fetch(`${BASE}/wp-json/wc/v3/products/${id}`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`WC product ${res.status}`);
  return res.json();
}

export function isWooConfigured() {
  return Boolean(BASE && KEY && SECRET);
}
