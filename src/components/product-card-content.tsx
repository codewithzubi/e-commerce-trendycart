"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/types";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { formatPrice, cn } from "@/lib/utils";
import { ShoppingCart, Star, Heart, Zap } from "lucide-react";
import { addToCart, toggleWishlist } from "@/lib/actions";
import { toast } from "sonner";
import { useWishlist } from "@/lib/wishlist-context";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

interface ProductCardContentProps {
  product: Product;
}

export function ProductCardContent({ product }: ProductCardContentProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { refreshWishlistCount } = useWishlist();

  const imageUrl =
    product.thumbnail ||
    (product.images ? JSON.parse(product.images as string)[0] : null) ||
    "/placeholder-product.jpg";
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
  const isOutOfStock = product.trackInventory && product.stock === 0;
  const isNew = Date.now() - new Date(product.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;

  async function handleAddToCart() {
    if (isAddingToCart || isOutOfStock) return;
    setIsAddingToCart(true);
    try {
      await addToCart(product.id, 1);
      toast.success("Added to cart", {
        description: product.title,
      });
    } catch (error: unknown) {
      if (getErrorMessage(error).includes("NEXT_REDIRECT")) throw error;
      toast.error("Failed to add to cart", { description: getErrorMessage(error) });
    } finally {
      setIsAddingToCart(false);
    }
  }

  async function handleToggleWishlist() {
    if (isWishlistLoading) return;
    setIsWishlistLoading(true);
    try {
      const result = await toggleWishlist(product.id);
      setIsInWishlist(result.added);
      await refreshWishlistCount();
      toast.success(result.added ? "Added to wishlist" : "Removed from wishlist", {
        description: product.title,
      });
    } catch (error: unknown) {
      if (getErrorMessage(error).includes("NEXT_REDIRECT")) return;
      toast.error("Failed to update wishlist", { description: getErrorMessage(error) });
    } finally {
      setIsWishlistLoading(false);
    }
  }

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-purple-100/70 bg-white shadow-[0_16px_50px_rgba(76,29,149,0.08)] transition-all duration-500 hover:-translate-y-2 hover:border-purple-300/70 hover:shadow-[0_28px_70px_rgba(76,29,149,0.16)] dark:border-white/10 dark:bg-slate-950/80 dark:hover:border-purple-700/60">
      {/* Image */}
      <div className="relative">
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-[4/5] overflow-hidden bg-gradient-to-b from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900"
        >
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </Link>

        {/* Badges */}
        <div className="absolute left-3 top-3 z-20 flex max-w-[70%] flex-col gap-2">
          {hasDiscount && (
            <Badge className="border-0 bg-gradient-to-r from-rose-500 to-pink-500 text-[11px] font-bold text-white shadow-lg">
              {discountPercentage}% OFF
            </Badge>
          )}
          {isNew && !hasDiscount && (
            <Badge className="border-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-[11px] font-bold text-white shadow-lg">
              NEW
            </Badge>
          )}
          {product.isFeatured && (
            <Badge className="border-0 bg-gradient-to-r from-violet-600 to-purple-600 text-[11px] font-bold text-white shadow-lg">
              TRENDING
            </Badge>
          )}
        </div>

        {/* Wishlist */}
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleToggleWishlist();
          }}
          disabled={isWishlistLoading}
          className={cn(
            "absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-110",
            isInWishlist
              ? "border-rose-200 bg-rose-50/95 text-rose-500 shadow-lg dark:border-rose-900/40 dark:bg-rose-950/60 dark:text-rose-300"
              : "border-white/30 bg-white/90 text-slate-600 shadow-lg dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-300"
          )}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("h-4 w-4 transition-all duration-300", isInWishlist && "fill-current")} />
        </Button>

        {/* Hover CTA */}
        <div className="absolute inset-x-0 bottom-0 z-20 translate-y-full p-3 transition-transform duration-500 ease-out group-hover:translate-y-0">
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
            disabled={isOutOfStock || isAddingToCart}
            className="h-11 w-full border-0 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 font-semibold text-white shadow-[0_16px_35px_rgba(236,72,153,0.28)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_18px_45px_rgba(236,72,153,0.34)]"
            size="sm"
          >
            {isAddingToCart ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Adding...
              </div>
            ) : isOutOfStock ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/55 backdrop-blur-sm dark:bg-slate-950/55">
            <Badge className="border-0 bg-slate-950/90 px-4 py-2 text-sm font-bold text-white dark:bg-white/90 dark:text-slate-950">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        {product.brand && (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            {product.brand}
          </p>
        )}

        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-purple-700 dark:text-slate-100 dark:group-hover:text-purple-300 sm:text-[15px]">
            {product.title}
          </h3>
        </Link>

        {product.category && (
          <p className="text-xs text-muted-foreground">{product.category.name}</p>
        )}

        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {product.averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({product.reviewCount})
            </span>
          </div>
        )}

        <div className="flex items-baseline gap-2 pt-1">
          {hasDiscount ? (
            <>
              <span className="text-xl font-black bg-gradient-to-r from-fuchsia-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                {formatPrice(product.discountPrice!)}
              </span>
              <span className="text-sm font-medium text-slate-500 line-through dark:text-slate-400">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-xl font-black text-slate-900 dark:text-slate-100">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {isLowStock && !isOutOfStock && (
          <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
            <Zap className="h-3.5 w-3.5 animate-pulse" />
            <span className="text-xs font-semibold">Only {product.stock} left!</span>
          </div>
        )}

        <div className="mt-auto hidden pt-2 lg:block">
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAddingToCart}
            className="h-11 w-full border-0 bg-gradient-to-r from-violet-600 to-purple-600 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-violet-700 hover:to-purple-700 hover:shadow-lg"
            size="sm"
          >
            {isAddingToCart ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Adding...
              </div>
            ) : isOutOfStock ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile bottom CTA */}
      <div className="border-t border-purple-100/70 px-4 pb-4 pt-0 lg:hidden dark:border-white/10">
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingToCart}
          className="h-11 w-full border-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg"
          size="sm"
        >
          {isAddingToCart ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Adding...
            </div>
          ) : isOutOfStock ? (
            "Out of Stock"
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
