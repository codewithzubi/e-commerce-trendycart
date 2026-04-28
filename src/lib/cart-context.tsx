"use client";

import { createContext, useContext, useState, useCallback, useEffect, type PropsWithChildren } from "react";

interface CartContextType {
  cartCount: number;
  refreshCartCount: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  refreshCartCount: async () => {},
});

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }: PropsWithChildren) {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = useCallback(async () => {
    try {
      const response = await fetch("/api/cart/count", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        setCartCount(0);
        return;
      }

      const data = (await response.json()) as { count?: number };
      setCartCount(typeof data.count === "number" ? data.count : 0);
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshCartCount();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [refreshCartCount]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount }}>
      {children}
    </CartContext.Provider>
  );
}
