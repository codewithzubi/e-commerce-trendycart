import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ count: 0 });
    }

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          select: { id: true },
        },
      },
    });

    return Response.json({ count: wishlist?.items.length || 0 });
  } catch {
    return Response.json({ count: 0 }, { status: 200 });
  }
}
