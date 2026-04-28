"use server";

import { prisma } from "./prisma";
import { auth } from "./auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { reviewSchema } from "./validations";
import { stripe } from "./stripe";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { normalizeProductImages } from "./product-images";

// ==================== PRODUCT ACTIONS ====================

export async function getProducts(options?: {
  categorySlug?: string;
  categorySlugs?: string[];
  search?: string;
  sortBy?: "price-asc" | "price-desc" | "newest" | "rating";
  minPrice?: number;
  maxPrice?: number;
}) {
  const { categorySlug, categorySlugs, search, sortBy = "newest", minPrice, maxPrice } = options || {};

  const where = {
    isActive: true,
    ...((categorySlug || categorySlugs?.length) && {
      category: {
        ...(categorySlug
          ? { slug: categorySlug }
          : { slug: { in: categorySlugs } }),
      },
    }),
    ...(typeof minPrice === "number" || typeof maxPrice === "number"
      ? {
          price: {
            ...(typeof minPrice === "number" ? { gte: minPrice } : {}),
            ...(typeof maxPrice === "number" ? { lte: maxPrice } : {}),
          },
        }
      : {}),
    ...(search && {
      OR: [
        { title: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
        { brand: { contains: search } },
      ],
    }),
  };

  const orderBy = (() => {
    switch (sortBy) {
      case "price-asc":
        return { price: "asc" as const };
      case "price-desc":
        return { price: "desc" as const };
      case "rating":
        return { averageRating: "desc" as const };
      case "newest":
      default:
        return { createdAt: "desc" as const };
    }
  })();

  return await prisma.product.findMany({
    where,
    include: {
      category: true,
    },
    orderBy,
  });
}

export async function getProductBySlug(slug: string) {
  return await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      variants: true,
      reviews: {
        include: { user: true },
        where: { isApproved: true },
      },
    },
  });
}

export async function getFeaturedProducts(limit: number = 8) {
  return await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getCategories() {
  return await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getProduct(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: { 
      category: true,
      variants: true,
      reviews: { include: { user: true } } 
    },
  });
}

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const images = normalizeProductImages(formData.get("images"));

  const product = await prisma.product.create({
    data: {
      title: formData.get("title") as string,
      slug: (formData.get("slug") as string) || (formData.get("title") as string).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      description: formData.get("description") as string,
      shortDescription: (formData.get("shortDescription") as string) || null,
      price: parseFloat(formData.get("price") as string),
      discountPrice: formData.get("discountPrice") ? parseFloat(formData.get("discountPrice") as string) : null,
      sku: (formData.get("sku") as string) || `SKU-${Date.now()}`,
      categoryId: formData.get("categoryId") as string,
      stock: parseInt(formData.get("stock") as string),
      thumbnail: images[0] || (formData.get("thumbnail") as string) || "",
      images: images.length > 0 ? images : Prisma.DbNull,
      brand: (formData.get("brand") as string) || null,
      tags: (formData.get("tags") as string) || null,
      isFeatured: formData.get("isFeatured") === "true",
      isFreeShipping: formData.get("isFreeShipping") === "true",
      metaTitle: (formData.get("metaTitle") as string) || null,
      metaDescription: (formData.get("metaDescription") as string) || null,
    },
  });

  revalidatePath("/products");
  revalidatePath("/admin");
  return product;
}

// ==================== CART ACTIONS ====================

export async function getCart() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { 
          product: {
            include: { category: true }
          },
          variant: true,
        },
      },
    },
  });
}

export async function getCartItemCount() {
  const session = await auth();
  if (!session?.user?.id) return 0;

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        select: { quantity: true },
      },
    },
  });

  if (!cart) return 0;
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

export async function addToCart(productId: string, quantity: number = 1, variantId?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.trackInventory && product.stock < quantity) {
    throw new Error("Insufficient stock");
  }

  let cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: session.user.id },
    });
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
      variantId: variantId || null,
    },
  });

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (product.trackInventory && product.stock < newQuantity) {
      throw new Error("Insufficient stock");
    }
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        variantId: variantId || null,
      },
    });
  }

  revalidatePath("/cart");
  revalidatePath("/");
  return { success: true };
}

export async function removeFromCart(itemId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
  });

  if (!cart) throw new Error("Cart not found");

  await prisma.cartItem.delete({
    where: {
      id: itemId,
      cartId: cart.id,
    },
  });

  revalidatePath("/cart");
  revalidatePath("/");
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (quantity <= 0) {
    await removeFromCart(itemId);
    return;
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
  });

  if (!cart) throw new Error("Cart not found");

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { product: true },
  });

  if (!item) throw new Error("Item not found");

  if (item.product.trackInventory && item.product.stock < quantity) {
    throw new Error("Insufficient stock");
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  revalidatePath("/cart");
  revalidatePath("/");
}

// ==================== WISHLIST ACTIONS ====================

export async function getMyWishlist() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return await prisma.wishlist.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { 
          product: {
            include: { category: true }
          }
        },
      },
    },
  });
}

export async function getWishlistItemCount() {
  const session = await auth();
  if (!session?.user?.id) return 0;

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        select: { id: true },
      },
    },
  });

  return wishlist?.items.length || 0;
}

export async function toggleWishlist(productId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  let wishlist = await prisma.wishlist.findUnique({
    where: { userId: session.user.id },
  });

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { userId: session.user.id },
    });
  }

  const existingItem = await prisma.wishlistItem.findUnique({
    where: {
      wishlistId_productId: {
        wishlistId: wishlist.id,
        productId,
      },
    },
  });

  if (existingItem) {
    await prisma.wishlistItem.delete({
      where: { id: existingItem.id },
    });
    revalidatePath("/wishlist");
    return { added: false };
  } else {
    await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId,
      },
    });
    revalidatePath("/wishlist");
    revalidatePath("/products");
    return { added: true };
  }
}

export async function removeFromWishlist(productId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: session.user.id },
  });

  if (!wishlist) throw new Error("Wishlist not found");

  await prisma.wishlistItem.delete({
    where: {
      wishlistId_productId: {
        wishlistId: wishlist.id,
        productId,
      },
    },
  });

  revalidatePath("/wishlist");
  revalidatePath("/products");
}

// ==================== ORDER ACTIONS ====================

export async function createCheckoutSession(addressData: {
  name: string;
  email: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { product: true, variant: true } } },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // Calculate totals
  const subtotal = cart.items.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const shippingCost = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const totalAmount = subtotal + shippingCost + tax;

  function getProductImageUrl(thumbnail: string | null, images: unknown) {
    if (thumbnail) return thumbnail;
    return normalizeProductImages(images)[0] || "";
  }

  // Check if Stripe is configured
  const isStripeConfigured = process.env.STRIPE_SECRET_KEY && 
    !process.env.STRIPE_SECRET_KEY.includes('your-stripe') &&
    !process.env.STRIPE_SECRET_KEY.includes('sk_test_...');

  if (isStripeConfigured) {
    // REAL Stripe checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: cart.items.map((item) => {
        const price = item.product.discountPrice || item.product.price;
        const imageUrl = getProductImageUrl(item.product.thumbnail, item.product.images);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.product.title,
              description: item.product.shortDescription || "",
              images: imageUrl ? [imageUrl] : [],
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: item.quantity,
        };
      }),
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount" as const,
            fixed_amount: {
              amount: Math.round(shippingCost * 100),
              currency: "usd",
            },
            display_name: shippingCost === 0 ? "Free Shipping" : "Standard Shipping",
          },
        },
      ],
      customer_email: session.user.email ?? undefined,
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart?canceled=true`,
      metadata: {
        userId: session.user.id,
        cartId: cart.id,
        subtotal: subtotal.toFixed(2),
        shippingCost: shippingCost.toFixed(2),
        tax: tax.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        shippingName: addressData.name,
        shippingEmail: addressData.email,
        shippingPhone: addressData.phone || "",
        shippingAddressLine1: addressData.addressLine1,
        shippingAddressLine2: addressData.addressLine2 || "",
        shippingCity: addressData.city,
        shippingState: addressData.state || "",
        shippingPostalCode: addressData.postalCode,
        shippingCountry: addressData.country,
      },
    });

    redirect(checkoutSession.url!);
  } else {
    // MOCK checkout for testing
    console.log("🧪 TEST MODE: Using mock checkout (no Stripe configured)");
    
    // Generate order number
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(
      (await prisma.order.count()) + 1
    ).padStart(4, "0")}`;

    // Create order directly (mock payment as "paid")
    // Prisma client in the local workspace may lag behind the updated schema during generation.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = prisma as any;

    const order = await db.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        subtotal,
        shippingCost,
        tax,
        totalAmount,
        status: "PENDING",
        paymentStatus: "PAID", // Mock as paid for testing
        paymentMethod: "mock_test",
        paymentId: `mock_payment_${Date.now()}`,
        stripeSessionId: `mock_session_${Date.now()}`,
        shippingName: addressData.name,
        shippingEmail: addressData.email,
        shippingPhone: addressData.phone || null,
        shippingAddressLine1: addressData.addressLine1,
        shippingAddressLine2: addressData.addressLine2 || null,
        shippingCity: addressData.city,
        shippingState: addressData.state || null,
        shippingPostalCode: addressData.postalCode,
        shippingCountry: addressData.country,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            productTitle: item.product.title,
            productSku: item.product.sku,
            productImage: getProductImageUrl(item.product.thumbnail, item.product.images),
            quantity: item.quantity,
            priceAtPurchase: item.product.discountPrice || item.product.price,
            variantInfo: item.variant ? `Size: ${item.variant.size || "N/A"}, Color: ${item.variant.color || "N/A"}` : null,
          })),
        },
      },
    });

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Redirect to success page
    redirect(`/checkout/success?mock=true&order_id=${order.id}`);
  }
}

export async function confirmOrder(sessionId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  if (checkoutSession.payment_status !== "paid") {
    throw new Error("Payment not completed");
  }

  // Check if order already exists
  const existingOrder = await prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
  });

  if (existingOrder) return existingOrder;

  const metadata = checkoutSession.metadata;
  if (!metadata) throw new Error("Missing session metadata");

  // Create order
  const orderNumber = `ORD-${new Date().getFullYear()}-${String(
    (await prisma.order.count()) + 1
  ).padStart(4, "0")}`;

    // Prisma client in the local workspace may lag behind the updated schema during generation.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = prisma as any;

    const order = await db.order.create({
      data: {
        orderNumber,
        userId: metadata.userId,
      subtotal: parseFloat(metadata.subtotal),
      shippingCost: parseFloat(metadata.shippingCost),
      tax: parseFloat(metadata.tax),
      totalAmount: parseFloat(metadata.totalAmount),
      status: "PENDING",
      paymentStatus: "PAID",
      paymentMethod: "stripe",
      paymentId: checkoutSession.payment_intent as string,
      stripeSessionId: sessionId,
      shippingName: metadata.shippingName,
      shippingEmail: metadata.shippingEmail,
      shippingPhone: metadata.shippingPhone || null,
      shippingAddressLine1: metadata.shippingAddressLine1,
        shippingAddressLine2: metadata.shippingAddressLine2 || null,
        shippingCity: metadata.shippingCity,
        shippingState: metadata.shippingState || null,
        shippingPostalCode: metadata.shippingPostalCode,
        shippingCountry: metadata.shippingCountry,
        items: {
          create: (
            (checkoutSession.line_items?.data || []) as Array<{
              price?: { product?: string | null } | null;
            description?: string | null;
            images?: string[];
            quantity?: number | null;
            amount_total?: number | null;
          }>
        ).map((item) => ({
          productId: item.price?.product ? (typeof item.price.product === "string" ? item.price.product : "") : "",
          productTitle: item.description || "",
          productSku: "",
          productImage: item.images?.[0] || "",
          quantity: item.quantity || 0,
          priceAtPurchase: item.quantity ? (item.amount_total || 0) / 100 / item.quantity : 0,
          variantInfo: null,
        })),
      },
    },
    include: { items: true },
  });

  // Clear cart
  const cart = await prisma.cart.findUnique({
    where: { userId: metadata.userId },
  });

  if (cart) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }

  return order;
}

export async function getOrder(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Prisma client in the local workspace may lag behind the updated schema during generation.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = prisma as any;

  return await db.order.findUnique({
    where: { id },
    include: { items: true },
  });
}

export async function getOrders() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

// ==================== REVIEW ACTIONS ====================

export async function createReview(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = {
    productId: formData.get("productId"),
    rating: parseInt(formData.get("rating") as string),
    comment: formData.get("comment") as string,
  };

  const validated = reviewSchema.parse(data);

  const review = await prisma.review.create({
    data: {
      ...validated,
      userId: session.user.id,
    },
  });

  revalidatePath(`/products/${validated.productId}`);
  return review;
}

// ==================== USER ACTIONS ====================

export async function registerUser(name: string, email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return user;
}
