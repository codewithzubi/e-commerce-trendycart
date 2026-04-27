import { getProductBySlug, getProducts } from "@/lib/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductDetailClient } from "@/components/product-detail-client";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.metaTitle || product.title} | TrendyCart`,
    description: product.metaDescription || product.shortDescription || product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const images = product.images ? JSON.parse(product.images as string) : [];

  const relatedProducts = await getProducts({
    categorySlug: product.category?.slug,
  });
  const related = relatedProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-gradient-to-b from-white via-purple-50/20 to-white dark:from-background dark:via-purple-950/10 dark:to-background">
      <div className="container mx-auto px-4 py-8 sm:py-10 lg:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 overflow-x-auto text-sm text-muted-foreground">
          <Link href="/" className="whitespace-nowrap transition-colors hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          <Link href="/products" className="whitespace-nowrap transition-colors hover:text-foreground">
            Products
          </Link>
          {product.category && (
            <>
              <ChevronRight className="h-3 w-3 flex-shrink-0" />
              <Link
                href={`/products?category=${product.category.slug}`}
                className="whitespace-nowrap transition-colors hover:text-foreground"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          <span className="max-w-[16rem] truncate whitespace-nowrap font-medium text-foreground">
            {product.title}
          </span>
        </nav>

        <ProductDetailClient product={product} images={images} />

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16 lg:mt-20">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black sm:text-4xl">
                  <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    You May Also Like
                  </span>
                </h2>
                <p className="mt-2 text-muted-foreground">
                  More curated picks from the same collection
                </p>
              </div>
              <Link
                href="/products"
                className="hidden rounded-full border border-purple-200/70 px-4 py-2 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-50 dark:border-purple-900/50 dark:text-purple-300 dark:hover:bg-purple-950/30 sm:inline-flex"
              >
                View all products
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
