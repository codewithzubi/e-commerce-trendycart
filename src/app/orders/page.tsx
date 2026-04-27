import { auth } from "@/lib/auth";
import { getOrders } from "@/lib/actions";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/empty-state";
import { Package, ArrowRight, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
  PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
  SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
};

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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">
          {orders.length} order{orders.length !== 1 ? "s" : ""} in your history
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardContent className="p-0">
              {/* Order Header */}
              <div className="p-6 border-b">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                    <p className="text-lg font-bold font-mono">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <div className="flex gap-2">
                      <Badge 
                        className={statusColors[order.status] || "bg-gray-100 text-gray-800"}
                      >
                        {order.status}
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

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center text-lg">
                          📦
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.productTitle}</p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity} × {formatPrice(item.priceAtPurchase)}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-sm">
                        {formatPrice(item.priceAtPurchase * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <p>📍 Shipping to: {order.shippingCity}, {order.shippingCountry}</p>
                    {order.trackingNumber && (
                      <p className="mt-1">
                        📦 Tracking: <span className="font-mono">{order.trackingNumber}</span>
                      </p>
                    )}
                  </div>
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
