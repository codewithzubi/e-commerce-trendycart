"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const activeTheme = resolvedTheme ?? "light";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(activeTheme === "dark" ? "light" : "dark")}
      className={cn(
        "relative rounded-full transition-all duration-300",
        activeTheme === "dark"
          ? "text-white hover:bg-white/10 hover:text-white"
          : "text-slate-700 hover:bg-slate-900/5 hover:text-slate-950"
      )}
      >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
