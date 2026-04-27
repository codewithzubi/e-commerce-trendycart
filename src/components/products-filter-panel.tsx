"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { cn, formatPrice } from "@/lib/utils";
import { Category } from "@/types";
import { Check, FilterX, SlidersHorizontal, Sparkles, Star, TrendingUp } from "lucide-react";

type SortValue = "newest" | "price-asc" | "price-desc" | "rating";

interface ProductsFilterPanelProps {
  categories: Category[];
  priceBounds: { min: number; max: number };
  desktop?: boolean;
}

function clampPrice(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function ProductsFilterPanel({
  categories,
  priceBounds,
  desktop = false,
}: ProductsFilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialCategories = useMemo(() => {
    const repeated = searchParams.getAll("category");
    if (repeated.length > 0) return repeated;
    const single = searchParams.get("category");
    return single ? [single] : [];
  }, [searchParams]);

  const initialSort = (searchParams.get("sort") as SortValue) || "newest";
  const initialMin = clampPrice(
    Number(searchParams.get("minPrice") || priceBounds.min),
    priceBounds.min,
    priceBounds.max
  );
  const initialMax = clampPrice(
    Number(searchParams.get("maxPrice") || priceBounds.max),
    priceBounds.min,
    priceBounds.max
  );

  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
  const [sort, setSort] = useState<SortValue>(initialSort);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Math.min(initialMin, initialMax),
    Math.max(initialMin, initialMax),
  ]);

  const categoryCount = selectedCategories.length || categories.length;

  function applyFilters(next: {
    categories?: string[];
    sort?: SortValue;
    priceRange?: [number, number];
  } = {}) {
    const params = new URLSearchParams(searchParams.toString());
    const nextCategories = next.categories ?? selectedCategories;
    const nextSort = next.sort ?? sort;
    const nextPriceRange = next.priceRange ?? priceRange;

    params.delete("category");
    nextCategories.forEach((category) => params.append("category", category));

    if (nextSort) params.set("sort", nextSort);
    if (nextPriceRange) {
      params.set("minPrice", String(nextPriceRange[0]));
      params.set("maxPrice", String(nextPriceRange[1]));
    }

    router.replace(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.set("sort", "newest");
    setSelectedCategories([]);
    setSort("newest");
    setPriceRange([priceBounds.min, priceBounds.max]);
    router.replace(`${pathname}?${params.toString()}`);
  }

  const body = (
    <div
      className={cn(
        "space-y-6",
        desktop
          ? "rounded-[2rem] border border-purple-100/80 bg-white/90 p-5 shadow-[0_20px_60px_rgba(76,29,149,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75"
          : ""
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/30 dark:text-purple-300">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
          </div>
          <h3 className="mt-3 text-xl font-black text-slate-900 dark:text-white">Refine products</h3>
        </div>
        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-purple-200 hover:text-purple-700 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-300"
        >
          <FilterX className="h-3.5 w-3.5" />
          Clear
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">
            Categories
          </h4>
          <Badge variant="secondary" className="rounded-full">
            {categoryCount}
          </Badge>
        </div>
        <div className="grid gap-2">
          {categories.map((category) => {
            const checked = selectedCategories.includes(category.slug);
            return (
              <label
                key={category.id}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-2xl border p-3 transition-all duration-300",
                  checked
                    ? "border-purple-300 bg-purple-50 shadow-[0_10px_24px_rgba(124,58,237,0.12)] dark:border-purple-700/60 dark:bg-purple-950/30"
                    : "border-slate-200 bg-white hover:border-purple-200 hover:bg-purple-50/40 dark:border-white/10 dark:bg-slate-950/40 dark:hover:bg-white/5"
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => {
                    const next = event.target.checked
                      ? [...selectedCategories, category.slug]
                      : selectedCategories.filter((slug) => slug !== category.slug);
                    setSelectedCategories(next);
                    applyFilters({ categories: next });
                  }}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 dark:border-white/20 dark:bg-slate-950"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-900 dark:text-white">{category.name}</span>
                    {checked && <Check className="h-4 w-4 text-purple-600 dark:text-purple-300" />}
                  </div>
                  {category.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {category.description}
                    </p>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">
            Price range
          </h4>
          <span className="text-xs text-muted-foreground">
            {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
          </span>
        </div>
        <Slider
          value={priceRange}
          min={priceBounds.min}
          max={priceBounds.max}
          step={1}
          onValueChange={(next) => {
            setPriceRange(next);
            applyFilters({ priceRange: next });
          }}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatPrice(priceBounds.min)}</span>
          <span>{formatPrice(priceBounds.max)}</span>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">
          Sort by
        </h4>
        <div className="grid gap-2">
          {[
            { value: "newest", label: "Newest first", icon: Sparkles },
            { value: "price-asc", label: "Price: Low to High", icon: TrendingUp },
            { value: "price-desc", label: "Price: High to Low", icon: TrendingUp },
            { value: "rating", label: "Highest rated", icon: Star },
          ].map(({ value, label, icon: Icon }) => {
            const active = sort === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setSort(value as SortValue);
                  applyFilters({ sort: value as SortValue });
                }}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all duration-300",
                  active
                    ? "border-pink-300 bg-gradient-to-r from-pink-50 to-cyan-50 shadow-[0_10px_24px_rgba(236,72,153,0.10)] dark:border-pink-700/50 dark:from-pink-950/20 dark:to-cyan-950/20"
                    : "border-slate-200 bg-white hover:border-purple-200 hover:bg-purple-50/40 dark:border-white/10 dark:bg-slate-950/40 dark:hover:bg-white/5"
                )}
                >
                  <Icon className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{label}</span>
                </button>
              );
          })}
        </div>
      </div>

      <Button
        onClick={() => applyFilters()}
        className="h-11 w-full border-0 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 font-semibold text-white shadow-[0_16px_35px_rgba(236,72,153,0.24)] transition-all duration-300 hover:scale-[1.01]"
      >
        Apply Filters
      </Button>
    </div>
  );

  return body;
}
