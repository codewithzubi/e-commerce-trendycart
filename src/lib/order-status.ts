export type OrderStatusValue =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export const ORDER_STATUS_FLOW: OrderStatusValue[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export const ORDER_STATUS_LABELS: Record<OrderStatusValue, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_BADGE_CLASSES: Record<OrderStatusValue, string> = {
  PENDING:
    "border-amber-200/70 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200",
  PROCESSING:
    "border-blue-200/70 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-200",
  SHIPPED:
    "border-purple-200/70 bg-purple-50 text-purple-700 dark:border-purple-900/40 dark:bg-purple-950/20 dark:text-purple-200",
  OUT_FOR_DELIVERY:
    "border-cyan-200/70 bg-cyan-50 text-cyan-700 dark:border-cyan-900/40 dark:bg-cyan-950/20 dark:text-cyan-200",
  DELIVERED:
    "border-emerald-200/70 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200",
  CANCELLED:
    "border-rose-200/70 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200",
};

export function getOrderStatusLabel(status: OrderStatusValue | string) {
  return ORDER_STATUS_LABELS[status as OrderStatusValue] ?? status;
}

export function getOrderStatusBadgeClass(status: OrderStatusValue | string) {
  return ORDER_STATUS_BADGE_CLASSES[status as OrderStatusValue] ?? "border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300";
}

export function getOrderStatusStepState(
  currentStatus: OrderStatusValue | string,
  stepStatus: OrderStatusValue
) {
  if (currentStatus === "CANCELLED") return "cancelled" as const;

  const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus as OrderStatusValue);
  const stepIndex = ORDER_STATUS_FLOW.indexOf(stepStatus);

  if (currentIndex > stepIndex) return "complete" as const;
  if (currentIndex === stepIndex) return "current" as const;
  return "upcoming" as const;
}

export function getEstimatedDeliveryWindow(createdAt: Date, status: OrderStatusValue | string) {
  const base = new Date(createdAt);
  const days =
    status === "DELIVERED"
      ? 0
      : status === "OUT_FOR_DELIVERY"
        ? 1
        : status === "SHIPPED"
          ? 2
          : status === "PROCESSING"
            ? 4
            : 6;

  const start = new Date(base);
  start.setDate(start.getDate() + Math.max(days - 1, 1));
  const end = new Date(base);
  end.setDate(end.getDate() + Math.max(days, 2));

  return { start, end };
}
