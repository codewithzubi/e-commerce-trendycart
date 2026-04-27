import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Convert to CSV
    const headers = [
      "Order Number",
      "Date",
      "Customer Name",
      "Customer Email",
      "Status",
      "Payment Status",
      "Subtotal",
      "Shipping",
      "Tax",
      "Total",
      "Items Count",
      "Shipping City",
      "Shipping Country",
    ];

    const rows = orders.map((o) => [
      o.orderNumber,
      o.createdAt.toISOString().split("T")[0],
      `"${o.user?.name || "Unknown"}"`,
      o.user?.email || "",
      o.status,
      o.paymentStatus,
      o.subtotal.toFixed(2),
      o.shippingCost.toFixed(2),
      o.tax.toFixed(2),
      o.totalAmount.toFixed(2),
      o.items.length.toString(),
      o.shippingCity,
      o.shippingCountry,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    redirect("/admin/orders");
  }
}
