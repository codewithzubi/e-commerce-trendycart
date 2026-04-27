"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UploadDropzone } from "@/lib/uploadthing-client";
import {
  Loader2,
  X,
  Image as ImageIcon,
  Sparkles,
  Tag,
  BadgeCheck,
  Upload,
} from "lucide-react";
import { type Category, type Product } from "@/types";

type ProductFormState = {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: string;
  discountPrice: string;
  sku: string;
  categoryId: string;
  stock: string;
  brand: string;
  tags: string;
  isFeatured: boolean;
  isFreeShipping: boolean;
  isActive: boolean;
};

export type ProductFormInitialData = Omit<Partial<Product>, "images"> & {
  id: string;
  images?: string[] | null;
};

interface ProductFormProps {
  mode: "create" | "edit";
  initialData?: ProductFormInitialData;
  categories: Category[];
}

export function ProductForm({ mode, initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>(
    Array.isArray(initialData?.images) ? initialData.images : []
  );
  const [formData, setFormData] = useState<ProductFormState>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    shortDescription: initialData?.shortDescription || "",
    price: initialData?.price?.toString() || "",
    discountPrice: initialData?.discountPrice?.toString() || "",
    sku: initialData?.sku || "",
    categoryId: initialData?.categoryId || "",
    stock: initialData?.stock?.toString() || "0",
    brand: initialData?.brand || "",
    tags: initialData?.tags || "",
    isFeatured: initialData?.isFeatured || false,
    isFreeShipping: initialData?.isFreeShipping || false,
    isActive: initialData?.isActive !== undefined ? initialData?.isActive : true,
  });

  const updateField = <K extends keyof ProductFormState>(field: K, value: ProductFormState[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const productId = initialData?.id;

      if (mode === "edit" && !productId) {
        throw new Error("Missing product id");
      }

      const url = mode === "create" ? "/api/admin/products" : `/api/admin/products/${productId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, images }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save product");
      }

      toast.success(mode === "create" ? "Product created" : "Product updated");
      router.push("/admin/products");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to save product";
      toast.error("Error", { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const inputClass =
    "h-11 rounded-2xl border-slate-200/80 bg-white/90 px-4 text-sm shadow-sm transition-all duration-300 placeholder:text-slate-400 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-300/40 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card className="overflow-hidden border-border/70 bg-card/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <CardHeader className="border-b border-border/60 bg-gradient-to-r from-purple-50 via-white to-cyan-50 dark:from-purple-950/30 dark:via-slate-950/60 dark:to-cyan-950/20">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-cyan-500 text-white shadow-lg shadow-fuchsia-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Basic Information</CardTitle>
              <p className="text-sm text-muted-foreground">Set the foundation of how the product appears across your store.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title *</Label>
              <Input
                id="title"
                className={inputClass}
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g., Premium Wireless Headphones"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL-friendly)</Label>
              <Input
                id="slug"
                className={inputClass}
                value={formData.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="auto-generated-from-title"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input
              id="shortDescription"
              className={inputClass}
              value={formData.shortDescription}
              onChange={(e) => updateField("shortDescription", e.target.value)}
              placeholder="Brief summary for product cards"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Full Description *</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Detailed product description..."
              rows={6}
              className="min-h-[180px] flex w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm shadow-sm ring-offset-background placeholder:text-slate-400 transition-all duration-300 focus-visible:outline-none focus-visible:border-fuchsia-400 focus-visible:ring-2 focus-visible:ring-fuchsia-300/40 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing & Inventory */}
      <Card className="overflow-hidden border-border/70 bg-card/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <CardHeader className="border-b border-border/60 bg-gradient-to-r from-pink-50 via-white to-blue-50 dark:from-pink-950/20 dark:via-slate-950/60 dark:to-blue-950/20">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 text-white shadow-lg shadow-pink-500/20">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Pricing & Inventory</CardTitle>
              <p className="text-sm text-muted-foreground">Keep prices, stock, and SKU data clear for your team and customers.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="price">Base Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                className={inputClass}
                value={formData.price}
                onChange={(e) => updateField("price", e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountPrice">Sale Price ($)</Label>
              <Input
                id="discountPrice"
                type="number"
                step="0.01"
                min="0"
                className={inputClass}
                value={formData.discountPrice}
                onChange={(e) => updateField("discountPrice", e.target.value)}
                placeholder="Optional"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                className={inputClass}
                value={formData.sku}
                onChange={(e) => updateField("sku", e.target.value)}
                placeholder="e.g., SKU-12345"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                className={inputClass}
                value={formData.stock}
                onChange={(e) => updateField("stock", e.target.value)}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Category *</Label>
              <select
                id="categoryId"
                value={formData.categoryId}
                onChange={(e) => updateField("categoryId", e.target.value)}
                className="flex h-11 w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-2 text-sm shadow-sm ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:border-fuchsia-400 focus-visible:ring-2 focus-visible:ring-fuchsia-300/40 dark:border-white/10 dark:bg-white/5 dark:text-white"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              className={inputClass}
              value={formData.brand}
              onChange={(e) => updateField("brand", e.target.value)}
              placeholder="e.g., Sony, Apple, Nike"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              className={inputClass}
              value={formData.tags}
              onChange={(e) => updateField("tags", e.target.value)}
              placeholder="e.g., wireless, bluetooth, headphones"
            />
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card className="overflow-hidden border-border/70 bg-card/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <CardHeader className="border-b border-border/60 bg-gradient-to-r from-cyan-50 via-white to-violet-50 dark:from-cyan-950/20 dark:via-slate-950/60 dark:to-violet-950/20">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Product Images</CardTitle>
              <p className="text-sm text-muted-foreground">Use a strong first image and keep the gallery polished.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <UploadDropzone
            endpoint="productImage"
            className="ut-button:bg-gradient-to-r ut-button:from-fuchsia-500 ut-button:via-pink-500 ut-button:to-cyan-500"
            onClientUploadComplete={(res) => {
              if (res) {
                const urls = res.map((r) => r.url);
                setImages((prev) => [...prev, ...urls]);
                toast.success("Images uploaded");
              }
            }}
            onUploadError={(error: Error) => {
              toast.error("Upload failed", { description: error.message });
            }}
          />

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              {images.map((url, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-white/5"
                >
                  <Image
                    src={url}
                    alt={`Product image ${index + 1}`}
                    width={640}
                    height={400}
                    className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-slate-950/70 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:scale-105 group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {index === 0 && (
                    <Badge className="absolute bottom-3 left-3 rounded-full border-0 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 px-3 py-1 text-white shadow-lg shadow-fuchsia-500/20">
                      Primary
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="overflow-hidden border-border/70 bg-card/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <CardHeader className="border-b border-border/60 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 dark:from-emerald-950/20 dark:via-slate-950/60 dark:to-cyan-950/20">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20">
              <BadgeCheck className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Product Settings</CardTitle>
              <p className="text-sm text-muted-foreground">Control how this item appears across your storefront.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-3">
            <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 transition-all duration-300 hover:border-fuchsia-200 hover:bg-gradient-to-r hover:from-fuchsia-50 hover:to-cyan-50 dark:border-white/10 dark:bg-white/5 dark:hover:border-fuchsia-500/30 dark:hover:bg-white/10">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => updateField("isFeatured", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-400"
              />
              <div>
                <p className="font-medium">Featured Product</p>
                <p className="text-sm text-muted-foreground">Show on homepage</p>
              </div>
            </label>

            <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 transition-all duration-300 hover:border-cyan-200 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-500/30 dark:hover:bg-white/10">
              <input
                type="checkbox"
                checked={formData.isFreeShipping}
                onChange={(e) => updateField("isFreeShipping", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-400"
              />
              <div>
                <p className="font-medium">Free Shipping</p>
                <p className="text-sm text-muted-foreground">No shipping cost for this product</p>
              </div>
            </label>

            <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 transition-all duration-300 hover:border-emerald-200 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 dark:border-white/10 dark:bg-white/5 dark:hover:border-emerald-500/30 dark:hover:bg-white/10">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => updateField("isActive", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-400"
              />
              <div>
                <p className="font-medium">Active</p>
                <p className="text-sm text-muted-foreground">Product visible to customers</p>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col-reverse items-stretch justify-end gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
          disabled={isLoading}
          className="h-12 rounded-2xl border-slate-200/80 bg-white/90 px-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-fuchsia-200 hover:bg-gradient-to-r hover:from-fuchsia-50 hover:to-cyan-50 dark:border-white/10 dark:bg-white/5"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 rounded-2xl border-0 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 px-6 font-semibold text-white shadow-[0_18px_40px_rgba(236,72,153,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_55px_rgba(236,72,153,0.34)]"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
          {mode === "create" ? "Create Product" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
