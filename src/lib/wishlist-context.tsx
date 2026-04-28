"use client";

import { createContext, useCallback, useContext, useEffect, useState, type PropsWithChildren } from "react";

interface WishlistContextType {
  wishlistCount: number;
  refreshWishlistCount: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistCount: 0,
  refreshWishlistCount: async () => {},
});

export function useWishlist() {
  return useContext(WishlistContext);
}

export function WishlistProvider({ children }: PropsWithChildren) {
  const [wishlistCount, setWishlistCount] = useState(0);

  const refreshWishlistCount = useCallback(async () => {
    try {
      const response = await fetch("/api/wishlist/count", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        setWishlistCount(0);
        return;
      }

      const data = (await response.json()) as { count?: number };
      setWishlistCount(typeof data.count === "number" ? data.count : 0);
    } catch {
      setWishlistCount(0);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshWishlistCount();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [refreshWishlistCount]);

  return (
    <WishlistContext.Provider value={{ wishlistCount, refreshWishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
}
