"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { removeFromCart, updateCartItemQuantity } from "@/lib/actions";
import { toast } from "sonner";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

interface CartItemActionsProps {
  itemId: string;
  initialQuantity?: number;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong";
}

export function CartItemActions({ itemId, initialQuantity = 1 }: CartItemActionsProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isLoading, setIsLoading] = useState(false);
  const { refreshCartCount } = useCart();

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (isLoading) return;
    
    setIsLoading(true);
    const prevQuantity = quantity;
    setQuantity(newQuantity);

    try {
      if (newQuantity <= 0) {
        await removeFromCart(itemId);
        toast.success("Item removed from cart");
      } else {
        await updateCartItemQuantity(itemId, newQuantity);
      }
      await refreshCartCount();
    } catch (error: unknown) {
      setQuantity(prevQuantity);
      toast.error("Failed to update quantity", {
        description: getErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await removeFromCart(itemId);
      await refreshCartCount();
      toast.success("Item removed from cart");
    } catch (error: unknown) {
      toast.error("Failed to remove item", {
        description: getErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-9 w-9 rounded-full border border-slate-200 bg-white/80 text-slate-500 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-400 dark:hover:border-rose-900/40 dark:hover:bg-rose-950/20 dark:hover:text-rose-300"
        onClick={handleRemove}
        disabled={isLoading}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <div className="inline-flex items-center rounded-full border border-slate-200 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-950/50">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full text-slate-600 transition-colors hover:bg-purple-50 hover:text-purple-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
          onClick={() => handleUpdateQuantity(quantity - 1)}
          disabled={isLoading}
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <span className="w-11 text-center text-sm font-semibold text-slate-900 dark:text-white">{quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full text-slate-600 transition-colors hover:bg-purple-50 hover:text-purple-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
          onClick={() => handleUpdateQuantity(quantity + 1)}
          disabled={isLoading}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    </>
  );
}
