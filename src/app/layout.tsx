import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "TrendyCart - Your One-Stop Shop for Trendy Products",
  description: "Shop the latest trends at affordable prices. Free shipping on orders over $50.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
