import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const productId = formData.get("productId") as string;
    const rating = parseInt(formData.get("rating") as string);
    const title = formData.get("title") as string;
    const comment = formData.get("comment") as string;

    if (!productId || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json({ error: "You already reviewed this product" }, { status: 400 });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId,
        rating,
        title,
        comment,
        isApproved: true, // Auto-approve for now
        isVerified: false,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    // Update product average rating
    const allReviews = await prisma.review.findMany({
      where: { productId, isApproved: true },
    });

    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        averageRating: avgRating,
        reviewCount: allReviews.length,
      },
    });

    revalidatePath(`/products/${productId}`);
    return NextResponse.json(review);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit review" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { productId, isApproved: true },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
