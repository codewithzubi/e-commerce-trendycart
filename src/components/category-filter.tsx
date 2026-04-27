import Link from "next/link";
import { Category } from "@/types";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import {
  Monitor,
  Shirt,
  Home,
  Dumbbell,
  Sparkles,
  BookOpen,
  Package,
  LayoutGrid,
} from "lucide-react";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
  variant?: "sidebar" | "chips";
}

const categoryIcons: Record<string, any> = {
  electronics: Monitor,
  clothing: Shirt,
  "home-living": Home,
  sports: Dumbbell,
  beauty: Sparkles,
  books: BookOpen,
};

function getCategoryIcon(slug: string) {
  return categoryIcons[slug] || Package;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  variant = "chips",
}: CategoryFilterProps) {
  if (variant === "chips") {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          asChild
          size="sm"
          variant={!selectedCategory ? "default" : "outline"}
          className="rounded-full"
        >
          <Link href="/products">
            <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
            All
          </Link>
        </Button>
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.slug);
          const isSelected = selectedCategory === category.slug;
          return (
            <Button
              key={category.id}
              asChild
              size="sm"
              variant={isSelected ? "default" : "outline"}
              className="rounded-full"
            >
              <Link href={`/products?category=${category.slug}`}>
                <Icon className="h-3.5 w-3.5 mr-1.5" />
                {category.name}
              </Link>
            </Button>
          );
        })}
      </div>
    );
  }

  // Sidebar variant
  return (
    <div className="space-y-1">
      <h3 className="font-semibold text-sm uppercase tracking-wide mb-3 px-3">
        Categories
      </h3>
      <Button
        asChild
        variant={!selectedCategory ? "secondary" : "ghost"}
        size="sm"
        className="w-full justify-start"
      >
        <Link href="/products">
          <LayoutGrid className="h-4 w-4 mr-2" />
          All Products
        </Link>
      </Button>
      {categories.map((category) => {
        const Icon = getCategoryIcon(category.slug);
        const isSelected = selectedCategory === category.slug;
        return (
          <Button
            key={category.id}
            asChild
            variant={isSelected ? "secondary" : "ghost"}
            size="sm"
            className="w-full justify-start"
          >
            <Link href={`/products?category=${category.slug}`}>
              <Icon className="h-4 w-4 mr-2" />
              {category.name}
              {category.description && (
                <span className="ml-auto text-xs text-muted-foreground hidden xl:block">
                  {category.description.split(" ").slice(0, 2).join(" ")}
                </span>
              )}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
