import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [productsCount, usersCount, orders, revenueData] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count(),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: true },
    }),
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { totalAmount: true },
      _count: true,
    }),
  ]);

  const totalRevenue = revenueData._sum.totalAmount || 0;
  const totalOrders = revenueData._count;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={productsCount.toString()}
          icon={Package}
          description="Active products in catalog"
        />
        <StatCard
          title="Total Users"
          value={usersCount.toString()}
          icon={Users}
          description="Registered users"
        />
        <StatCard
          title="Total Orders"
          value={totalOrders.toString()}
          icon={ShoppingCart}
          description="Completed orders"
        />
        <StatCard
          title="Total Revenue"
          value={formatPrice(totalRevenue)}
          icon={TrendingUp}
          description="From paid orders"
        />
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl">Recent Orders</CardTitle>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""} • {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatPrice(order.totalAmount)}</p>
                      <Badge variant={order.paymentStatus === "PAID" ? "success" : "secondary"} className="mt-1">
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      <LowStockAlert />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, description }: {
  title: string;
  value: string;
  icon: any;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

async function LowStockAlert() {
  const lowStockProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      trackInventory: true,
      stock: { lte: 10 },
    },
    orderBy: { stock: "asc" },
    take: 5,
  });

  if (lowStockProducts.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-orange-600 dark:text-orange-400">⚠️ Low Stock Alert</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {lowStockProducts.map((product) => (
            <div key={product.id} className="flex items-center justify-between">
              <p className="font-medium">{product.title}</p>
              <Badge variant={product.stock === 0 ? "destructive" : "secondary"}>
                {product.stock === 0 ? "Out of Stock" : `${product.stock} left`}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
