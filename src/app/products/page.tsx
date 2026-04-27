import { getProducts, getCategories } from "@/lib/actions";
import { ProductCard } from "@/components/product-card";
import { ProductSearch } from "@/components/product-search";
import { MobileFilter } from "@/components/mobile-filter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { ProductsFilterPanel } from "@/components/products-filter-panel";
import { Search, Sparkles } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string | string[];
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}) {
  const params = await searchParams;
  const { category, search, sort, minPrice, maxPrice } = params;
  const categoryList = Array.isArray(category)
    ? category.filter(Boolean)
    : category
      ? [category]
      : [];

  const priceStats = await prisma.product.aggregate({
    where: { isActive: true },
    _min: { price: true },
    _max: { price: true },
  });

  const priceBounds = {
    min: Math.floor(priceStats._min.price || 0),
    max: Math.ceil(priceStats._max.price || 1000),
  };

  const selectedMinPrice = minPrice ? Number(minPrice) : priceBounds.min;
  const selectedMaxPrice = maxPrice ? Number(maxPrice) : priceBounds.max;

  const [products, categories] = await Promise.all([
    getProducts({
      categorySlugs: categoryList.length > 0 ? categoryList : undefined,
      search,
      sortBy:
        sort === "price-asc" || sort === "price-desc" || sort === "rating" || sort === "newest"
          ? sort
          : "newest",
      minPrice: selectedMinPrice,
      maxPrice: selectedMaxPrice,
    }),
    getCategories(),
  ]);

  const selectedCategoryName =
    categoryList.length === 1
      ? categories.find((item) => item.slug === categoryList[0])?.name
      : undefined;

  return (
    <div className="bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 sm:py-10 lg:py-12">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-purple-100/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(76,29,149,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 sm:p-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/30 dark:text-purple-300">
            <Sparkles className="h-3.5 w-3.5" />
            Curated collection
          </div>
          <h1 className="bg-gradient-to-r from-[#4c1d95] via-[#be185d] to-[#2563eb] bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl lg:text-5xl">
            Shop All Products
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
            {products.length} product{products.length !== 1 ? "s" : ""} found
            {selectedCategoryName && (
              <span>
                {" "}in{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {selectedCategoryName}
                </span>
              </span>
            )}
            {search && (
              <span>
                {" "}for &ldquo;<span className="font-semibold text-slate-900 dark:text-white">{search}</span>&rdquo;
              </span>
            )}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Badge className="border-0 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 text-white">
              {products.length} items
            </Badge>
            <Badge variant="secondary" className="rounded-full">
              {priceBounds.min > 0 ? `From ${priceBounds.min}` : "Best prices"}
            </Badge>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden w-80 flex-shrink-0 lg:block">
            <div className="sticky top-24">
              <ProductsFilterPanel categories={categories} priceBounds={priceBounds} desktop />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-6 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <ProductSearch />
                <div className="flex items-center gap-2">
                  <MobileFilter categories={categories} priceBounds={priceBounds} />
                </div>
              </div>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white/80 py-20 text-center shadow-sm dark:border-white/10 dark:bg-slate-950/50">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-cyan-500 text-2xl text-white shadow-[0_18px_40px_rgba(236,72,153,0.24)]">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No products found</h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Try adjusting your search, category, price range, or sort filters to find what you&apos;re looking for.
                </p>
                <Button
                  asChild
                  className="mt-6 border-0 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 text-white shadow-[0_16px_35px_rgba(236,72,153,0.24)]"
                >
                  <Link href="/products">Clear All Filters</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
