"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toggleWishlist } from "@/lib/actions";
import { toast } from "sonner";
import { useState } from "react";
import { useWishlist } from "@/lib/wishlist-context";

interface WishlistToggleProps {
  productId: string;
  size?: "default" | "icon";
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong";
}

export function WishlistToggle({ productId, size = "icon" }: WishlistToggleProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { refreshWishlistCount } = useWishlist();

  const handleToggle = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const result = await toggleWishlist(productId);
      setIsInWishlist(result.added);
      await refreshWishlistCount();
      toast.success(result.added ? "Added to wishlist" : "Removed from wishlist");
    } catch (error: unknown) {
      if (getErrorMessage(error).includes("NEXT_REDIRECT")) return;
      toast.error("Failed to update wishlist", { description: getErrorMessage(error) });
    } finally {
      setIsLoading(false);
    }
  };

  if (size === "icon") {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={handleToggle}
        disabled={isLoading}
        className={isInWishlist ? "text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" : ""}
      >
        <Heart className={`h-5 w-5 ${isInWishlist ? "fill-red-500" : ""}`} />
      </Button>
    );
  }

  return (
    <Button
      variant={isInWishlist ? "default" : "outline"}
      onClick={handleToggle}
      disabled={isLoading}
      className={isInWishlist ? "bg-red-500 hover:bg-red-600 text-white" : ""}
    >
      <Heart className={`h-5 w-5 mr-2 ${isInWishlist ? "fill-white" : ""}`} />
      {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
    </Button>
  );
}
