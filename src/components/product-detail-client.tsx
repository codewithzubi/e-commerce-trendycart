"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { addToCart, toggleWishlist } from "@/lib/actions";
import { useCart } from "@/lib/cart-context";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types";
import {
  Share2,
  ShoppingBag,
  ShoppingCart,
  ShieldCheck,
  Star,
  Truck,
  RefreshCw,
  Heart,
  Minus,
  Plus,
  ImageIcon,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import type { ProductVariant } from "@/types";
import { useWishlist } from "@/lib/wishlist-context";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

interface ProductDetailClientProps {
  product: Product;
  images: string[];
}

function getVariantLabel(variant: ProductVariant) {
  return [variant.color, variant.size, variant.material, variant.style]
    .filter(Boolean)
    .join(" / ") || "Variant";
}

export function ProductDetailClient({ product, images }: ProductDetailClientProps) {
  const { refreshCartCount } = useCart();
  const { refreshWishlistCount } = useWishlist();
  const [mainImage, setMainImage] = useState(
    images[0] || product.thumbnail || "/placeholder-product.jpg"
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants?.[0]?.id || null
  );
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const selectedVariant = useMemo(
    () => product.variants?.find((variant) => variant.id === selectedVariantId) || null,
    [product.variants, selectedVariantId]
  );
  const effectivePrice = selectedVariant?.price ?? product.discountPrice ?? product.price;
  const originalPrice = selectedVariant?.price
    ? product.price
    : hasDiscount
      ? product.price
      : null;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
  const isOutOfStock = product.trackInventory && product.stock === 0;

  async function handleAddToCart() {
    if (isOutOfStock || isAddingToCart) return;
    setIsAddingToCart(true);
    try {
      await addToCart(product.id, quantity, selectedVariantId || undefined);
      await refreshCartCount();
      toast.success("Added to cart", { description: product.title });
    } catch (error: unknown) {
      if (getErrorMessage(error).includes("NEXT_REDIRECT")) {
        return;
      }
      toast.error("Failed to add to cart", {
        description: getErrorMessage(error),
      });
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
      if (getErrorMessage(error).includes("NEXT_REDIRECT")) {
        return;
      }
      toast.error("Failed to update wishlist", {
        description: getErrorMessage(error),
      });
    } finally {
      setIsWishlistLoading(false);
    }
  }

  return (
    <div className="pb-28 md:pb-0">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-[2rem] border border-purple-100/70 bg-gradient-to-b from-slate-50 to-white shadow-[0_24px_80px_rgba(76,29,149,0.12)] dark:border-white/10 dark:from-slate-950 dark:to-slate-900">
            <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
              {hasDiscount && (
                <Badge className="border-0 bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/20">
                  -{discountPercentage}% OFF
                </Badge>
              )}
              {isLowStock && !isOutOfStock && (
                <Badge className="border-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20">
                  Only {product.stock} left
                </Badge>
              )}
              {product.isFreeShipping && (
                <Badge className="border-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20">
                  Free Shipping
                </Badge>
              )}
            </div>

            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={mainImage}
                alt={product.title}
                fill
                priority
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
              {images.map((img, index) => {
                const active = img === mainImage;
                return (
                  <button
                    key={`${img}-${index}`}
                    type="button"
                    onClick={() => setMainImage(img)}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border-2 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-slate-950",
                      active
                        ? "border-purple-500 ring-2 ring-purple-500/20"
                        : "border-transparent hover:border-purple-200 dark:hover:border-purple-700"
                    )}
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={img}
                        alt={`${product.title} image ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="120px"
                      />
                    </div>
                    {active && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:sticky lg:top-24">
          <div className="rounded-[2rem] border border-purple-100/70 bg-white/90 p-6 shadow-[0_24px_80px_rgba(76,29,149,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80 sm:p-8">
            {product.brand && (
              <div className="mb-3 inline-flex rounded-full border border-purple-200/70 bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-purple-700 dark:border-purple-900/40 dark:bg-purple-950/40 dark:text-purple-300">
                {product.brand}
              </div>
            )}

            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-r from-purple-700 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                {product.title}
              </span>
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={cn(
                      "h-4 w-4",
                      index < Math.round(product.averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300 dark:text-slate-700"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {product.reviewCount > 0 ? product.averageRating.toFixed(1) : "0.0"}
              </span>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount} review{product.reviewCount !== 1 ? "s" : ""})
              </span>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex flex-wrap items-end gap-3">
                <span className="text-4xl font-black tracking-tight bg-gradient-to-r from-fuchsia-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                  {formatPrice(effectivePrice)}
                </span>
                {originalPrice && (
                  <span className="pb-1 text-lg text-muted-foreground line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
                {hasDiscount && (
                  <Badge className="border-0 bg-gradient-to-r from-emerald-500 to-green-500 text-white">
                    Save {formatPrice(product.price - product.discountPrice!)}
                  </Badge>
                )}
              </div>

              {product.shortDescription && (
                <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  {product.shortDescription}
                </p>
              )}
            </div>

            <Separator className="my-6" />

            {/* Variants */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">
                  Variants
                </h3>
                {selectedVariant && (
                  <span className="text-xs text-muted-foreground">
                    Selected: {getVariantLabel(selectedVariant)}
                  </span>
                )}
              </div>

              {product.variants && product.variants.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {product.variants.map((variant) => {
                    const active = variant.id === selectedVariantId;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={cn(
                          "rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5",
                          active
                            ? "border-purple-500 bg-purple-50 shadow-[0_10px_30px_rgba(124,58,237,0.15)] dark:bg-purple-950/30"
                            : "border-slate-200 bg-white hover:border-purple-300 hover:shadow-lg dark:border-white/10 dark:bg-slate-950/40"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {getVariantLabel(variant)}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {variant.stock} in stock
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-purple-700 dark:text-purple-300">
                              {formatPrice(variant.price || product.price)}
                            </p>
                            {variant.price && variant.price !== product.price && (
                              <p className="text-xs text-muted-foreground line-through">
                                {formatPrice(product.price)}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-purple-200 bg-gradient-to-br from-purple-50 to-white p-4 dark:border-purple-900/40 dark:from-purple-950/20 dark:to-slate-950/40">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">One premium configuration</p>
                      <p className="text-sm text-muted-foreground">
                        This item is sold as a single premium style with no selectable variants.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* Quantity + Actions */}
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">
                    Quantity
                  </h3>
                  <p className="text-xs text-muted-foreground">Choose how many items you want</p>
                </div>
                <div className="flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-slate-950/40">
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-12 px-3 text-center text-sm font-bold text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => value + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto]">
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAddingToCart}
                  size="lg"
                  className="h-14 w-full border-0 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 text-base font-bold text-white shadow-[0_18px_45px_rgba(236,72,153,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_24px_55px_rgba(236,72,153,0.35)]"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {isAddingToCart ? "Adding..." : isOutOfStock ? "Out of Stock" : `Add ${quantity} to Cart`}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleToggleWishlist}
                  disabled={isWishlistLoading}
                  className={cn(
                    "h-14 rounded-2xl border-2 px-5 font-semibold transition-all duration-300",
                    isInWishlist
                      ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300"
                      : "border-purple-200 bg-white text-slate-900 hover:border-purple-300 hover:bg-purple-50 dark:border-white/10 dark:bg-slate-950/40 dark:text-white"
                  )}
                >
                  <Heart className={cn("mr-2 h-5 w-5 transition-transform", isInWishlist && "fill-current")} />
                  {isWishlistLoading ? "Saving..." : isInWishlist ? "Saved" : "Wishlist"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-14 rounded-2xl border-2 border-slate-200 bg-white px-5 font-semibold text-slate-700 transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                  <Truck className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Fast delivery</p>
                    <p className="text-xs text-muted-foreground">Reliable shipping</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                  <ShieldCheck className="h-5 w-5 text-pink-600" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Secure payment</p>
                    <p className="text-xs text-muted-foreground">Protected checkout</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                  <RefreshCw className="h-5 w-5 text-cyan-600" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Easy returns</p>
                    <p className="text-xs text-muted-foreground">30-day policy</p>
                  </div>
                </div>
              </div>

              {product.tags && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.split(",").map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="rounded-full border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 hover:bg-purple-100 dark:border-purple-900/40 dark:bg-purple-950/30 dark:text-purple-300"
                    >
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                SKU: <span className="font-mono">{product.sku}</span>
              </p>

              <p className="text-xs text-muted-foreground">
                Updated {formatDate(product.updatedAt)}
              </p>
            </div>
          </div>

          {/* Mobile sticky bar */}
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/20 bg-white/90 px-4 py-3 shadow-[0_-12px_40px_rgba(15,23,42,0.18)] backdrop-blur-xl md:hidden dark:bg-slate-950/90">
            <div className="mx-auto flex max-w-2xl items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Total for {quantity}</p>
                <p className="truncate text-lg font-black bg-gradient-to-r from-fuchsia-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                  {formatPrice(effectivePrice * quantity)}
                </p>
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAddingToCart}
                className="h-12 rounded-full border-0 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 px-5 font-bold text-white shadow-lg"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="mt-14 rounded-[2rem] border border-purple-100/70 bg-white/90 p-6 shadow-[0_24px_80px_rgba(76,29,149,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80 sm:p-8">
        <h2 className="text-2xl font-black sm:text-3xl">
          <span className="bg-gradient-to-r from-purple-700 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
            Product Description
          </span>
        </h2>
        <p className="mt-4 whitespace-pre-line text-base leading-8 text-muted-foreground sm:text-lg">
          {product.description}
        </p>
      </section>

      {/* Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black sm:text-3xl">
                <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Customer Reviews
                </span>
              </h2>
              <p className="mt-2 text-muted-foreground">
                Real feedback from verified shoppers
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {product.reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70"
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 font-semibold text-white">
                      {review.user.name?.[0] || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {review.user.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(review.createdAt)}
                        {review.isVerified ? " · Verified Purchase" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                {review.title && (
                  <p className="mb-2 font-semibold text-slate-900 dark:text-white">
                    {review.title}
                  </p>
                )}
                {review.comment && (
                  <p className="text-sm leading-7 text-muted-foreground">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
