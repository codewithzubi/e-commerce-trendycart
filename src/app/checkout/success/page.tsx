import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { confirmOrder } from "@/lib/actions";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  ArrowRight,
  Mail,
  Sparkles,
  Truck,
  ShieldCheck,
  CreditCard,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getEstimatedDeliveryWindow(createdAt: Date) {
  return {
    start: addDays(createdAt, 5),
    end: addDays(createdAt, 7),
  };
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; mock?: string; order_id?: string }>;
}) {
  const session = await auth();
  const { session_id, mock, order_id } = await searchParams;

  if (!session?.user?.id) {
    redirect("/login");
  }

  let order;

  if (mock === "true" && order_id) {
    order = await prisma.order.findUnique({
      where: { id: order_id },
      include: { items: true },
    });
  } else if (session_id) {
    try {
      order = await confirmOrder(session_id);
    } catch (error) {
      console.error("Order confirmation error:", error);
      redirect("/orders");
    }
  }

  if (!order) {
    redirect("/orders");
  }

  const deliveryWindow = getEstimatedDeliveryWindow(order.createdAt);
  const addressLines = [
    order.shippingName,
    order.shippingAddressLine1,
    order.shippingAddressLine2,
    `${order.shippingCity}${order.shippingState ? `, ${order.shippingState}` : ""} ${order.shippingPostalCode}`,
    order.shippingCountry,
  ].filter(Boolean);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-purple-50/25 to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-16 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl animate-float" />
        <div className="absolute right-10 top-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-violet-400/15 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(236,72,153,0.35) 0, transparent 18%), radial-gradient(circle at 80% 30%, rgba(6,182,212,0.30) 0, transparent 16%), radial-gradient(circle at 50% 80%, rgba(124,58,237,0.28) 0, transparent 20%)",
          }}
        />
      </div>

      <div className="container relative mx-auto max-w-4xl px-4 py-10 sm:py-14 lg:py-16">
        <div className="rounded-[2.5rem] border border-purple-100/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(76,29,149,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75 sm:p-8 lg:p-10">
          {mock === "true" && (
            <div className="mb-6 rounded-2xl border border-amber-200/70 bg-amber-50/80 p-4 text-amber-900 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Test Mode Order</p>
                  <p className="text-sm leading-6">
                    This order was created in test mode. No real payment was processed.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-2xl animate-pulse" />
              <div className="absolute inset-2 rounded-full border border-emerald-200/80 dark:border-emerald-900/40" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-green-500 to-cyan-500 text-white shadow-[0_20px_50px_rgba(16,185,129,0.30)] animate-bounce-in">
                <CheckCircle2 className="h-11 w-11" />
              </div>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">
              <ShoppingBag className="h-3.5 w-3.5" />
              Order confirmed
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
              Thank you for your order
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
              Your order has been placed successfully. We&apos;ll send you an email confirmation shortly.
            </p>

            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3">
              <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-left shadow-sm dark:border-white/10 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Order Number
                </p>
                <p className="mt-1 font-mono text-lg font-black text-slate-900 dark:text-white">
                  #{order.orderNumber}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-left shadow-sm dark:border-white/10 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Expected Delivery
                </p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                  {formatDate(deliveryWindow.start)} - {formatDate(deliveryWindow.end)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)]">
            <Card className="overflow-hidden border-purple-100/70 bg-white/90 shadow-[0_16px_50px_rgba(76,29,149,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
              <CardContent className="space-y-5 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      Payment Status
                    </p>
                    <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 dark:text-white">
                      Order Details
                    </h2>
                  </div>
                  <Badge className="border-0 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 text-white shadow-lg">
                    {mock === "true" ? "Test Payment" : "Stripe Paid"}
                  </Badge>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      Total Paid
                    </p>
                    <p className="mt-2 text-2xl font-black bg-gradient-to-r from-fuchsia-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                      {formatPrice(order.totalAmount)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      Payment Method
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                      <CreditCard className="h-4 w-4 text-purple-500" />
                      Stripe
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      Delivery Window
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                      <Truck className="h-4 w-4 text-cyan-500" />
                      5-7 business days
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      Order Date
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                <Separator className="bg-slate-200/70 dark:bg-white/10" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-purple-500" />
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">
                      Shipping Address
                    </h3>
                  </div>
                  <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 text-sm leading-6 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                    {addressLines.map((line, index) => (
                      <p key={`${line}-${index}`}>{line}</p>
                    ))}
                    {order.shippingPhone && <p className="mt-2">Phone: {order.shippingPhone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: ShieldCheck, label: "Secure payment" },
                    { icon: Mail, label: "Email sent" },
                    { icon: Truck, label: "On the way" },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center rounded-2xl border border-slate-200/70 bg-white/75 px-2 py-3 text-center text-[11px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                    >
                      <Icon className="mb-1 h-4 w-4 text-purple-500" />
                      {label}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-purple-100/70 bg-gradient-to-br from-white via-purple-50/30 to-white shadow-[0_16px_50px_rgba(76,29,149,0.08)] dark:border-white/10 dark:bg-slate-950/80">
              <CardContent className="space-y-5 p-5 sm:p-6">
                <div className="rounded-[1.75rem] border border-white/60 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 p-5 text-white shadow-[0_18px_45px_rgba(236,72,153,0.20)]">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight">What happens next?</h3>
                      <p className="mt-1 text-sm leading-6 text-white/90">
                        We&apos;re preparing your package and will update you as soon as it ships.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    "Order confirmation email sent",
                    "Payment successfully captured by Stripe",
                    "Your package will be packed and shipped soon",
                  ].map((step) => (
                    <div
                      key={step}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="h-12 w-full border-0 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 text-white shadow-[0_16px_35px_rgba(236,72,153,0.24)] transition-all duration-300 hover:scale-[1.01]"
                  >
                    <Link href="/orders">
                      Track Your Order
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-12 w-full rounded-full">
                    <Link href="/products">Continue Shopping</Link>
                  </Button>
                  <Button asChild variant="ghost" size="lg" className="h-12 w-full rounded-full">
                    <Link href="/orders">View Order Details</Link>
                  </Button>
                </div>

                <div className="rounded-2xl border border-purple-100/70 bg-white/80 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  <p className="font-semibold text-slate-900 dark:text-white">Need help?</p>
                  <p className="mt-1 leading-6">
                    If you don&apos;t receive a confirmation email shortly, check your spam folder or visit your order history.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
