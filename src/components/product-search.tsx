"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "@/lib/client-utils";

export function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    router.replace(`/products?${params.toString()}`);
  }, 300);

  return (
    <div className="group relative flex-1">
      <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-400 opacity-0 blur transition-opacity duration-300 group-focus-within:opacity-60" />
      <div className="relative flex items-center overflow-hidden rounded-full border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-md transition-all duration-300 group-focus-within:border-fuchsia-300 group-focus-within:shadow-[0_0_0_1px_rgba(236,72,153,0.12),0_16px_35px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-950/60">
        <Search className="ml-4 h-4 w-4 text-slate-400 dark:text-slate-500" />
        <Input
          placeholder="Search products, brands, tags..."
          className="h-12 border-0 bg-transparent px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-white dark:placeholder:text-slate-500"
          defaultValue={searchParams.get("search")?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
