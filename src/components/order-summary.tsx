import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { getPrimaryProductImage } from "@/lib/product-images";
import type { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Truck, ShieldCheck, CreditCard, Package2 } from "lucide-react";

interface OrderSummaryProps {
  items: Array<{
    id: string;
    quantity: number;
    product: {
      title: string;
      slug: string;
      discountPrice: number | null;
      price: number;
      thumbnail: string | null;
      images: Prisma.JsonValue | null;
    };
  }>;
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
}

export function OrderSummary({ items, subtotal, shippingCost, tax, totalAmount }: OrderSummaryProps) {
  return (
    <Card className="overflow-hidden border-purple-100/70 bg-white/90 shadow-[0_20px_60px_rgba(76,29,149,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
      <CardHeader className="border-b border-slate-200/70 bg-gradient-to-r from-fuchsia-500/10 via-pink-500/5 to-cyan-500/10 dark:border-white/10">
        <CardTitle className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
          Order Summary
        </CardTitle>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          Review the items in your cart before placing the order.
        </p>
      </CardHeader>

      <CardContent className="space-y-5 p-5">
        <div className="space-y-3">
        {items.map((item) => {
          const price = item.product.discountPrice || item.product.price;
          const imageUrl = item.product.thumbnail || getPrimaryProductImage(item.product.images);

            return (
              <div
                key={item.id}
                className="group flex gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-200 dark:border-white/10 dark:bg-white/5"
              >
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                  <Image
                    src={imageUrl}
                    alt={item.product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="64px"
                  />
                  <Badge className="absolute -right-1 -top-1 border-0 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 text-white shadow-lg">
                    {item.quantity}
                  </Badge>
                </div>

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="line-clamp-2 text-sm font-semibold text-slate-900 transition-colors hover:text-purple-700 dark:text-white dark:hover:text-purple-300"
                  >
                    {item.product.title}
                  </Link>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {formatPrice(price)} × {item.quantity}
                  </p>
                </div>

                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {formatPrice(price * item.quantity)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <Separator className="bg-slate-200/70 dark:bg-white/10" />

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-300">Subtotal</span>
            <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-300">Shipping</span>
            {shippingCost === 0 ? (
              <Badge className="border-0 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
                Free
              </Badge>
            ) : (
              <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(shippingCost)}</span>
            )}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-300">Tax (est.)</span>
            <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(tax)}</span>
          </div>
        </div>

        <Separator className="bg-slate-200/70 dark:bg-white/10" />

        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-slate-900 dark:text-white">Total</span>
          <span className="text-2xl font-black bg-gradient-to-r from-fuchsia-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
            {formatPrice(totalAmount)}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: ShieldCheck, text: "Secure" },
            { icon: CreditCard, text: "Stripe" },
            { icon: Truck, text: "Fast" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex flex-col items-center rounded-2xl border border-slate-200/70 bg-white/75 px-2 py-3 text-center text-[11px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
            >
              <Icon className="mb-1 h-4 w-4 text-purple-500" />
              {text}
            </div>
          ))}
        </div>

        {shippingCost === 0 ? (
          <div className="flex items-start gap-3 rounded-2xl border border-cyan-200/70 bg-cyan-50/80 p-3 text-sm text-cyan-900 dark:border-cyan-900/40 dark:bg-cyan-950/20 dark:text-cyan-200">
            <Truck className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>Free shipping has been applied to your order.</span>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/80 p-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
            <Package2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>Shipping is calculated at checkout based on your order total.</span>
          </div>
        )}

        <div className="rounded-2xl border border-purple-100/70 bg-gradient-to-br from-purple-50 to-white p-3 text-xs text-slate-600 dark:border-white/10 dark:from-slate-950 dark:to-slate-900 dark:text-slate-300">
          Test card: <code className="rounded bg-white/80 px-1.5 py-0.5 font-semibold text-slate-800 dark:bg-white/10 dark:text-white">4242 4242 4242 4242</code>
        </div>
      </CardContent>
    </Card>
  );
}
