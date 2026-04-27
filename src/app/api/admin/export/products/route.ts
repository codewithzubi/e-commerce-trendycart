import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        sku: true,
        price: true,
        stock: true,
        isActive: true,
        createdAt: true,
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Convert to CSV
    const headers = ["ID", "Title", "SKU", "Price", "Stock", "Active", "Category", "Created"];
    const rows = products.map((p) => [
      p.id,
      `"${p.title}"`,
      p.sku,
      p.price.toFixed(2),
      p.stock.toString(),
      p.isActive ? "Yes" : "No",
      p.category?.name || "",
      p.createdAt.toISOString().split("T")[0],
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="products-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    redirect("/admin/products");
  }
}
