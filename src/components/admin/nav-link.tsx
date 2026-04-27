"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, ShoppingCart, type LucideIcon } from "lucide-react";

interface AdminNavLinkProps {
  href: string;
  icon: "dashboard" | "products" | "orders";
  label: string;
}

const iconMap: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  products: Package,
  orders: ShoppingCart,
};

export function AdminNavLink({ href, icon, label }: AdminNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
  const Icon = iconMap[icon];

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
        "hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
      <span className={cn(isActive && "text-primary font-semibold")}>
        {label}
      </span>
      {isActive && (
        <div className="ml-auto h-5 w-1 rounded-full bg-primary" />
      )}
    </Link>
  );
}
