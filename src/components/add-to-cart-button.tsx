"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2, Check } from "lucide-react";
import { addToCart } from "@/lib/actions";
import { toast } from "sonner";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  disabled?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
}

export function AddToCartButton({
  productId,
  quantity = 1,
  disabled = false,
  size = "lg",
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { refreshCartCount } = useCart();

  async function handleAddToCart() {
    if (isLoading || disabled) return;
    
    setIsLoading(true);
    try {
      await addToCart(productId, quantity);
      await refreshCartCount();
      setIsSuccess(true);
      toast.success("Added to cart");
      setTimeout(() => setIsSuccess(false), 1500);
    } catch (error: any) {
      if (error.message?.includes("NEXT_REDIRECT")) {
        return;
      }
      toast.error("Failed to add to cart", {
        description: error.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || isLoading}
      size={size}
      className="flex-1"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Adding...
        </>
      ) : isSuccess ? (
        <>
          <Check className="h-5 w-5 mr-2" />
          Added!
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
