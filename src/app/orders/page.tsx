import { auth } from "@/lib/auth";
import { getOrders } from "@/lib/actions";
import { formatPrice, formatDate } from "@/lib/utils";
import { getOrderStatusBadgeClass, getOrderStatusLabel } from "@/lib/order-status";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/empty-state";
import { Package, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const paymentStatusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
  PAID: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
  FAILED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
  REFUNDED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200",
};

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/orders");
  }

  const orders = await getOrders();

  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No Orders Yet"
        description="You haven't placed any orders yet. Start shopping to see your orders here!"
        actionLabel="Browse Products"
        actionHref="/products"
      />
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">My Orders</h1>
        <p className="text-muted-foreground">
          {orders.length} order{orders.length !== 1 ? "s" : ""} in your history
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="border-b p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">Order Number</p>
                    <p className="text-lg font-bold font-mono">{order.orderNumber}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <div className="flex gap-2">
                      <Badge className={getOrderStatusBadgeClass(order.status)}>
                        {getOrderStatusLabel(order.status)}
                      </Badge>
                      <Badge
                        className={paymentStatusColors[order.paymentStatus] || "bg-gray-100 text-gray-800"}
                      >
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    <p className="text-xl font-bold">{formatPrice(order.totalAmount)}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted text-lg">
                          📦
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.productTitle}</p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity} × {formatPrice(item.priceAtPurchase)}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium">
                        {formatPrice(item.priceAtPurchase * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    <p>📍 Shipping to: {order.shippingCity}, {order.shippingCountry}</p>
                    {order.trackingNumber && (
                      <p className="mt-1">
                        📦 Tracking: <span className="font-mono">{order.trackingNumber}</span>
                      </p>
                    )}
                  </div>

                  <Button asChild variant="outline" size="sm">
                    <Link href={`/orders/${order.id}/track`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Track Order
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

