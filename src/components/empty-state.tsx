import { Button } from "@/components/ui/button";
import { LucideIcon, ShoppingBag, Package, Search, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

const iconMap = {
  shoppingBag: ShoppingBag,
  package: Package,
  search: Search,
  alert: AlertCircle,
};

export function EmptyState({
  icon: Icon = ShoppingBag,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      )}
      {actionLabel && (actionHref || onAction) && (
        <Button
          size="lg"
          onClick={onAction}
          asChild={!!actionHref}
        >
          {actionHref ? (
            <Link href={actionHref}>{actionLabel}</Link>
          ) : (
            actionLabel
          )}
        </Button>
      )}
    </div>
  );
}
