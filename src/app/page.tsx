import { getFeaturedProducts, getCategories } from "@/lib/actions";
import { ProductCard } from "@/components/product-card";
import { HomeNewsTicker } from "@/components/home-news-ticker";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Clock,
  Monitor,
  Shirt,
  HomeIcon,
  Dumbbell,
  BookOpen,
  Package,
  ShoppingBag,
  Star,
  Heart,
  Gift,
  Tag,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
  ]);

  return (
    <div>
      {/* Hero Section - Premium Modern Design */}
      <section
        className="relative flex min-h-[90vh] items-center justify-center overflow-hidden pt-10 sm:pt-12 lg:pt-14"
        style={{
          background:
            "linear-gradient(135deg, #4c1d95 0%, #7c3aed 20%, #be185d 40%, #2563eb 70%, #06b6d4 100%)",
        }}
      >
        {/* Animated Background Elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-purple-400/30 blur-3xl animate-float" />
          <div
            className="absolute -top-10 right-10 h-[500px] w-[500px] rounded-full bg-pink-400/20 blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-cyan-400/25 blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute -bottom-20 right-1/4 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl animate-float"
            style={{ animationDelay: "0.5s" }}
          />

          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />

          <div
            className="absolute top-[15%] left-[8%] hidden animate-float lg:block"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-md">
              <ShoppingBag className="h-10 w-10 text-white/80" />
            </div>
          </div>
          <div
            className="absolute top-[25%] right-[10%] hidden animate-float lg:block"
            style={{ animationDelay: "1.5s" }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-md">
              <Star className="h-8 w-8 text-yellow-300/90" />
            </div>
          </div>
          <div
            className="absolute bottom-[25%] left-[12%] hidden animate-float lg:block"
            style={{ animationDelay: "2.5s" }}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-lg backdrop-blur-md">
              <Heart className="h-7 w-7 text-pink-300/90" />
            </div>
          </div>
          <div
            className="absolute top-[18%] right-[25%] hidden animate-float lg:block"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-md">
              <Gift className="h-8 w-8 text-cyan-300/90" />
            </div>
          </div>
          <div
            className="absolute bottom-[20%] right-[8%] hidden animate-float lg:block"
            style={{ animationDelay: "1.8s" }}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-md">
              <Tag className="h-7 w-7 text-green-300/90" />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />

        <div className="container relative z-10 mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-5xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex cursor-default items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2.5 shadow-[0_12px_40px_rgba(76,29,149,0.18)] backdrop-blur-xl transition-all hover:scale-[1.02] hover:bg-white/18 sm:mb-10 sm:px-6 sm:py-3 animate-fade-in">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 via-pink-500 to-cyan-500 shadow-lg shadow-fuchsia-500/20">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/90 sm:text-sm">
                New Collection 2024
              </span>
              <span className="hidden h-1.5 w-1.5 rounded-full bg-cyan-200/90 sm:inline-flex" />
              <span className="text-sm font-semibold text-white sm:text-base">
                Up to 50% Off!
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="mb-8 animate-slide-up text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block bg-gradient-to-r from-white via-cyan-50 to-white bg-clip-text text-transparent">
                Discover Premium
              </span>
              <span
                className="mt-2 block bg-gradient-to-r from-yellow-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent animate-gradient"
                style={{ backgroundSize: "200% 200%" }}
              >
                Trends & Styles
              </span>
            </h1>

            {/* Subheading */}
            <p
              className="mx-auto mb-12 max-w-3xl px-4 text-base font-medium leading-relaxed text-white/95 animate-fade-in sm:text-lg md:text-xl lg:text-2xl"
              style={{ animationDelay: "0.2s" }}
            >
              Shop exclusive collections, unbeatable deals, and premium quality products - delivered fast to your doorstep.
            </p>

            {/* CTA Buttons */}
            <div
              className="mt-2 flex flex-col items-center justify-center gap-5 px-4 animate-fade-in sm:flex-row sm:gap-6"
              style={{ animationDelay: "0.4s" }}
            >
              <Link href="/products" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="group w-full border-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 px-12 py-8 text-lg font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_20px_50px_rgba(236,72,153,0.4)] sm:w-auto sm:text-xl"
                >
                  <ShoppingBag className="mr-2 h-6 w-6 transition-transform group-hover:animate-bounce" />
                  Shop Now
                  <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/products" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="group w-full border-2 border-white/50 bg-white/15 px-12 py-8 text-lg font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-white/70 hover:bg-white/25 hover:shadow-xl sm:w-auto sm:text-xl"
                >
                  <TrendingUp className="mr-2 h-6 w-6 transition-transform group-hover:rotate-12" />
                  Browse Categories
                </Button>
              </Link>
            </div>

            {/* Trust Bar */}
            <div
              className="mt-14 grid grid-cols-1 gap-4 px-2 animate-fade-in sm:mt-16 sm:grid-cols-2 sm:gap-5 sm:px-4 xl:grid-cols-4 xl:gap-6"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-md shadow-[0_12px_35px_rgba(15,23,42,0.14)] transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/15 sm:px-5 sm:py-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 shadow-lg shadow-fuchsia-500/20 transition-transform duration-300 group-hover:scale-110">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white sm:text-base">Fast Delivery</h3>
                  <p className="text-xs text-white/75 sm:text-sm">Quick shipping on every order</p>
                </div>
              </div>

              <div className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-md shadow-[0_12px_35px_rgba(15,23,42,0.14)] transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/15 sm:px-5 sm:py-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 shadow-lg shadow-pink-500/20 transition-transform duration-300 group-hover:scale-110">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white sm:text-base">Secure Payment</h3>
                  <p className="text-xs text-white/75 sm:text-sm">Protected checkout experience</p>
                </div>
              </div>

              <div className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-md shadow-[0_12px_35px_rgba(15,23,42,0.14)] transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/15 sm:px-5 sm:py-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 shadow-lg shadow-cyan-500/20 transition-transform duration-300 group-hover:scale-110">
                  <RefreshCw className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white sm:text-base">Easy Returns</h3>
                  <p className="text-xs text-white/75 sm:text-sm">Simple and hassle-free returns</p>
                </div>
              </div>

              <div className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-md shadow-[0_12px_35px_rgba(15,23,42,0.14)] transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/15 sm:px-5 sm:py-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-pink-500 to-fuchsia-500 shadow-lg shadow-fuchsia-500/20 transition-transform duration-300 group-hover:scale-110">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white sm:text-base">Premium Quality</h3>
                  <p className="text-xs text-white/75 sm:text-sm">Curated products and top value</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-auto w-full"
          >
            <path
              d="M0 0L48 8.88889C96 17.7778 192 35.5556 288 44.4444C384 53.3333 480 53.3333 576 48.8889C672 44.4444 768 35.5556 864 35.5556C960 35.5556 1056 44.4444 1152 48.8889C1248 53.3333 1344 53.3333 1392 53.3333H1440V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      <HomeNewsTicker />

      {/* Categories Section - Modern Colorful Design */}
      <section className="bg-gradient-to-b from-white via-purple-50/30 to-white py-20 dark:from-background dark:via-purple-950/10 dark:to-background">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-black sm:text-4xl">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                Shop by Category
              </span>
            </h2>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground">
              Browse our curated collections and discover something new
            </p>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-6 lg:gap-5 sm:grid-cols-3">
            {categories.map((category, index) => {
              const Icon = getCategoryIcon(category.slug);
              const gradients = [
                "from-purple-500 to-purple-600",
                "from-pink-500 to-rose-600",
                "from-blue-500 to-cyan-600",
                "from-orange-500 to-amber-600",
                "from-green-500 to-emerald-600",
                "from-indigo-500 to-violet-600",
              ];
              const gradient = gradients[index % gradients.length];

              return (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="group relative overflow-hidden rounded-2xl border-2 border-transparent bg-card p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-200/50 dark:hover:border-purple-700 dark:hover:shadow-purple-900/50"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-10`} />

                  <div className="relative mb-4 flex justify-center">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <h3 className="relative text-sm font-bold transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="relative mt-1.5 hidden line-clamp-2 text-xs text-muted-foreground sm:block">
                      {category.description}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products - Premium Design */}
      <section className="bg-gradient-to-b from-purple-50/50 via-white to-pink-50/30 py-20 dark:from-purple-950/10 dark:via-background dark:to-pink-950/10">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="flex items-center gap-3 text-3xl font-black sm:text-4xl">
                <TrendingUp className="h-8 w-8 text-pink-500" />
                <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Featured Products
                </span>
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">Handpicked just for you</p>
            </div>
            <Link href="/products">
              <Button className="bg-gradient-to-r from-pink-600 to-purple-600 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:from-pink-700 hover:to-purple-700 hover:shadow-lg hover:shadow-xl">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-7 sm:grid-cols-2">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/products">
              <Button
                size="lg"
                className="group border-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 px-12 py-7 text-lg font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_20px_50px_rgba(236,72,153,0.4)]"
              >
                <ShoppingBag className="mr-2 h-6 w-6 transition-transform group-hover:animate-bounce" />
                View All Products
                <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals - Energetic Design */}
      <section className="bg-gradient-to-b from-cyan-50/40 via-white to-blue-50/30 py-20 dark:from-cyan-950/10 dark:via-background dark:to-blue-950/10">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-black sm:text-4xl">
              <span className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                <Clock className="h-8 w-8 text-blue-500" />
                New Arrivals
              </span>
            </h2>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground">
              Latest additions to our store - fresh and trendy
            </p>
          </div>

          <div className="text-center">
            <Link href="/products?sort=newest">
              <Button
                size="lg"
                className="group border-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-12 py-7 text-lg font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_20px_50px_rgba(59,130,246,0.4)]"
              >
                Explore New Arrivals
                <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Vibrant Gradient */}
      <section
        className="relative overflow-hidden py-24"
        style={{
          background:
            "linear-gradient(135deg, #7c3aed 0%, #be185d 40%, #2563eb 70%, #06b6d4 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 20px 20px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 bg-black/10" />

        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-black text-white sm:text-4xl md:text-5xl">
            Ready to Start Shopping?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg font-medium text-white/90 sm:text-xl md:text-2xl">
            Browse our complete collection and discover amazing deals
          </p>
          <Link href="/products">
            <Button
              size="lg"
              className="group bg-white px-12 py-8 text-lg font-bold text-purple-700 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-gray-100 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
            >
              Explore All Products
              <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function getCategoryIcon(slug: string) {
  const icons: Record<string, LucideIcon> = {
    electronics: Monitor,
    clothing: Shirt,
    home: HomeIcon,
    sports: Dumbbell,
    beauty: Sparkles,
    books: BookOpen,
  };
  return icons[slug] || Package;
}
