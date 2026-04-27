import { tool } from "ai";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getProducts, getCart, getMyWishlist, getOrders, addToCart, toggleWishlist } from "@/lib/actions";

export const systemPrompt = `You are TrendyCart's AI shopping assistant — friendly, helpful, and knowledgeable.

## Your Role:
You help customers find, compare, and purchase products. You have access to REAL product data via tools — ALWAYS use them, never invent products.

## What You Can Do:
✅ Show products by category, brand, or search
✅ Add items to cart or manage cart
✅ View and manage wishlist
✅ Show order history and status
✅ Answer checkout/payment questions
✅ Give recommendations

## Core Rules:
1. **ALWAYS use tools** to get product data — NEVER make up products
2. **Be friendly but professional** — warm, helpful, concise
3. **Keep responses short** — show 3-5 products max, use bullet points
4. **Include key details**: name, price ($), brief description, stock status
5. **Highlight value**: mention discounts, free shipping, features
6. **Suggest alternatives** if product is out of stock
7. **Ask questions** when request is vague ("What's your budget?")
8. **Guide to checkout** when user is ready to buy
9. **Be honest** about limitations
10. **Remember context** from conversation

## Product Display Format:
**Product Name** — $price (or $sale ~~original~~ if on sale)
Brief description (1 sentence)
⭐ Rating: X/5 | In stock: Yes/No

## Specific Workflows:

### Browse Category:
- User says "show me [category]" → use getProducts with categorySlug
- Common: electronics, clothing, home, sports, beauty, books
- Show 3-4 products, ask if they want more

### Search:
- Use searchProducts for keyword searches
- Be smart about synonyms
- If no results, suggest alternatives

### Product Recommendations:
- Ask about preferences: budget, use case, brand
- Use searchProducts to find relevant items
- Highlight top 3 picks with reasoning

### Add to Cart:
- Confirm product and quantity before adding
- Use addToCart tool with userId
- Respond: "✅ Added [product] to your cart!"

### Cart Management:
- Use getMyCart to show current items
- Show total and suggest checkout
- Free shipping over $50

### Wishlist:
- Use toggleWishlist to add/remove
- Use getMyWishlist to show saved items

### Order History:
- Use getMyOrders to show recent orders
- Include order number, status, total, date
- Explain status meaning:
  - PENDING: "Being processed"
  - PROCESSING: "Preparing for shipment"
  - SHIPPED: "On its way!"
  - DELIVERED: "Delivered!"

## Checkout Help:
- Direct to cart (/cart)
- Explain: review cart → checkout → fill shipping → pay via Stripe
- Test card: 4242 4242 4242 4242 (any future expiry, any 3-digit CVC)
- Payments handled securely by Stripe

## Response Guidelines:
- Use markdown (bold, lists)
- Use emojis sparingly (✅ ❤️ 🛒)
- Short paragraphs (2-3 sentences max)
- Always use $ for prices
- End with helpful question or suggestion

## Error Handling:
- Tool fails: "Having trouble fetching that, please try again"
- Not logged in: "You need to login to [action]. Anything else I can help with?"
- Out of stock: "That's out of stock, but I can suggest similar items!"

## Important:
- You have access to REAL product data — USE IT
- User ID is in system message
- If "not logged in", they can browse but not use cart/wishlist/orders
- Confirm actions were completed
- Be proactive: suggest related products

Your goal: make shopping effortless and enjoyable! 🛍️`;

async function getUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}

function serializeProducts(products: Awaited<ReturnType<typeof getProducts>>) {
  return products.slice(0, 5).map((product) => ({
    id: product.id,
    title: product.title,
    slug: product.slug,
    price: product.price,
    discountPrice: product.discountPrice,
    stock: product.stock,
    averageRating: product.averageRating,
    reviewCount: product.reviewCount,
    brand: product.brand,
    shortDescription: product.shortDescription,
    category: product.category?.name || null,
  }));
}

export const tools = {
  searchProducts: tool({
    description: "Search products by keyword or category",
    parameters: z.object({
      query: z.string().min(1),
    }),
    execute: async ({ query }) => {
      const products = await getProducts({ search: query });
      return { query, products: serializeProducts(products) };
    },
  }),
  getProducts: tool({
    description: "Get products by category slug",
    parameters: z.object({
      categorySlug: z.string().optional(),
      limit: z.number().int().min(1).max(10).optional(),
    }),
    execute: async ({ categorySlug }) => {
      const products = await getProducts({ categorySlug });
      return { products: serializeProducts(products) };
    },
  }),
  getMyCart: tool({
    description: "Get the current user's cart",
    parameters: z.object({}),
    execute: async () => {
      try {
        const cart = await getCart();
        return cart
          ? {
              items: cart.items.map((item) => ({
                id: item.id,
                title: item.product.title,
                quantity: item.quantity,
                price: item.product.discountPrice || item.product.price,
              })),
            }
          : { items: [] };
      } catch {
        return { items: [], message: "You need to login to view your cart." };
      }
    },
  }),
  getMyWishlist: tool({
    description: "Get the current user's wishlist",
    parameters: z.object({}),
    execute: async () => {
      try {
        const wishlist = await getMyWishlist();
        return wishlist
          ? {
              items: wishlist.items.map((item) => ({
                id: item.id,
                title: item.product.title,
                slug: item.product.slug,
                price: item.product.discountPrice || item.product.price,
              })),
            }
          : { items: [] };
      } catch {
        return { items: [], message: "You need to login to view your wishlist." };
      }
    },
  }),
  getMyOrders: tool({
    description: "Get the current user's recent orders",
    parameters: z.object({}),
    execute: async () => {
      try {
        const orders = await getOrders();
        return {
          orders: orders.slice(0, 5).map((order) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            paymentStatus: order.paymentStatus,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt,
            itemsCount: order.items.length,
          })),
        };
      } catch {
        return { orders: [], message: "You need to login to view your orders." };
      }
    },
  }),
  addToCart: tool({
    description: "Add a product to the current user's cart",
    parameters: z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1).max(10).default(1),
      variantId: z.string().optional(),
    }),
    execute: async ({ productId, quantity, variantId }) => {
      const userId = await getUserId();
      if (!userId) {
        return { success: false, message: "You need to login to add items to your cart." };
      }

      await addToCart(productId, quantity, variantId);
      return { success: true };
    },
  }),
  toggleWishlist: tool({
    description: "Add or remove a product from the current user's wishlist",
    parameters: z.object({
      productId: z.string().min(1),
    }),
    execute: async ({ productId }) => {
      const userId = await getUserId();
      if (!userId) {
        return { success: false, message: "You need to login to use your wishlist." };
      }

      const result = await toggleWishlist(productId);
      return { success: true, added: result.added };
    },
  }),
};
