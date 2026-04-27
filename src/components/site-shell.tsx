"use client";

import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { ChatBot } from "./chat/ChatBot";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

export function SiteShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  return (
    <div className="flex min-h-screen flex-col">
      {!isAuthRoute && <Header />}
      <main className="flex-1">{children}</main>
      {!isAuthRoute && <Footer />}
      {!isAuthRoute && <ChatBot />}
    </div>
  );
}
