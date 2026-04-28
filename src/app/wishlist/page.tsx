import { getMyWishlist, removeFromWishlist, addToCart } from "@/lib/actions";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import { getPrimaryProductImage } from "@/lib/product-images";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { WishlistActions } from "@/components/wishlist-actions";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const wishlist = await getMyWishlist();

  if (!wishlist || wishlist.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
          <Heart className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Save items you love to your wishlist and come back to them later.
        </p>
        <Link href="/products">
          <Button size="lg">
            Explore Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
          <Heart className="h-8 w-8 text-red-500 fill-red-500" />
          My Wishlist
        </h1>
        <p className="text-muted-foreground">
          {wishlist.items.length} item{wishlist.items.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.items.map((item) => {
          const product = item.product;
          const imageUrl = product.thumbnail || getPrimaryProductImage(product.images);
          const hasDiscount = product.discountPrice && product.discountPrice < product.price;
          const isOutOfStock = product.trackInventory && product.stock === 0;

          return (
            <Card key={item.id} className="group overflow-hidden flex flex-col">
              <Link href={`/products/${product.slug}`} className="relative block">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image
                    src={imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  {hasDiscount && (
                    <Badge variant="destructive" className="absolute top-2 left-2 text-xs font-semibold">
                      -{Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
                    </Badge>
                  )}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                      <Badge variant="secondary" className="text-sm font-semibold px-4 py-1">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>
              </Link>

              <CardContent className="p-4 flex-1">
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                </Link>

                {product.brand && (
                  <p className="text-xs text-muted-foreground mt-1">{product.brand}</p>
                )}

                <div className="mt-3 flex items-baseline gap-2">
                  {hasDiscount ? (
                    <>
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(product.discountPrice!)}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold">{formatPrice(product.price)}</span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 flex gap-2">
                <WishlistActions 
                  productId={product.id} 
                  isInWishlist={true}
                  isOutOfStock={isOutOfStock}
                />
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
