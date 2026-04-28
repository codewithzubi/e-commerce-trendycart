import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await req.json();

  const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    // Prisma client in local dev can lag behind the current schema during generation.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = prisma as any;

    const existingOrder = await db.order.findUnique({
      where: { id },
      select: { status: true, shippedAt: true, deliveredAt: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const now = new Date();

    const updatedOrder = await db.order.update({
      where: { id },
      data: {
        status,
        shippedAt:
          status === "SHIPPED"
            ? existingOrder.shippedAt ?? now
            : undefined,
        deliveredAt:
          status === "DELIVERED"
            ? existingOrder.deliveredAt ?? now
            : undefined,
      },
    });

    if (existingOrder.status !== status) {
      await db.orderStatusHistory.create({
        data: {
          orderId: updatedOrder.id,
          status,
          note:
            status === "PENDING"
              ? "Order placed"
              : status === "PROCESSING"
                ? "Order is being prepared"
                : status === "SHIPPED"
                  ? "Package handed to courier"
                  : status === "OUT_FOR_DELIVERY"
                    ? "Courier is on the way"
                    : status === "DELIVERED"
                      ? "Order delivered successfully"
                      : "Order cancelled",
        },
      });
    }

    revalidatePath("/admin/orders");
    revalidatePath("/orders");
    revalidatePath("/dashboard");
    revalidatePath(`/orders/${id}/track`);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
