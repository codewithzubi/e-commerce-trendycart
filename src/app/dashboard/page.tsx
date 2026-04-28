import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatDate, formatPrice, cn } from "@/lib/utils";
import { getPrimaryProductImage } from "@/lib/product-images";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ComponentType } from "react";
import {
  ArrowRight,
  ChevronRight,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  Settings2,
  Shield,
  ShoppingCart,
  Sparkles,
  Wallet,
} from "lucide-react";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  PENDING: "border-amber-200/70 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200",
  PROCESSING: "border-blue-200/70 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-200",
  SHIPPED: "border-purple-200/70 bg-purple-50 text-purple-700 dark:border-purple-900/40 dark:bg-purple-950/20 dark:text-purple-200",
  OUT_FOR_DELIVERY: "border-cyan-200/70 bg-cyan-50 text-cyan-700 dark:border-cyan-900/40 dark:bg-cyan-950/20 dark:text-cyan-200",
  DELIVERED: "border-emerald-200/70 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200",
  CANCELLED: "border-rose-200/70 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200",
};

async function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <Button
        type="submit"
        variant="outline"
        className="h-11 w-full rounded-full border-slate-200 bg-white/80 text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-rose-900/40 dark:hover:bg-rose-950/20 dark:hover:text-rose-300"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </form>
  );
}

function SectionAnchor({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-200 hover:bg-gradient-to-r hover:from-fuchsia-50 hover:to-cyan-50 hover:text-purple-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-purple-700/40 dark:hover:from-white/10 dark:hover:to-white/5 dark:hover:text-white"
    >
      <span className="inline-flex items-center gap-3">
        <Icon className="h-4 w-4 text-purple-500 transition-transform duration-300 group-hover:scale-110" />
        {label}
      </span>
      <ChevronRight className="h-4 w-4 text-slate-400 transition-transform duration-300 group-hover:translate-x-0.5" />
    </Link>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="overflow-hidden border-purple-100/70 bg-white/90 shadow-[0_16px_50px_rgba(76,29,149,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-slate-950/75">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {title}
            </p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {value}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{description}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-cyan-500 text-white shadow-[0_16px_35px_rgba(236,72,153,0.22)]">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 4,
        include: { items: true },
      },
      wishlist: {
        include: {
          items: {
            take: 4,
            include: { product: true },
          },
        },
      },
      cart: {
        include: {
          items: {
            include: { product: true },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const totalOrders = user.orders.length;
  const wishlistCount = user.wishlist?.items.length || 0;
  const totalSpent = user.orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const accountStatus = user.role === "ADMIN" ? "Priority Access" : "Active Member";
  const cartItemCount = user.cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const recentOrders = user.orders.slice(0, 4);
  const wishlistPreview = user.wishlist?.items.slice(0, 4) || [];

  return (
    <div className="bg-gradient-to-b from-white via-purple-50/25 to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 sm:py-10 lg:py-12">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-purple-100/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(76,29,149,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 sm:p-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/30 dark:text-purple-300">
            <Sparkles className="h-3.5 w-3.5" />
            Account hub
          </div>
          <h1 className="bg-gradient-to-r from-[#4c1d95] via-[#be185d] to-[#2563eb] bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl lg:text-5xl">
            My Dashboard
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
            Welcome back, {user.name || "there"}. Manage your orders, wishlist, and account details from one place.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card className="overflow-hidden border-purple-100/70 bg-white/90 shadow-[0_16px_50px_rgba(76,29,149,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
              <CardContent className="space-y-5 p-5">
                <div className="rounded-[1.75rem] border border-white/60 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 p-5 text-white shadow-[0_18px_45px_rgba(236,72,153,0.20)]">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-lg font-black backdrop-blur-md">
                      {(user.name || "U").slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-lg font-black tracking-tight">{user.name || "Account User"}</p>
                      <p className="truncate text-sm text-white/85">{user.email}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Badge className="border-0 bg-white/15 text-white">{accountStatus}</Badge>
                    {user.role === "ADMIN" && (
                      <Badge className="border-0 bg-slate-950/20 text-white">Admin</Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <SectionAnchor href="#overview" label="Dashboard Overview" icon={LayoutDashboard} />
                  <SectionAnchor href="#orders" label="My Orders" icon={Package} />
                  <SectionAnchor href="#wishlist" label="Wishlist" icon={Heart} />
                  <SectionAnchor href="#account" label="Account Information" icon={Settings2} />
                  <SectionAnchor href="#addresses" label="Addresses" icon={MapPin} />
                </div>

                <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                      <ShoppingCart className="h-4 w-4 text-purple-500" />
                      Cart items
                    </span>
                    <span className="font-black text-slate-900 dark:text-white">{cartItemCount}</span>
                  </div>
                  <p className="mt-2 text-xs leading-5">
                    Continue shopping or head to checkout when you&apos;re ready.
                  </p>
                </div>

                <SignOutButton />
              </CardContent>
            </Card>
          </aside>

          <main className="space-y-8">
            <div className="lg:hidden">
              <div className="flex gap-2 overflow-x-auto pb-2">
                <SectionAnchor href="#overview" label="Overview" icon={LayoutDashboard} />
                <SectionAnchor href="#orders" label="Orders" icon={Package} />
                <SectionAnchor href="#wishlist" label="Wishlist" icon={Heart} />
                <SectionAnchor href="#account" label="Account" icon={Settings2} />
                <SectionAnchor href="#addresses" label="Address" icon={MapPin} />
              </div>
            </div>

            <section id="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Total Orders" value={String(totalOrders)} description="Orders placed so far" icon={Package} />
                <StatCard title="Wishlist Items" value={String(wishlistCount)} description="Saved favorites" icon={Heart} />
                <StatCard title="Total Spent" value={formatPrice(totalSpent)} description="Lifetime spend" icon={Wallet} />
                <StatCard title="Account Status" value={accountStatus} description="Profile standing" icon={Shield} />
              </div>
            </section>

            <section id="orders">
              <Card className="overflow-hidden border-purple-100/70 bg-white/90 shadow-[0_16px_50px_rgba(76,29,149,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
                <CardHeader className="border-b border-slate-200/70 bg-gradient-to-r from-fuchsia-500/10 via-pink-500/5 to-cyan-500/10 dark:border-white/10">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                        Recent Orders
                      </CardTitle>
                      <CardDescription className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        Your latest purchases at a glance.
                      </CardDescription>
                    </div>
                    <Button asChild variant="outline" className="rounded-full">
                      <Link href="/orders">
                        View All
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 p-5 sm:p-6">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="group rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-200 dark:border-white/10 dark:bg-white/5"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-mono text-sm font-black text-slate-900 dark:text-white">
                                #{order.orderNumber}
                              </p>
                              <Badge className={cn("border px-2.5 py-0.5 text-[11px] font-semibold", statusColors[order.status] || "border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300")}>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                              {formatDate(order.createdAt)} • {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                            </p>
                          </div>

                          <div className="flex flex-col items-start gap-3 md:items-end">
                            <div className="text-right">
                              <p className="text-2xl font-black bg-gradient-to-r from-fuchsia-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                                {formatPrice(order.totalAmount)}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Total amount</p>
                            </div>
                            <Button asChild size="sm" variant="outline" className="rounded-full">
                              <Link href="/orders">
                                View Details
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-white/70 p-8 text-center dark:border-white/10 dark:bg-white/5">
                      <Package className="mx-auto h-12 w-12 text-slate-400" />
                      <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No orders yet</h3>
                      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
                        When you place an order, it will appear here with shipping and payment details.
                      </p>
                      <Button asChild className="mt-6 border-0 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 text-white">
                        <Link href="/products">Start Shopping</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
              <section id="wishlist">
                <Card className="overflow-hidden border-purple-100/70 bg-white/90 shadow-[0_16px_50px_rgba(76,29,149,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
                  <CardHeader className="border-b border-slate-200/70 bg-gradient-to-r from-fuchsia-500/10 via-pink-500/5 to-cyan-500/10 dark:border-white/10">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                          Wishlist Preview
                        </CardTitle>
                        <CardDescription className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                          Your saved favorites at a glance.
                        </CardDescription>
                      </div>
                      <Button asChild variant="outline" className="rounded-full">
                        <Link href="/wishlist">
                          View All
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 p-5 sm:p-6">
                    {wishlistPreview.length > 0 ? (
                      wishlistPreview.map((item) => {
                        const product = item.product;
                        const imageUrl = product.thumbnail || getPrimaryProductImage(product.images);
                        const price = product.discountPrice || product.price;
                        return (
                          <Link
                            key={item.id}
                            href={`/products/${product.slug}`}
                            className="group flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-white/80 p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-200 dark:border-white/10 dark:bg-white/5"
                          >
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                              <Image
                                src={imageUrl}
                                alt={product.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="64px"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-1 font-semibold text-slate-900 transition-colors group-hover:text-purple-700 dark:text-white dark:group-hover:text-purple-300">
                                {product.title}
                              </p>
                              <p className="mt-1 text-sm font-semibold bg-gradient-to-r from-fuchsia-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                                {formatPrice(price)}
                              </p>
                            </div>
                          </Link>
                        );
                      })
                    ) : (
                      <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-white/70 p-8 text-center dark:border-white/10 dark:bg-white/5">
                        <Heart className="mx-auto h-12 w-12 text-slate-400" />
                        <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No wishlist items yet</h3>
                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">
                          Save products you love and they&apos;ll appear here for quick access later.
                        </p>
                        <Button asChild className="mt-6 border-0 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 text-white">
                          <Link href="/products">Browse Products</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>

              <section id="account" className="space-y-8">
                <Card className="overflow-hidden border-purple-100/70 bg-white/90 shadow-[0_16px_50px_rgba(76,29,149,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
                  <CardHeader className="border-b border-slate-200/70 bg-gradient-to-r from-fuchsia-500/10 via-pink-500/5 to-cyan-500/10 dark:border-white/10">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                          Account Information
                        </CardTitle>
                        <CardDescription className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                          Your profile and contact details.
                        </CardDescription>
                      </div>
                      <Button variant="outline" className="rounded-full">
                        Edit Profile
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 p-5 sm:p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Name</p>
                        <p className="mt-2 font-semibold text-slate-900 dark:text-white">{user.name || "Not set"}</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Email</p>
                        <p className="mt-2 font-semibold text-slate-900 dark:text-white">{user.email}</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Phone</p>
                        <p className="mt-2 font-semibold text-slate-900 dark:text-white">{user.phone || "Not set"}</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Member Since</p>
                        <p className="mt-2 font-semibold text-slate-900 dark:text-white">{formatDate(user.createdAt)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <section id="addresses">
                  <Card className="overflow-hidden border-purple-100/70 bg-white/90 shadow-[0_16px_50px_rgba(76,29,149,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
                    <CardHeader className="border-b border-slate-200/70 bg-gradient-to-r from-fuchsia-500/10 via-pink-500/5 to-cyan-500/10 dark:border-white/10">
                      <CardTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                        Addresses
                      </CardTitle>
                      <CardDescription className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        Saved shipping address for faster checkout.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 sm:p-6">
                      <div className="rounded-[1.75rem] border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                        {user.addressLine1 || user.city ? (
                          <div className="space-y-1 text-sm leading-6 text-slate-700 dark:text-slate-200">
                            <p className="font-semibold text-slate-900 dark:text-white">{user.name || "Saved Address"}</p>
                            {user.addressLine1 && <p>{user.addressLine1}</p>}
                            {user.addressLine2 && <p>{user.addressLine2}</p>}
                            <p>
                              {[user.city, user.state].filter(Boolean).join(", ")}
                              {user.postalCode ? ` ${user.postalCode}` : ""}
                            </p>
                            {user.country && <p>{user.country}</p>}
                            {user.phone && <p className="pt-2 text-slate-500 dark:text-slate-400">Phone: {user.phone}</p>}
                          </div>
                        ) : (
                          <div className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                            <p className="font-semibold text-slate-900 dark:text-white">No saved address yet</p>
                            <p className="mt-1">Add an address in checkout to speed up your next order.</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
