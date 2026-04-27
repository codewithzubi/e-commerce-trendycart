import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatusDropdown } from "@/components/admin/order-status-dropdown";
import { Eye, ShoppingCart, Filter, Download } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const orders = await prisma.order.findMany({
    where: status ? { status: status as any } : {},
    include: { items: true, user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    processing: orders.filter((o) => o.status === "PROCESSING").length,
    shipped: orders.filter((o) => o.status === "SHIPPED").length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
    cancelled: orders.filter((o) => o.status === "CANCELLED").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and fulfill customer orders</p>
        </div>
        <Link href="/api/admin/export/orders">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total" value={stats.total} active={!status} />
        <StatCard label="Pending" value={stats.pending} active={status === "PENDING"} href="/admin/orders?status=PENDING" />
        <StatCard label="Processing" value={stats.processing} active={status === "PROCESSING"} href="/admin/orders?status=PROCESSING" />
        <StatCard label="Shipped" value={stats.shipped} active={status === "SHIPPED"} href="/admin/orders?status=SHIPPED" />
        <StatCard label="Delivered" value={stats.delivered} active={status === "DELIVERED"} href="/admin/orders?status=DELIVERED" />
        <StatCard label="Cancelled" value={stats.cancelled} active={status === "CANCELLED"} href="/admin/orders?status=CANCELLED" />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {status ? "No orders with this status" : "Orders will appear here once customers complete checkout"}
              </p>
              {status && (
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/admin/orders">
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filter
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-lg font-mono">{order.orderNumber}</h3>
                      <Badge variant={order.paymentStatus === "PAID" ? "success" : "secondary"}>
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)} · {order.user?.name || "Unknown"} ({order.user?.email})
                    </p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <p className="text-2xl font-bold">{formatPrice(order.totalAmount)}</p>
                    <p className="text-sm text-muted-foreground">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Items */}
                  <div className="md:col-span-2">
                    <h4 className="font-semibold mb-3">Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm p-2 rounded hover:bg-muted/30">
                          <div className="flex items-center gap-3">
                            {item.productImage && (
                              <img
                                src={item.productImage}
                                alt={item.productTitle}
                                className="w-10 h-10 object-cover rounded border"
                              />
                            )}
                            <div>
                              <span className="font-medium">{item.productTitle}</span>
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="font-medium">{formatPrice(item.priceAtPurchase * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping & Status */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide">Shipping Address</h4>
                      <p className="text-sm text-muted-foreground">
                        {order.shippingName}<br />
                        {order.shippingAddressLine1}<br />
                        {order.shippingAddressLine2 && <>{order.shippingAddressLine2}<br /></>}
                        {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}<br />
                        {order.shippingCountry}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide">Order Status</h4>
                      <OrderStatusDropdown
                        orderId={order.id}
                        currentStatus={order.status}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, active, href }: { label: string; value: number; active?: boolean; href?: string }) {
  const content = (
    <Card className={`cursor-pointer transition-all ${active ? "ring-2 ring-primary" : "hover:shadow-md"}`}>
      <CardContent className="p-4 text-center">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
