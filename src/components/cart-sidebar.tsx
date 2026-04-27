"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, cn } from "@/lib/utils";
import { updateCartItemQuantity, removeFromCart } from "@/lib/actions";

interface CartItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  userId?: string;
}

export function CartSidebar({ isOpen, onClose, items, userId }: CartSidebarProps) {
  const [updating, setUpdating] = useState<string | null>(null);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  async function handleUpdateQuantity(itemId: string, newQuantity: number) {
    setUpdating(itemId);
    await updateCartItemQuantity(itemId, newQuantity);
    setUpdating(null);
  }

  async function handleRemove(itemId: string) {
    setUpdating(itemId);
    await removeFromCart(itemId);
    setUpdating(null);
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background border-l shadow-xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <Badge variant="secondary">{totalItems}</Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">
                  Add some products to get started
                </p>
                <Button onClick={onClose} asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 rounded-lg border bg-card"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm font-semibold mt-1">
                        {formatPrice(item.product.price)}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          disabled={updating === item.id}
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          disabled={updating === item.id}
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 ml-auto text-destructive hover:text-destructive"
                          disabled={updating === item.id}
                          onClick={() => handleRemove(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-xl font-bold">{formatPrice(totalPrice)}</span>
              </div>
              <Button asChild className="w-full" size="lg">
                <Link href={userId ? "/checkout" : "/login"}>
                  {userId ? "Proceed to Checkout" : "Sign in to Checkout"}
                </Link>
              </Button>
              <Button variant="outline" className="w-full" onClick={onClose} asChild>
                <Link href="/cart">View Full Cart</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
