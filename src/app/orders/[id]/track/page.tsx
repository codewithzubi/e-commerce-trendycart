import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { OrderTrackingView, type OrderTrackingOrder } from "@/components/order-tracking-view";

export const dynamic = "force-dynamic";

export default async function TrackOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/orders/${id}/track`);
  }

  // Prisma client in local dev can lag behind the current schema during generation.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = prisma as any;

  const order = (await db.order.findFirst({
    where:
      session.user.role === "ADMIN"
        ? { id }
        : {
            id,
            userId: session.user.id,
          },
    include: {
      items: true,
    },
  })) as OrderTrackingOrder | null;

  if (!order) {
    redirect("/orders");
  }

  return <OrderTrackingView order={order} />;
}
