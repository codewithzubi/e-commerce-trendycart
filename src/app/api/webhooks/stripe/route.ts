import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return new NextResponse("Webhook error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const metadata = session.metadata;
    const userId = metadata?.userId;
    const cartId = metadata?.cartId;

    if (!userId || !cartId) {
      return new NextResponse("Missing session metadata", { status: 400 });
    }

    const subtotal = parseFloat(metadata.subtotal || "0");
    const shippingCost = parseFloat(metadata.shippingCost || "0");
    const tax = parseFloat(metadata.tax || "0");
    const totalAmount = parseFloat(metadata.totalAmount || "0");

    // Get cart items
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: true },
    });

    if (cart) {
      // Create order
      // Prisma client in local dev can temporarily lag behind schema generation.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = prisma as any;

      const order = await db.order.create({
        data: {
          orderNumber: `ORD-${new Date().getFullYear()}-${String((await prisma.order.count()) + 1).padStart(4, "0")}`,
          userId,
          subtotal,
          shippingCost,
          tax,
          totalAmount: totalAmount || (session.amount_total ?? 0) / 100,
          status: "PENDING",
          paymentStatus: "PAID",
          paymentMethod: "stripe",
          paymentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
          stripeSessionId: session.id,
          shippingName: metadata.shippingName || "",
          shippingEmail: metadata.shippingEmail || "",
          shippingPhone: metadata.shippingPhone || null,
          shippingAddressLine1: metadata.shippingAddressLine1 || "",
          shippingAddressLine2: metadata.shippingAddressLine2 || null,
          shippingCity: metadata.shippingCity || "",
          shippingState: metadata.shippingState || null,
          shippingPostalCode: metadata.shippingPostalCode || "",
          shippingCountry: metadata.shippingCountry || "US",
        },
      });

      // Create order items
      for (const item of cart.items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (product) {
          const productImages = Array.isArray(product.images) ? product.images : [];
          const productImage =
            product.thumbnail ||
            (typeof productImages[0] === "string" ? productImages[0] : "") ||
            "";

          await prisma.orderItem.create({
            data: {
              orderId: order.id,
              productId: item.productId,
              productTitle: product.title,
              productSku: product.sku,
              productImage,
              quantity: item.quantity,
              priceAtPurchase: item.quantity > 0 ? product.price : 0,
              variantInfo: null,
            },
          });

          // Update product stock
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: product.stock - item.quantity },
          });
        }
      }

      // Clear cart
      await prisma.cartItem.deleteMany({
        where: { cartId },
      });
    }
  }

  if (event.type === "checkout.session.expired") {
    // Handle expired session if needed
  }

  return new NextResponse(null, { status: 200 });
}
