import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(req: Request) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  try {
    const products = await prisma.product.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search } },
              { brand: { contains: search } },
              { description: { contains: search } },
            ],
          }
        : {},
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const product = await prisma.product.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        description: body.description,
        shortDescription: body.shortDescription || null,
        price: parseFloat(body.price),
        discountPrice: body.discountPrice ? parseFloat(body.discountPrice) : null,
        sku: body.sku || `SKU-${Date.now()}`,
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
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
