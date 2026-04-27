"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Category } from "@/types";
import { SlidersHorizontal } from "lucide-react";
import { ProductsFilterPanel } from "@/components/products-filter-panel";

interface MobileFilterProps {
  categories: Category[];
  priceBounds: { min: number; max: number };
}

export function MobileFilter({ categories, priceBounds }: MobileFilterProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-11 border-slate-200 bg-white/80 text-slate-700 shadow-sm backdrop-blur-md transition-all hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[92vw] border-r border-purple-100/70 bg-white p-0 dark:border-white/10 dark:bg-slate-950 sm:max-w-md"
      >
        <div className="h-full overflow-y-auto p-4 sm:p-5">
          <SheetHeader className="sr-only">
            <SheetTitle>Product filters</SheetTitle>
            <SheetDescription>Filter products by category, price range, and sorting options.</SheetDescription>
          </SheetHeader>
          <ProductsFilterPanel categories={categories} priceBounds={priceBounds} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
