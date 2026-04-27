import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "30"; // days
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get orders in date range
    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: "asc" },
    });

    // Group orders by date
    const revenueByDate: Record<string, number> = {};
    const ordersByDate: Record<string, number> = {};

    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split("T")[0];
      revenueByDate[date] = (revenueByDate[date] || 0) + order.totalAmount;
      ordersByDate[date] = (ordersByDate[date] || 0) + 1;
    });

    // Format for charts
    const revenueData = Object.entries(revenueByDate).map(([date, amount]) => ({
      date,
      amount: Math.round(amount * 100) / 100,
    }));

    const ordersData = Object.entries(ordersByDate).map(([date, count]) => ({
      date,
      count,
    }));

    // Get product performance
    const orderItems = await prisma.orderItem.groupBy({
      by: ["productId", "productTitle"],
      _sum: { quantity: true, priceAtPurchase: true },
      _count: true,
      orderBy: { _sum: { quantity: "desc" } },
      take: 10,
    });

    const topProducts = orderItems.map((item) => ({
      name: item.productTitle,
      quantity: item._sum.quantity || 0,
      revenue: item._sum.priceAtPurchase || 0,
      orders: item._count,
    }));

    // Get category performance
    const categoriesWithProducts = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
        products: {
          include: {
            orderItems: true,
          },
        },
      },
    });

    const categoryStats = categoriesWithProducts.map((cat) => ({
      name: cat.name,
      productCount: cat._count.products,
      orderCount: cat.products.reduce((sum, p) => sum + p.orderItems.length, 0),
    }));

    return NextResponse.json({
      revenueData,
      ordersData,
      topProducts,
      categoryStats,
      summary: {
        totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
        totalOrders: orders.length,
        averageOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + o.totalAmount, 0) / orders.length : 0,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
