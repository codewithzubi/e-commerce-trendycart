import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Plus, Search, Edit, Package as PackageIcon, Download } from "lucide-react";
import Link from "next/link";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">{products.length} products in catalog</p>
        </div>
        <div className="flex gap-3">
          <Link href="/api/admin/export/products">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </Link>
          <Link href="/admin/products/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Search Products</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                name="search"
                defaultValue={search}
                placeholder="Search by title, brand, or description..."
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-10 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      <PackageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-lg font-medium mb-2">No products found</p>
                      <p className="text-sm mb-4">
                        {search ? "Try a different search term" : "Get started by adding your first product"}
                      </p>
                      {!search && (
                        <Link href="/admin/products/new">
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                          </Button>
                        </Link>
                      )}
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium max-w-xs truncate">{product.title}</p>
                          {product.brand && <p className="text-sm text-muted-foreground">{product.brand}</p>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{product.category?.name || "-"}</td>
                      <td className="px-6 py-4">
                        <div>
                          {product.discountPrice ? (
                            <div>
                              <p className="font-medium text-primary">{formatPrice(product.discountPrice)}</p>
                              <p className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</p>
                            </div>
                          ) : (
                            <p className="font-medium">{formatPrice(product.price)}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {product.trackInventory ? (
                          <Badge variant={product.stock === 0 ? "destructive" : product.stock <= 10 ? "secondary" : "success"}>
                            {product.stock}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Badge variant={product.isActive ? "success" : "secondary"}>
                            {product.isActive ? "Active" : "Draft"}
                          </Badge>
                          {product.isFeatured && (
                            <Badge variant="default">Featured</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/products/edit/${product.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <DeleteProductButton productId={product.id} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
