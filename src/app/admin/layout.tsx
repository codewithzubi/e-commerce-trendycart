import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth";
import { AdminNavLink } from "@/components/admin/nav-link";

export const dynamic = "force-dynamic";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" as const },
  { href: "/admin/products", label: "Products", icon: "products" as const },
  { href: "/admin/orders", label: "Orders", icon: "orders" as const },
];

async function AdminLogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground">
        <LogOut className="h-4 w-4 mr-2" />
        <span>Logout</span>
      </Button>
    </form>
  );
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col">
        <div className="p-6 flex-1">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Store</span>
          </Link>
          
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-1">Admin Panel</h2>
            <p className="text-sm text-muted-foreground">{session.user.name || session.user.email}</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <AdminNavLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </nav>
        </div>

        {/* Logout button at bottom */}
        <div className="p-6 pt-0">
          <div className="border-t pt-4">
            <AdminLogoutButton />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-auto bg-background">
        {children}
      </main>
    </div>
  );
}
