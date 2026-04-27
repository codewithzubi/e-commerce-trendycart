import { prisma } from "@/lib/prisma";
import {
  ProductForm,
  type ProductFormInitialData,
} from "@/components/admin/product-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type ProductRecord = NonNullable<
  Awaited<ReturnType<typeof prisma.product.findUnique>>
>;

function normalizeImages(images: ProductRecord["images"]): string[] | null | undefined {
  if (images == null) return images;

  if (Array.isArray(images) && images.every((image) => typeof image === "string")) {
    return images;
  }

  return undefined;
}

function toProductFormInitialData(product: ProductRecord): ProductFormInitialData {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription,
    price: product.price,
    discountPrice: product.discountPrice,
    sku: product.sku,
    barcode: product.barcode,
    stock: product.stock,
    lowStockThreshold: product.lowStockThreshold,
    trackInventory: product.trackInventory,
    categoryId: product.categoryId,
    tags: product.tags,
    brand: product.brand,
    images: normalizeImages(product.images),
    thumbnail: product.thumbnail,
    videoUrl: product.videoUrl,
    isFeatured: product.isFeatured,
    isActive: product.isActive,
    isFreeShipping: product.isFreeShipping,
    averageRating: product.averageRating,
    reviewCount: product.reviewCount,
    metaTitle: product.metaTitle,
    metaDescription: product.metaDescription,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <ArrowLeft className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground mt-1">{product.title}</p>
        </div>
      </div>

      <ProductForm
        mode="edit"
        initialData={toProductFormInitialData(product)}
        categories={categories}
      />
    </div>
  );
}
