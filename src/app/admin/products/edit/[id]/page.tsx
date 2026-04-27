import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

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

      <ProductForm mode="edit" initialData={product} categories={categories} />
    </div>
  );
}
