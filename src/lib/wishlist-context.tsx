"use client";

import { createContext, useCallback, useContext, useEffect, useState, type PropsWithChildren } from "react";
import { useSession } from "next-auth/react";
import { getWishlistItemCount } from "@/lib/actions";

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
  const { data: session } = useSession();
  const [wishlistCount, setWishlistCount] = useState(0);

  const refreshWishlistCount = useCallback(async () => {
    if (session?.user?.id) {
      const count = await getWishlistItemCount();
      setWishlistCount(count);
    } else {
      setWishlistCount(0);
    }
  }, [session]);

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
