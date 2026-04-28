import { getCart } from "@/lib/actions";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CartItemActions } from "@/components/cart-item-actions";
import { getPrimaryProductImage } from "@/lib/product-images";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  Package2,
  CreditCard,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cart = await getCart();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
        <div className="container mx-auto px-4 py-10 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-purple-100/70 bg-white/85 p-8 text-center shadow-[0_20px_60px_rgba(76,29,149,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-fuchsia-500 via-pink-500 to-cyan-500 text-white shadow-[0_20px_45px_rgba(236,72,153,0.24)]">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/30 dark:text-purple-300">
              <Sparkles className="h-3.5 w-3.5" />
              Your cart is empty
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Start building your next look
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
              Your favorite products will appear here once you add them to your cart.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="border-0 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 text-white shadow-[0_16px_35px_rgba(236,72,153,0.24)] transition-all duration-300 hover:scale-[1.02]"
              >
                <Link href="/products">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link href="/wishlist">View Wishlist</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 sm:py-10 lg:py-12">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-purple-100/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(76,29,149,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 sm:p-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/30 dark:text-purple-300">
            <ShoppingBag className="h-3.5 w-3.5" />
            Secure shopping cart
          </div>
          <h1 className="bg-gradient-to-r from-[#4c1d95] via-[#be185d] to-[#2563eb] bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl lg:text-5xl">
            Your Cart
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
            {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart, ready for checkout.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Badge className="border-0 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 text-white">
              {formatPrice(total)}
            </Badge>
            <Badge variant="secondary" className="rounded-full">
              {shipping === 0 ? "Free shipping unlocked" : `Add ${formatPrice(50 - subtotal)} more for free shipping`}
            </Badge>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section className="space-y-4">
            {cart.items.map((item) => {
              const unitPrice = item.product.discountPrice || item.product.price;
              const itemTotal = unitPrice * item.quantity;
              const imageUrl = item.product.thumbnail || getPrimaryProductImage(item.product.images);
              const hasDiscount = item.product.discountPrice && item.product.discountPrice < item.product.price;

              return (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-[2rem] border border-purple-100/70 bg-white/90 shadow-[0_16px_50px_rgba(76,29,149,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-[0_28px_70px_rgba(76,29,149,0.14)] dark:border-white/10 dark:bg-slate-950/75 dark:hover:border-purple-700/40"
                >
                  <div className="flex flex-col gap-5 p-4 sm:p-5 md:flex-row md:items-center md:gap-6">
                    <Link href={`/products/${item.product.slug}`} className="relative block flex-shrink-0">
                      <div className="relative h-28 w-28 overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-purple-50 via-white to-pink-50 shadow-sm dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 sm:h-32 sm:w-32">
                        <Image
                          src={imageUrl}
                          alt={item.product.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="128px"
                        />
                        {item.quantity > 1 && (
                          <Badge className="absolute right-2 top-2 border-0 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 text-white shadow-lg">
                            x{item.quantity}
                          </Badge>
                        )}
                      </div>
                    </Link>

                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                          <Link href={`/products/${item.product.slug}`}>
                            <h2 className="line-clamp-2 text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-purple-700 dark:text-white dark:group-hover:text-purple-300">
                              {item.product.title}
                            </h2>
                          </Link>
                          {item.product.brand && (
                            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                              {item.product.brand}
                            </p>
                          )}
                          {item.variant && (
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                              {[item.variant.color, item.variant.size, item.variant.material]
                                .filter(Boolean)
                                .join(" • ")}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-start gap-1 md:items-end">
                          {hasDiscount ? (
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-black bg-gradient-to-r from-fuchsia-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                                {formatPrice(item.product.discountPrice!)}
                              </span>
                              <span className="text-sm text-slate-500 line-through dark:text-slate-400">
                                {formatPrice(item.product.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xl font-black text-slate-900 dark:text-white">
                              {formatPrice(item.product.price)}
                            </span>
                          )}
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            per item
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 border-t border-slate-200/70 pt-3 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-3">
                          <CartItemActions itemId={item.id} initialQuantity={item.quantity} />
                        </div>

                        <div className="rounded-2xl border border-purple-100 bg-purple-50/70 px-4 py-3 text-sm text-slate-700 dark:border-purple-900/40 dark:bg-purple-950/20 dark:text-slate-200">
                          <div className="flex items-center justify-between gap-8">
                            <span className="text-slate-500 dark:text-slate-400">Item total</span>
                            <span className="font-bold text-slate-900 dark:text-white">{formatPrice(itemTotal)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[2rem] border border-purple-100/70 bg-white/90 shadow-[0_16px_50px_rgba(76,29,149,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
              <div className="border-b border-slate-200/70 bg-gradient-to-r from-fuchsia-500/10 via-pink-500/5 to-cyan-500/10 p-5 dark:border-white/10">
                <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Order Summary
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Review your totals before checkout.
                </p>
              </div>

              <div className="space-y-4 p-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">Subtotal</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">Shipping</span>
                    <div className="flex items-center gap-2">
                      {shipping === 0 ? (
                        <Badge className="border-0 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
                          Free
                        </Badge>
                      ) : (
                        <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(shipping)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">Tax (est.)</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(tax)}</span>
                  </div>
                </div>

                {shipping === 0 ? (
                  <div className="flex items-start gap-3 rounded-2xl border border-cyan-200/70 bg-cyan-50/80 p-3 text-sm text-cyan-900 dark:border-cyan-900/40 dark:bg-cyan-950/20 dark:text-cyan-200">
                    <Truck className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>You&apos;ve unlocked free shipping.</span>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/80 p-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
                    <Package2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>Add {formatPrice(50 - subtotal)} more for free shipping.</span>
                  </div>
                )}

                <Separator className="bg-slate-200/70 dark:bg-white/10" />

                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-slate-900 dark:text-white">Total</span>
                  <span className="text-2xl font-black bg-gradient-to-r from-fuchsia-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                    {formatPrice(total)}
                  </span>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="h-12 w-full border-0 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 text-white shadow-[0_16px_35px_rgba(236,72,153,0.24)] transition-all duration-300 hover:scale-[1.01]"
                >
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg" className="h-12 w-full rounded-full">
                  <Link href="/products">Continue Shopping</Link>
                </Button>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                    <ShieldCheck className="mx-auto mb-1 h-4 w-4 text-purple-500" />
                    Secure checkout
                  </div>
                  <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                    <CreditCard className="mx-auto mb-1 h-4 w-4 text-pink-500" />
                    Multiple payments
                  </div>
                  <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                    <Truck className="mx-auto mb-1 h-4 w-4 text-cyan-500" />
                    Fast delivery
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
