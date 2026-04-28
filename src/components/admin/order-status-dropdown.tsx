"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

interface OrderStatusDropdownProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusDropdown({ orderId, currentStatus }: OrderStatusDropdownProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setStatus(newStatus);
      toast.success("Order status updated");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to update status", { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Select value={status} onValueChange={handleStatusChange} disabled={isLoading}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PENDING">Pending</SelectItem>
        <SelectItem value="PROCESSING">Processing</SelectItem>
        <SelectItem value="SHIPPED">Shipped</SelectItem>
        <SelectItem value="OUT_FOR_DELIVERY">Out for delivery</SelectItem>
        <SelectItem value="DELIVERED">Delivered</SelectItem>
        <SelectItem value="CANCELLED">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  );
}
