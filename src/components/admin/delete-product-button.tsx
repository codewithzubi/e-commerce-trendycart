"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteProductButtonProps {
  productId: string;
}

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      toast.success("Product deleted");
      window.location.reload();
    } catch (error: any) {
      toast.error("Failed to delete product", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleDelete} disabled={isLoading}>
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}
