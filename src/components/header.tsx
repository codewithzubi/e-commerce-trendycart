"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { ShoppingCart, User, LogOut, Package, LayoutDashboard, Heart, Menu, X, Search, Sparkles, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

export function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const headerTextClass = isScrolled ? "text-slate-700 hover:text-slate-950" : "text-white/90 hover:text-white";
  const mutedTextClass = isScrolled ? "text-slate-500" : "text-white/70";
  const iconButtonClass = cn(
    "rounded-full transition-all duration-300 hover:scale-105",
    isScrolled
      ? "text-slate-700 hover:bg-slate-900/5 hover:text-slate-950"
      : "text-white/90 hover:bg-white/10 hover:text-white"
  );

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-white/10 bg-white/90 shadow-[0_12px_40px_rgba(15,23,42,0.14)] backdrop-blur-xl dark:bg-slate-950/90"
          : "border-b border-white/10 bg-gradient-to-r from-[#4c1d95]/70 via-[#be185d]/60 to-[#2563eb]/65 shadow-[0_8px_30px_rgba(76,29,149,0.12)] backdrop-blur-xl"
      )}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 left-10 h-40 w-40 rounded-full bg-fuchsia-400/15 blur-3xl" />
        <div className="absolute -top-16 right-10 h-44 w-44 rounded-full bg-cyan-400/15 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="flex min-h-[4.75rem] items-center justify-between gap-4 py-2">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]">
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-2xl border shadow-lg backdrop-blur-md transition-all duration-300 group-hover:-rotate-6",
                isScrolled
                  ? "border-fuchsia-200 bg-gradient-to-br from-fuchsia-500/15 via-pink-500/10 to-cyan-500/10 shadow-fuchsia-500/10"
                  : "border-white/20 bg-white/15 shadow-fuchsia-500/10 group-hover:shadow-fuchsia-500/20"
              )}
            >
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <span
                className={cn(
                  "block text-lg sm:text-xl font-black tracking-tight bg-clip-text text-transparent",
                  isScrolled
                    ? "bg-gradient-to-r from-[#4c1d95] via-[#be185d] to-[#2563eb]"
                    : "bg-gradient-to-r from-white via-cyan-100 to-pink-100"
                )}
              >
                TrendyCart
              </span>
              <span className={cn("hidden sm:block text-[11px] uppercase tracking-[0.3em]", mutedTextClass)}>
                Premium Shopping
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form action="/products" method="GET" className="hidden lg:block flex-1 max-w-2xl mx-4">
            <div className="group relative">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-400 opacity-45 blur transition-opacity duration-300 group-focus-within:opacity-80" />
              <div
                className={cn(
                  "relative flex items-center overflow-hidden rounded-full border backdrop-blur-xl shadow-lg shadow-black/5 transition-all duration-300 group-focus-within:shadow-[0_0_0_1px_rgba(236,72,153,0.18),0_18px_40px_rgba(15,23,42,0.12)]",
                  isScrolled
                    ? "border-slate-200/80 bg-white/80 group-focus-within:border-fuchsia-300 group-focus-within:bg-white"
                    : "border-white/20 bg-white/15 group-focus-within:border-white/40 group-focus-within:bg-white/25"
                )}
              >
                <Search className={cn("ml-4 h-4 w-4", isScrolled ? "text-slate-500" : "text-white/75")} />
                <Input
                  name="search"
                  type="text"
                  placeholder="Search products, brands, and categories..."
                  className={cn(
                    "h-12 border-0 bg-transparent px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0",
                    isScrolled
                      ? "text-slate-900 placeholder:text-slate-500"
                      : "text-white placeholder:text-white/60"
                  )}
                />
                <button
                  type="submit"
                  className="mr-1 inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 px-5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-fuchsia-500/35"
                >
                  <Sparkles className="h-4 w-4" />
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={cn("rounded-full px-4 py-2 text-sm font-medium transition-all duration-300", headerTextClass, isScrolled ? "hover:bg-slate-900/5" : "hover:bg-white/10")}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={cn("rounded-full px-4 py-2 text-sm font-medium transition-all duration-300", headerTextClass, isScrolled ? "hover:bg-slate-900/5" : "hover:bg-white/10")}
            >
              Products
            </Link>
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className={cn("rounded-full px-4 py-2 text-sm font-medium transition-all duration-300", headerTextClass, isScrolled ? "hover:bg-slate-900/5" : "hover:bg-white/10")}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />

            {/* Wishlist */}
            <Link href="/wishlist" aria-label={`Wishlist${wishlistCount > 0 ? ` (${wishlistCount})` : ""}`}>
              <Button variant="ghost" size="icon" className={cn("relative hidden sm:inline-flex", iconButtonClass)}>
                <Heart className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
                {wishlistCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white px-1 text-[10px] font-bold text-white shadow-lg shadow-pink-500/30 dark:border-slate-950"
                    style={{
                      background: "linear-gradient(135deg, #ec4899 0%, #7c3aed 55%, #06b6d4 100%)",
                    }}
                  >
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart" aria-label={`Cart${cartCount > 0 ? ` (${cartCount})` : ""}`}>
              <Button
                variant="ghost"
                size="icon"
                className={cn("relative", iconButtonClass)}
              >
                <ShoppingCart className="h-5 w-5 transition-transform duration-300 hover:rotate-[-8deg]" />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white px-1 text-[10px] font-bold text-white shadow-lg shadow-pink-500/30 dark:border-slate-950"
                    style={{
                      background: "linear-gradient(135deg, #ec4899 0%, #7c3aed 55%, #06b6d4 100%)",
                    }}
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn("md:hidden", iconButtonClass)}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Desktop user menu */}
            <div className="hidden md:block">
              {status === "loading" ? (
                <div className="h-10 w-24 rounded-full bg-white/15 animate-pulse" />
              ) : session ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={iconButtonClass}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <User className="h-5 w-5" />
                  </Button>

                  {isMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsMenuOpen(false)}
                      />
                      <div
                        className={cn(
                          "absolute right-0 mt-3 w-64 overflow-hidden rounded-3xl py-2 shadow-[0_24px_80px_rgba(15,23,42,0.35)] backdrop-blur-xl z-50",
                          isScrolled
                            ? "border border-slate-200/80 bg-white/95"
                            : "border border-white/20 bg-slate-950/95"
                        )}
                      >
                        <div className={cn("border-b px-4 py-4", isScrolled ? "border-slate-200 bg-gradient-to-r from-fuchsia-500/10 via-pink-500/5 to-cyan-500/10" : "border-white/10 bg-gradient-to-r from-fuchsia-500/20 via-pink-500/10 to-cyan-500/20")}>
                          <p className={cn("text-sm font-medium truncate", isScrolled ? "text-slate-900" : "text-white")}>{session.user?.name}</p>
                          <p className={cn("text-xs truncate", isScrolled ? "text-slate-500" : "text-white/70")}>{session.user?.email}</p>
                          {session.user?.role === "ADMIN" && (
                            <Badge
                              variant="default"
                              className={cn("mt-2 border-0 text-xs text-white", isScrolled && "text-white")}
                              style={{
                                background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
                              }}
                            >
                              Admin
                            </Badge>
                          )}
                        </div>
                        <Link
                          href="/dashboard"
                          className={cn("flex items-center px-4 py-3 text-sm transition-colors", isScrolled ? "text-slate-700 hover:bg-slate-900/5 hover:text-slate-950" : "text-white/90 hover:bg-white/10 hover:text-white")}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                        <Link
                          href="/orders"
                          className={cn("flex items-center px-4 py-3 text-sm transition-colors", isScrolled ? "text-slate-700 hover:bg-slate-900/5 hover:text-slate-950" : "text-white/90 hover:bg-white/10 hover:text-white")}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Package className="h-4 w-4 mr-2" />
                          Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          className={cn("flex items-center px-4 py-3 text-sm transition-colors sm:hidden", isScrolled ? "text-slate-700 hover:bg-slate-900/5 hover:text-slate-950" : "text-white/90 hover:bg-white/10 hover:text-white")}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Wishlist
                        </Link>
                        {session.user?.role === "ADMIN" && (
                          <Link
                            href="/admin"
                            className={cn("flex items-center px-4 py-3 text-sm transition-colors", isScrolled ? "text-slate-700 hover:bg-slate-900/5 hover:text-slate-950" : "text-white/90 hover:bg-white/10 hover:text-white")}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            signOut({ redirectTo: "/" });
                            setIsMenuOpen(false);
                          }}
                          className={cn("flex items-center w-full px-4 py-3 text-sm transition-colors", isScrolled ? "text-rose-600 hover:bg-rose-500/10 hover:text-rose-700" : "text-rose-300 hover:bg-rose-500/10 hover:text-rose-200")}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Button
                  onClick={() => signIn()}
                  size="sm"
                  variant="outline"
                  className={cn(
                    "rounded-full border-slate-200/80 bg-white/70 px-4 font-medium text-slate-800 shadow-none transition-all duration-300 hover:bg-white hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
                    isScrolled ? "border-slate-200/80" : "border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white"
                  )}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden border-t border-white/10 transition-all duration-300 ease-out",
            isMobileMenuOpen
              ? "max-h-[32rem] opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
          )}
        >
          <div className="space-y-3 px-4 py-4 bg-gradient-to-b from-[#4c1d95]/90 via-[#be185d]/85 to-[#0f172a]/95 backdrop-blur-xl">
            <form action="/products" method="GET" className="lg:hidden">
              <div className="group relative">
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-400 opacity-45 blur" />
                <div className="relative flex items-center overflow-hidden rounded-full border border-white/20 bg-white/15 backdrop-blur-xl">
                  <Search className="ml-4 h-4 w-4 text-white/75" />
                  <Input
                    name="search"
                    type="text"
                    placeholder="Search products..."
                    className="h-11 border-0 bg-transparent px-3 text-sm text-white placeholder:text-white/60 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
            </form>

            <Link
              href="/"
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products"
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 sm:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Wishlist
              <span className="inline-flex items-center gap-2">
                {wishlistCount > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 px-1 text-[10px] font-bold text-white">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
                <Heart className="h-4 w-4" />
              </span>
            </Link>
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Panel
                <LayoutDashboard className="h-4 w-4" />
              </Link>
            )}

            <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
              {status !== "loading" && session ? (
                <>
                  <div className="pb-3">
              <p className="text-sm font-medium text-white">{session.user?.name}</p>
              <p className="text-xs text-white/70">{session.user?.email}</p>
            </div>
                  <div className="space-y-2">
                    <Link
                      href="/dashboard"
                      className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/90 transition-colors hover:bg-white/10"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                      <LayoutDashboard className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/90 transition-colors hover:bg-white/10"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Orders
                      <Package className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => {
                        signOut({ redirectTo: "/" });
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200 transition-colors hover:bg-rose-500/20"
                    >
                      Logout
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <Button
                  onClick={() => signIn()}
                  variant="outline"
                  className="w-full rounded-full border-white/15 bg-white/10 text-white hover:bg-white/15"
                  size="sm"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
