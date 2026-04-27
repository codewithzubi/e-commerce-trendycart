import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, variants: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        description: body.description,
        shortDescription: body.shortDescription || null,
        price: parseFloat(body.price),
        discountPrice: body.discountPrice ? parseFloat(body.discountPrice) : null,
        sku: body.sku,
        categoryId: body.categoryId,
        stock: parseInt(body.stock),
        thumbnail: body.images?.[0] || null,
        images: body.images?.length > 0 ? body.images : null,
        brand: body.brand || null,
        tags: body.tags || null,
        isFeatured: body.isFeatured || false,
        isFreeShipping: body.isFreeShipping || false,
        isActive: body.isActive !== undefined ? body.isActive : true,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/products");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
