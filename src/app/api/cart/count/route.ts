import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ count: 0 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          select: { quantity: true },
        },
      },
    });

    const count = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return Response.json({ count });
  } catch {
    return Response.json({ count: 0 }, { status: 200 });
  }
}
