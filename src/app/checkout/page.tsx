import Link from "next/link";
import { auth } from "@/lib/auth";
import { getCart } from "@/lib/actions";
import { formatPrice } from "@/lib/utils";
import { CheckoutForm } from "@/components/checkout-form";
import { OrderSummary } from "@/components/order-summary";
import { redirect } from "next/navigation";
import {
  Lock,
  ChevronRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/checkout");
  }

  const cart = await getCart();

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  const subtotal = cart.items.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const shippingCost = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const totalAmount = subtotal + shippingCost + tax;

  return (
    <div className="bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 sm:py-10 lg:py-12">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-purple-100/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(76,29,149,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 sm:p-8">
          <nav className="mb-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Link href="/cart" className="transition-colors hover:text-purple-600 dark:hover:text-purple-300">
              Cart
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-semibold text-slate-900 dark:text-white">Checkout</span>
          </nav>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/30 dark:text-purple-300">
            <Sparkles className="h-3.5 w-3.5" />
            Secure checkout
          </div>
          <h1 className="bg-gradient-to-r from-[#4c1d95] via-[#be185d] to-[#2563eb] bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl lg:text-5xl">
            Checkout
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
            Complete your shipping details and review your order before Stripe takes over for payment.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 px-3 py-1 text-xs font-semibold text-white">
              <ShoppingBag className="h-3.5 w-3.5" />
              {formatPrice(totalAmount)}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5 text-purple-500" />
              SSL protected
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              <Truck className="h-3.5 w-3.5 text-cyan-500" />
              Fast delivery
            </span>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-purple-700 dark:text-slate-300 dark:hover:text-purple-300"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back to Cart
          </Link>

          <p className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Lock className="h-4 w-4" />
            Your information is protected with encrypted checkout.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <section className="space-y-8">
            <CheckoutForm user={session.user} />
          </section>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <OrderSummary
              items={cart.items}
              subtotal={subtotal}
              shippingCost={shippingCost}
              tax={tax}
              totalAmount={totalAmount}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
