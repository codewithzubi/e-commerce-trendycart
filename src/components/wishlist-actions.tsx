"use client";

import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { addToCart, removeFromWishlist } from "@/lib/actions";
import { toast } from "sonner";
import { useState } from "react";
import { useWishlist } from "@/lib/wishlist-context";

interface WishlistActionsProps {
  productId: string;
  isInWishlist?: boolean;
  isOutOfStock?: boolean;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong";
}

export function WishlistActions({ 
  productId, 
  isInWishlist = true,
  isOutOfStock = false 
}: WishlistActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { refreshWishlistCount } = useWishlist();

  const handleAddToCart = async () => {
    if (isLoading || isOutOfStock) return;
    setIsLoading(true);
    try {
      await addToCart(productId, 1);
      toast.success("Added to cart");
    } catch (error: unknown) {
      if (getErrorMessage(error).includes("NEXT_REDIRECT")) return;
      toast.error("Failed to add to cart", { description: getErrorMessage(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await removeFromWishlist(productId);
      await refreshWishlistCount();
      toast.success("Removed from wishlist");
    } catch (error: unknown) {
      toast.error("Failed to remove", { description: getErrorMessage(error) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={handleAddToCart} 
        disabled={isOutOfStock || isLoading}
        size="sm"
        className="flex-1"
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
      </Button>
      <Button 
        onClick={handleRemove}
        variant="outline"
        size="icon"
        disabled={isLoading}
        className={isInWishlist ? "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" : ""}
      >
        <Heart className="h-4 w-4 fill-red-500" />
      </Button>
    </>
  );
}
