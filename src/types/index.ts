import { User } from "next-auth";
import type { Prisma } from "@prisma/client";

export type { Prisma };

// Full product type matching Prisma schema
export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  price: number;
  discountPrice: number | null;
  sku: string;
  barcode: string | null;
  stock: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  categoryId: string;
  tags: string | null;
  brand: string | null;
  images: any | null;
  thumbnail: string | null;
  videoUrl: string | null;
  isFeatured: boolean;
  isActive: boolean;
  isFreeShipping: boolean;
  averageRating: number;
  reviewCount: number;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
  variants?: ProductVariant[];
  reviews?: Review[];
}

// Category type matching Prisma schema
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string | null;
  color: string | null;
  material: string | null;
  style: string | null;
  price: number | null;
  stock: number;
  sku: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  product: Product;
  variant?: ProductVariant;
  createdAt: Date;
  updatedAt: Date;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  productSku: string;
  productImage: string;
  quantity: number;
  priceAtPurchase: number;
  variantInfo: string | null;
  createdAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isApproved: boolean;
  isVerified: boolean;
  user: {
    name: string | null;
    image: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ExtendedUser extends User {
  role?: string;
  id?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  tool_calls?: any[];
  tool_call_id?: string;
}
