import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import {
  getEstimatedDeliveryWindow,
  getOrderStatusBadgeClass,
  getOrderStatusLabel,
  getOrderStatusStepState,
  ORDER_STATUS_FLOW,
  type OrderStatusValue,
} from "@/lib/order-status";
import { ArrowLeft, CheckCircle2, Clock3, MapPin, Package, Route, ShieldAlert, Truck, CircleDashed } from "lucide-react";

export type OrderTrackingOrder = {
  id: string;
  orderNumber: string;
  status: OrderStatusValue;
  trackingNumber?: string | null;
  createdAt: Date;
  updatedAt: Date;
  shippedAt?: Date | null;
  deliveredAt?: Date | null;
  shippingName: string;
  shippingAddressLine1: string;
  shippingAddressLine2?: string | null;
  shippingCity: string;
  shippingState?: string | null;
  shippingPostalCode: string;
  shippingCountry: string;
  shippingPhone?: string | null;
  totalAmount: number;
  items: Array<{
    id: string;
    productTitle: string;
    productImage: string;
    quantity: number;
    priceAtPurchase: number;
  }>;
};

type TimelineEntry = {
  status: string;
  label: string;
  timestamp: Date;
  note?: string | null;
  isCurrent: boolean;
  isComplete: boolean;
};

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function buildTimeline(order: OrderTrackingOrder): TimelineEntry[] {
  const timeline: TimelineEntry[] = [
    {
      status: "PENDING",
      label: getOrderStatusLabel("PENDING"),
      timestamp: order.createdAt,
      note: "Order placed successfully",
      isCurrent: order.status === "PENDING",
      isComplete: order.status !== "PENDING",
    },
  ];

  if (order.status === "CANCELLED") {
    timeline.push({
      status: "CANCELLED",
      label: getOrderStatusLabel("CANCELLED"),
      timestamp: order.updatedAt,
      note: "Order was cancelled",
      isCurrent: true,
      isComplete: false,
    });
  } else {
    const processingAt = addHours(order.createdAt, 2);
    const shippedAt = order.shippedAt || addDays(order.createdAt, 1);
    const outForDeliveryAt = order.shippedAt ? addHours(order.shippedAt, 20) : addDays(order.createdAt, 3);
    const deliveredAt = order.deliveredAt || addDays(order.createdAt, 5);

    timeline.push({
      status: "PROCESSING",
      label: getOrderStatusLabel("PROCESSING"),
      timestamp: processingAt,
      note: "Order is being prepared",
      isCurrent: order.status === "PROCESSING",
      isComplete: ["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"].includes(order.status),
    });

    timeline.push({
      status: "SHIPPED",
      label: getOrderStatusLabel("SHIPPED"),
      timestamp: shippedAt,
      note: "Package handed to courier",
      isCurrent: order.status === "SHIPPED",
      isComplete: ["OUT_FOR_DELIVERY", "DELIVERED"].includes(order.status),
    });

    timeline.push({
      status: "OUT_FOR_DELIVERY",
      label: getOrderStatusLabel("OUT_FOR_DELIVERY"),
      timestamp: outForDeliveryAt,
      note: "Courier is close to your address",
      isCurrent: order.status === "OUT_FOR_DELIVERY",
      isComplete: order.status === "DELIVERED",
    });

    timeline.push({
      status: "DELIVERED",
      label: getOrderStatusLabel("DELIVERED"),
      timestamp: deliveredAt,
      note: "Order delivered successfully",
      isCurrent: order.status === "DELIVERED",
      isComplete: order.status === "DELIVERED",
    });
  }

  return timeline;
}

function OrderStep({
  status,
  currentStatus,
}: {
  status: (typeof ORDER_STATUS_FLOW)[number];
  currentStatus: string;
}) {
  const stepState = getOrderStatusStepState(currentStatus, status);
  const isComplete = stepState === "complete";
  const isCurrent = stepState === "current";
  const isUpcoming = stepState === "upcoming";

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-3 text-center">
      <div
        className={cn(
          "relative flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-500",
          isComplete &&
            "border-emerald-400 bg-emerald-500 text-white shadow-[0_10px_30px_rgba(16,185,129,0.28)]",
          isCurrent &&
            "border-fuchsia-400 bg-gradient-to-br from-fuchsia-500 via-pink-500 to-cyan-500 text-white shadow-[0_14px_35px_rgba(236,72,153,0.26)]",
          isUpcoming &&
            "border-slate-200 bg-white text-slate-400 dark:border-white/10 dark:bg-slate-950 dark:text-slate-500"
        )}
      >
        {isComplete ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : isCurrent ? (
          <Route className="h-5 w-5" />
        ) : (
          <CircleDashed className="h-5 w-5" />
        )}
        {isCurrent && <span className="absolute inset-0 rounded-full ring-4 ring-fuchsia-400/20 animate-pulse" />}
      </div>
      <div className="space-y-1">
        <p
          className={cn(
            "text-[11px] font-semibold uppercase tracking-[0.18em]",
            isCurrent
              ? "text-fuchsia-600 dark:text-fuchsia-300"
              : isComplete
                ? "text-emerald-600 dark:text-emerald-300"
                : "text-slate-500 dark:text-slate-400"
          )}
        >
          {getOrderStatusLabel(status)}
        </p>
      </div>
    </div>
  );
}

export function OrderTrackingView({ order }: { order: OrderTrackingOrder }) {
  const timeline = buildTimeline(order);
  const deliveryWindow = getEstimatedDeliveryWindow(order.createdAt, order.status);
  const progressIndex =
    order.status === "CANCELLED"
      ? -1
      : Math.max(ORDER_STATUS_FLOW.indexOf(order.status as (typeof ORDER_STATUS_FLOW)[number]), 0);

  const displayStatus =
    order.status === "CANCELLED" ? "Order cancelled" : getOrderStatusLabel(order.status);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-16 h-72 w-72 rounded-full bg-fuchsia-400/15 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-violet-400/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto max-w-6xl px-4 py-8 sm:py-10 lg:py-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
          <Badge className={cn("border px-3 py-1 text-xs font-semibold", getOrderStatusBadgeClass(order.status))}>
            {displayStatus}
          </Badge>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="overflow-hidden border-purple-100/70 bg-white/90 shadow-[0_20px_60px_rgba(76,29,149,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
              <CardContent className="space-y-6 p-5 sm:p-6 lg:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                      Track Order
                    </p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                      #{order.orderNumber}
                    </h1>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      Ordered on {formatDate(order.createdAt)}. Current status:{" "}
                      <span className="font-semibold text-slate-900 dark:text-white">{displayStatus}</span>
                    </p>
                  </div>

                  <div className="grid gap-3 sm:min-w-72 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                        Estimated Delivery
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                        {formatDate(deliveryWindow.start)} - {formatDate(deliveryWindow.end)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                        Tracking Number
                      </p>
                      <p className="mt-2 truncate font-mono text-sm font-semibold text-slate-900 dark:text-white">
                        {order.trackingNumber || "Will be assigned soon"}
                      </p>
                    </div>
                  </div>
                </div>

                {order.status === "CANCELLED" ? (
                  <div className="rounded-[1.5rem] border border-rose-200/70 bg-rose-50/80 p-4 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="mt-0.5 h-5 w-5" />
                      <div>
                        <p className="font-semibold">This order was cancelled</p>
                        <p className="mt-1 text-sm leading-6">
                          If you need help with a refund or replacement, please contact support with your order number.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="rounded-[1.75rem] border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                        Delivery Progress
                      </p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        Live order status with all five fulfillment steps.
                      </p>
                    </div>
                    <Badge className={cn("border px-3 py-1 text-xs font-semibold", getOrderStatusBadgeClass(order.status))}>
                      {displayStatus}
                    </Badge>
                  </div>

                  <div className="grid gap-4 md:grid-cols-5">
                    {ORDER_STATUS_FLOW.map((status, index) => (
                      <div key={status} className="relative">
                        {index < ORDER_STATUS_FLOW.length - 1 && (
                          <div
                            className={cn(
                              "absolute left-[calc(50%+22px)] top-5 hidden h-0.5 w-[calc(100%-44px)] md:block",
                              progressIndex > index
                                ? "bg-gradient-to-r from-emerald-400 via-fuchsia-500 to-cyan-500"
                                : "bg-slate-200 dark:bg-white/10"
                            )}
                          />
                        )}
                        <OrderStep status={status} currentStatus={order.status} />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-purple-100/70 bg-white/90 shadow-[0_20px_60px_rgba(76,29,149,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
              <CardHeader className="border-b border-slate-200/70 bg-gradient-to-r from-fuchsia-500/10 via-pink-500/5 to-cyan-500/10 dark:border-white/10">
                <CardTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Timeline
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Status updates recorded for this order.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-5 sm:p-6">
                {timeline.map((entry, index) => {
                  const isLatest = entry.isCurrent;
                  const isCancelled = entry.status === "CANCELLED";
                  return (
                    <div key={`${entry.status}-${index}`} className="flex gap-4">
                      <div className="relative flex flex-col items-center">
                        <div
                          className={cn(
                            "flex h-11 w-11 items-center justify-center rounded-full border",
                            isCancelled
                              ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300"
                              : isLatest
                                ? "border-fuchsia-300 bg-gradient-to-br from-fuchsia-500 via-pink-500 to-cyan-500 text-white shadow-[0_12px_30px_rgba(236,72,153,0.22)]"
                                : entry.isComplete
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300"
                                  : "border-slate-200 bg-white text-slate-400 dark:border-white/10 dark:bg-slate-950 dark:text-slate-500"
                          )}
                        >
                          {isCancelled ? (
                            <ShieldAlert className="h-5 w-5" />
                          ) : isLatest ? (
                            <Route className="h-5 w-5" />
                          ) : (
                            <CheckCircle2 className="h-5 w-5" />
                          )}
                        </div>
                        {index < timeline.length - 1 && <div className="mt-2 h-full w-px flex-1 bg-slate-200 dark:bg-white/10" />}
                      </div>

                      <div className="min-w-0 flex-1 pb-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {entry.label}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {formatDate(entry.timestamp)}
                            </p>
                          </div>
                          {entry.isCurrent && (
                            <Badge className={cn("border px-2.5 py-0.5 text-[11px] font-semibold", getOrderStatusBadgeClass(entry.status))}>
                              Current step
                            </Badge>
                          )}
                        </div>
                        {entry.note && (
                          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {entry.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="overflow-hidden border-purple-100/70 bg-white/90 shadow-[0_20px_60px_rgba(76,29,149,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
              <CardHeader className="border-b border-slate-200/70 bg-gradient-to-r from-fuchsia-500/10 via-pink-500/5 to-cyan-500/10 dark:border-white/10">
                <CardTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Order Summary
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Items, totals, and shipping details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 p-5 sm:p-6">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-3 dark:border-white/10 dark:bg-white/5"
                    >
                      <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                        <Image
                          src={item.productImage || "/placeholder-product.jpg"}
                          alt={item.productTitle}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 font-semibold text-slate-900 dark:text-white">
                          {item.productTitle}
                        </p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          Qty {item.quantity} x {formatPrice(item.priceAtPurchase)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {formatPrice(item.priceAtPurchase * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="bg-slate-200/70 dark:bg-white/10" />

                <div className="space-y-3 rounded-2xl border border-slate-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-fuchsia-500" />
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">
                      Shipping Address
                    </h3>
                  </div>
                  <div className="space-y-1 text-sm leading-6 text-slate-700 dark:text-slate-200">
                    <p className="font-semibold text-slate-900 dark:text-white">{order.shippingName}</p>
                    <p>{order.shippingAddressLine1}</p>
                    {order.shippingAddressLine2 && <p>{order.shippingAddressLine2}</p>}
                    <p>
                      {order.shippingCity}
                      {order.shippingState ? `, ${order.shippingState}` : ""} {order.shippingPostalCode}
                    </p>
                    <p>{order.shippingCountry}</p>
                    {order.shippingPhone && <p className="pt-2 text-slate-500 dark:text-slate-400">Phone: {order.shippingPhone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: Package, label: "Packed" },
                    { icon: Truck, label: "In Transit" },
                    { icon: Clock3, label: "Updated" },
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
          </div>
        </div>
      </div>
    </div>
  );
}
