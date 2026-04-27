"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";

export function Providers({ children }: PropsWithChildren) {
  return (
    <NextAuthSessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </ThemeProvider>
    </NextAuthSessionProvider>
  );
}
