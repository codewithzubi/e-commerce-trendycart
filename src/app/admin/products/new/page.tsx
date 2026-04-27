import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { ArrowLeft, Layers3, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const highlights = [
  "Premium product storytelling",
  "Fast image uploads",
  "Featured and free-shipping toggles",
  "SEO-friendly product fields",
];

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-6 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative space-y-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/20 bg-gradient-to-r from-[#4c1d95] via-[#be185d] to-[#2563eb] text-white shadow-[0_24px_80px_rgba(76,29,149,0.25)]">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] backdrop-blur-md">
                <Sparkles className="h-4 w-4" />
                New Product
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/85">
                  <Link
                    href="/admin/products"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 transition-transform duration-300 hover:scale-105 hover:bg-white/15"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                  <span className="text-sm font-medium text-white/80">Back to products</span>
                </div>

                <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                  Add New Product
                </h1>
                <p className="max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
                  Create a polished product page with the same premium visual language used across your storefront.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
                  <Layers3 className="h-4 w-4 text-cyan-200" />
                  <span className="text-sm font-medium">Organized sections</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
                  <TrendingUp className="h-4 w-4 text-pink-200" />
                  <span className="text-sm font-medium">Built for conversions</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">Categories</p>
                <p className="mt-2 text-3xl font-black">{categories.length}</p>
                <p className="mt-1 text-sm text-white/75">Active categories ready to assign</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">Workflow</p>
                <p className="mt-2 text-3xl font-black">Fast</p>
                <p className="mt-1 text-sm text-white/75">Upload images and publish quickly</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 sm:col-span-2 lg:col-span-1">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">What to include</p>
                <ul className="mt-3 space-y-2 text-sm text-white/85">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0">
            <ProductForm mode="create" categories={categories} />
          </div>

          <aside className="lg:sticky lg:top-6 h-fit space-y-6">
            <div className="rounded-[1.75rem] border border-border/70 bg-card/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <h2 className="text-lg font-semibold">Quick Tips</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Use the form sections below to keep titles, pricing, images, and product settings clean and consistent.
              </p>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-purple-100/70 bg-gradient-to-br from-purple-50 to-white p-4 dark:border-white/10 dark:from-purple-950/30 dark:to-slate-950/60">
                  <p className="text-sm font-semibold">Hero-ready images</p>
                  <p className="mt-1 text-sm text-muted-foreground">Upload a strong primary image first for the best storefront preview.</p>
                </div>
                <div className="rounded-2xl border border-pink-100/70 bg-gradient-to-br from-pink-50 to-white p-4 dark:border-white/10 dark:from-pink-950/25 dark:to-slate-950/60">
                  <p className="text-sm font-semibold">Pricing clarity</p>
                  <p className="mt-1 text-sm text-muted-foreground">Set a discount price when you want the card to show a sale badge.</p>
                </div>
                <div className="rounded-2xl border border-cyan-100/70 bg-gradient-to-br from-cyan-50 to-white p-4 dark:border-white/10 dark:from-cyan-950/25 dark:to-slate-950/60">
                  <p className="text-sm font-semibold">Store visibility</p>
                  <p className="mt-1 text-sm text-muted-foreground">Featured and active toggles directly affect homepage and catalog visibility.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
