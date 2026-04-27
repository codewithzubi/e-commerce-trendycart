import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  image: z.string().url("Invalid image URL"),
  category: z.string().min(1, "Category is required"),
  stock: z.number().int().nonnegative("Stock must be non-negative"),
  isActive: z.boolean().default(true),
});

export const cartItemSchema = z.object({
  productId: z.string().cuid("Invalid product ID"),
  quantity: z.number().int().positive("Quantity must be positive"),
});

export const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  zipCode: z.string().min(3, "Valid zip code required"),
  country: z.string().min(2, "Country is required"),
});

export const reviewSchema = z.object({
  productId: z.string().cuid("Invalid product ID"),
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
