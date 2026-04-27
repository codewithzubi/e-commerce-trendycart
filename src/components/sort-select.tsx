"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, useRouter } from "next/navigation";

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.replace(`/products?${params.toString()}`);
  };

  return (
    <Select defaultValue={searchParams.get("sort")?.toString() || "newest"} onValueChange={handleSort}>
      <SelectTrigger className="w-[180px]" suppressHydrationWarning>
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest First</SelectItem>
        <SelectItem value="price-asc">Price: Low to High</SelectItem>
        <SelectItem value="price-desc">Price: High to Low</SelectItem>
        <SelectItem value="rating">Highest Rated</SelectItem>
      </SelectContent>
    </Select>
  );
}
