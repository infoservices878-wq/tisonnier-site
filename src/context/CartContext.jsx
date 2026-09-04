import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PRODUCTS, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "../data/products";

const CartContext = createContext(null);
const STORAGE_KEY = "ossau-bois-cart";

function readStoredCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) return {};
    return Object.fromEntries(
      Object.entries(stored).filter(([id, qty]) => PRODUCTS.some((product) => product.id === id) && Number.isInteger(qty) && qty > 0),
    );
  } catch {
    return {};
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(readStoredCart); // { [productId]: qty }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const add = (id, qty = 1) =>
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + qty }));

  const setQty = (id, qty) =>
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });

  const remove = (id) =>
    setCart((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });

  const clear = () => setCart({});

  const lines = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const product = PRODUCTS.find((p) => p.id === id);
        if (!product) return null;
        return { product, qty, lineTotal: product.price * qty };
      })
      .filter(Boolean);
  }, [cart]);

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const count = Object.values(cart).reduce((a, b) => a + b, 0);

  const value = {
    cart,
    lines,
    count,
    subtotal,
    shipping,
    total,
    add,
    setQty,
    remove,
    clear,
    FREE_SHIPPING_THRESHOLD,
    SHIPPING_FEE,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
