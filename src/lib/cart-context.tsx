"use client";

import { createContext, useContext, useState, useCallback, useEffect, type PropsWithChildren } from "react";
import { getCartItemCount } from "@/lib/actions";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = useCallback(async () => {
    if (session?.user?.id) {
      const count = await getCartItemCount();
      setCartCount(count);
    } else {
      setCartCount(0);
    }
  }, [session]);

  useEffect(() => {
    refreshCartCount();
  }, [refreshCartCount]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount }}>
      {children}
    </CartContext.Provider>
  );
}
