import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ==================== USERS ====================
  console.log("Creating users...");

  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@trendycart.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@trendycart.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const userPassword = await bcrypt.hash("user123", 10);
  const user = await prisma.user.upsert({
    where: { email: "user@trendycart.com" },
    update: {},
    create: {
      name: "John Doe",
      email: "user@trendycart.com",
      password: userPassword,
      role: "USER",
      addressLine1: "123 Main Street",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "US",
      phone: "+1-555-0123",
    },
  });

  console.log(`✅ Admin: ${admin.email}`);
  console.log(`✅ User: ${user.email}`);

  // ==================== CATEGORIES ====================
  console.log("\nCreating categories...");

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Electronics",
        slug: "electronics",
        description: "Latest gadgets and tech accessories",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80",
        sortOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: "Clothing & Fashion",
        slug: "clothing",
        description: "Trendy apparel and accessories",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80",
        sortOrder: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: "Home & Living",
        slug: "home",
        description: "Furniture, decor, and household items",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80",
        sortOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: "Sports & Fitness",
        slug: "sports",
        description: "Equipment and gear for active lifestyle",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80",
        sortOrder: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: "Beauty & Personal Care",
        slug: "beauty",
        description: "Skincare, makeup, and wellness products",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80",
        sortOrder: 5,
      },
    }),
    prisma.category.create({
      data: {
        name: "Books & Media",
        slug: "books",
        description: "Bestsellers, classics, and digital media",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80",
        sortOrder: 6,
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // ==================== PRODUCTS ====================
  console.log("\nCreating products...");

  const electronicsCategory = categories[0];
  const clothingCategory = categories[1];
  const homeCategory = categories[2];
  const sportsCategory = categories[3];
  const beautyCategory = categories[4];
  const booksCategory = categories[5];

  // Store product images as real JSON arrays for PostgreSQL
  const imgs = (urls: string[]) => urls;

  const products = await Promise.all([
    // Electronics
    prisma.product.create({
      data: {
        title: "Wireless Bluetooth Headphones Pro",
        slug: "wireless-bluetooth-headphones-pro",
        description: "Premium noise-cancelling wireless headphones with 30-hour battery life, Hi-Res Audio certification, and adaptive sound control. Features advanced Bluetooth 5.2 for seamless connectivity and crystal-clear calls with dual microphone technology.",
        shortDescription: "Premium noise-cancelling headphones with 30hr battery",
        price: 79.99,
        discountPrice: 69.99,
        sku: "ELEC-HEAD-001",
        stock: 50,
        lowStockThreshold: 10,
        categoryId: electronicsCategory.id,
        tags: "wireless,bluetooth,headphones,audio,music",
        brand: "SoundMax",
        images: imgs([
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
        ]),
        thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
        isFeatured: true,
        isFreeShipping: true,
        averageRating: 4.5,
        reviewCount: 128,
        metaTitle: "Wireless Bluetooth Headphones Pro - SoundMax",
        metaDescription: "Premium wireless headphones with noise cancellation. 30-hour battery, Hi-Res Audio. Free shipping!",
      },
    }),
    prisma.product.create({
      data: {
        title: "Smart Watch Ultra",
        slug: "smart-watch-ultra",
        description: "Feature-packed smartwatch with AMOLED display, heart rate monitoring, GPS tracking, blood oxygen sensor, and 7-day battery life. Water resistant to 50m with 100+ workout modes and sleep tracking.",
        shortDescription: "Advanced smartwatch with health tracking & GPS",
        price: 199.99,
        discountPrice: 179.99,
        sku: "ELEC-WATCH-002",
        stock: 30,
        categoryId: electronicsCategory.id,
        tags: "smartwatch,fitness,health,gps,wearable",
        brand: "TechFit",
        images: imgs([
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
        ]),
        thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
        isFeatured: true,
        isFreeShipping: true,
        averageRating: 4.7,
        reviewCount: 256,
      },
    }),
    prisma.product.create({
      data: {
        title: "Mechanical Gaming Keyboard RGB",
        slug: "mechanical-gaming-keyboard-rgb",
        description: "Professional gaming mechanical keyboard with Cherry MX switches, per-key RGB lighting, aircraft-grade aluminum frame, and programmable macros. N-key rollover and detachable USB-C cable.",
        shortDescription: "Pro gaming keyboard with Cherry MX switches",
        price: 89.99,
        sku: "ELEC-KB-003",
        stock: 40,
        categoryId: electronicsCategory.id,
        tags: "keyboard,gaming,mechanical,rgb,cherry mx",
        brand: "KeyMaster",
        images: imgs([
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
        ]),
        thumbnail: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=80",
        isFeatured: true,
        averageRating: 4.6,
        reviewCount: 89,
      },
    }),
    prisma.product.create({
      data: {
        title: "Portable Charger 20000mAh",
        slug: "portable-charger-20000mah",
        description: "High-capacity power bank with 65W fast charging, dual USB-C ports, and LED display. Charges laptops, tablets, and phones simultaneously. Airline-safe and compact design.",
        shortDescription: "65W fast charging power bank with LED display",
        price: 39.99,
        discountPrice: 34.99,
        sku: "ELEC-PWR-004",
        stock: 80,
        categoryId: electronicsCategory.id,
        tags: "charger,power bank,portable,fast charging",
        brand: "PowerCore",
        images: imgs([
          "https://images.unsplash.com/photo-1609091839311-d5365f9c1565?w=800&q=80",
        ]),
        thumbnail: "https://images.unsplash.com/photo-1609091839311-d5365f9c1565?w=300&q=80",
        isFeatured: false,
        averageRating: 4.3,
        reviewCount: 167,
      },
    }),

    // Clothing
    prisma.product.create({
      data: {
        title: "Minimalist Urban Backpack",
        slug: "minimalist-urban-backpack",
        description: "Durable and stylish backpack with padded laptop compartment (fits 15.6\"), water-resistant 600D polyester, anti-theft pocket, and ergonomic shoulder straps. Perfect for work, travel, or daily commute.",
        shortDescription: "Water-resistant backpack with laptop compartment",
        price: 49.99,
        sku: "CLTH-BAG-005",
        stock: 100,
        categoryId: clothingCategory.id,
        tags: "backpack,bag,travel,laptop,urban",
        brand: "UrbanCarry",
        images: imgs([
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
        ]),
        thumbnail: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80",
        isFeatured: true,
        averageRating: 4.4,
        reviewCount: 73,
      },
    }),
    prisma.product.create({
      data: {
        title: "Classic Aviator Sunglasses",
        slug: "classic-aviator-sunglasses",
        description: "Timeless aviator-style sunglasses with polarized UV400 lenses, lightweight titanium frame, and scratch-resistant coating. Includes premium leather case and cleaning cloth.",
        shortDescription: "Polarized UV400 aviator sunglasses",
        price: 29.99,
        discountPrice: 24.99,
        sku: "CLTH-SUN-006",
        stock: 150,
        categoryId: clothingCategory.id,
        tags: "sunglasses,aviator,uv,polarized,fashion",
        brand: "ShadeCraft",
        images: imgs([
          "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
        ]),
        thumbnail: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&q=80",
        isFeatured: false,
        averageRating: 4.2,
        reviewCount: 94,
      },
    }),

    // Home
    prisma.product.create({
      data: {
        title: "Luxury Scented Candle Collection",
        slug: "luxury-scented-candle-collection",
        description: "Set of 3 hand-poured soy wax candles with cotton wicks. Includes Lavender Dreams, Vanilla Bourbon, and Sandalwood Woods. Each candle burns for 45+ hours. Comes in reusable ceramic jars.",
        shortDescription: "Set of 3 luxury soy candles, 45hr burn each",
        price: 24.99,
        sku: "HOME-CNDL-007",
        stock: 200,
        categoryId: homeCategory.id,
        tags: "candles,scented,home decor,aromatherapy,gift",
        brand: "AromaLux",
        images: imgs([
          "https://images.unsplash.com/photo-1602607404890-ae2f83cf8b7f?w=800&q=80",
        ]),
        thumbnail: "https://images.unsplash.com/photo-1602607404890-ae2f83cf8b7f?w=300&q=80",
        isFeatured: true,
        isFreeShipping: false,
        averageRating: 4.8,
        reviewCount: 312,
      },
    }),

    // Sports
    prisma.product.create({
      data: {
        title: "Premium Yoga Mat with Alignment Lines",
        slug: "premium-yoga-mat-alignment-lines",
        description: "Extra thick 6mm yoga mat with printed alignment guides, non-slip microfiber surface, and eco-friendly natural rubber base. Includes carrying strap and mesh bag. Perfect for yoga, pilates, and stretching.",
        shortDescription: "6mm thick yoga mat with alignment guides",
        price: 34.99,
        discountPrice: 29.99,
        sku: "SPRT-YOGA-008",
        stock: 120,
        categoryId: sportsCategory.id,
        tags: "yoga,mat,fitness,exercise,non-slip",
        brand: "ZenFit",
        images: imgs([
          "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
        ]),
        thumbnail: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300&q=80",
        isFeatured: false,
        averageRating: 4.5,
        reviewCount: 145,
      },
    }),
    prisma.product.create({
      data: {
        title: "Resistance Bands Set (5 Pack)",
        slug: "resistance-bands-set-5-pack",
        description: "Complete set of 5 fabric resistance bands (10-50 lbs) with non-slip grip. Perfect for glute workouts, physical therapy, and home fitness. Includes carrying bag and workout guide.",
        shortDescription: "5-pack resistance bands for home workouts",
        price: 19.99,
        sku: "SPRT-BAND-009",
        stock: 180,
        categoryId: sportsCategory.id,
        tags: "resistance bands,fitness,workout,glutes,home gym",
        brand: "FitPro",
        images: imgs([
          "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&q=80",
        ]),
        thumbnail: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=300&q=80",
        isFeatured: false,
        averageRating: 4.3,
        reviewCount: 201,
      },
    }),

    // Beauty
    prisma.product.create({
      data: {
        title: "Organic Skincare Essentials Kit",
        slug: "organic-skincare-essentials-kit",
        description: "Complete skincare routine with 100% natural and organic ingredients. Includes gentle foaming cleanser (150ml), hydrating toner (120ml), vitamin C serum (30ml), and daily moisturizer (50ml). Suitable for all skin types.",
        shortDescription: "Complete organic skincare routine - 4 products",
        price: 59.99,
        discountPrice: 49.99,
        sku: "BEUTY-SKN-010",
        stock: 75,
        categoryId: beautyCategory.id,
        tags: "skincare,organic,natural,beauty,kit",
        brand: "PureGlow",
        images: imgs([
          "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80",
        ]),
        thumbnail: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&q=80",
        isFeatured: true,
        isFreeShipping: true,
        averageRating: 4.7,
        reviewCount: 189,
      },
    }),

    // Books
    prisma.product.create({
      data: {
        title: "Bestseller Fiction Collection 2024",
        slug: "bestseller-fiction-collection-2024",
        description: "Curated collection of 5 bestselling fiction novels from 2024. Includes award-winning titles across genres: literary fiction, thriller, romance, sci-fi, and mystery. Perfect gift for book lovers.",
        shortDescription: "5 bestselling fiction novels from 2024",
        price: 44.99,
        discountPrice: 39.99,
        sku: "BOOK-FIC-011",
        stock: 60,
        categoryId: booksCategory.id,
        tags: "books,fiction,bestseller,reading,gift",
        brand: "TrendyReads",
        images: imgs([
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
        ]),
        thumbnail: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80",
        isFeatured: false,
        averageRating: 4.6,
        reviewCount: 67,
      },
    }),

    // Featured product - extra
    prisma.product.create({
      data: {
        title: "RC Stunt Car 4WD",
        slug: "rc-stunt-car-4wd",
        description: "Remote control car with 360-degree flips, double-sided driving, and all-terrain wheels. 2.4GHz remote control with 50m range. Rechargeable battery provides 20 minutes of continuous play. Perfect gift for kids and adults.",
        shortDescription: "360° flip RC car with all-terrain wheels",
        price: 34.99,
        sku: "TOY-RC-012",
        stock: 90,
        categoryId: electronicsCategory.id,
        tags: "rc car,toy,remote control,kids,gift",
        brand: "SpeedX",
        images: imgs([
          "https://images.unsplash.com/photo-1581235005405-9b5f6e688d3b?w=800&q=80",
        ]),
        thumbnail: "https://images.unsplash.com/photo-1581235005405-9b5f6e688d3b?w=300&q=80",
        isFeatured: true,
        averageRating: 4.4,
        reviewCount: 156,
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);

  // ==================== PRODUCT VARIANTS (Examples) ====================
  console.log("\nCreating product variants...");

  const backpack = products.find((p) => p.sku === "CLTH-BAG-005");
  if (backpack) {
    await Promise.all([
      prisma.productVariant.create({
        data: {
          productId: backpack.id,
          color: "Black",
          stock: 40,
          sku: "CLTH-BAG-005-BLK",
        },
      }),
      prisma.productVariant.create({
        data: {
          productId: backpack.id,
          color: "Navy Blue",
          stock: 35,
          sku: "CLTH-BAG-005-NVY",
        },
      }),
      prisma.productVariant.create({
        data: {
          productId: backpack.id,
          color: "Forest Green",
          stock: 25,
          sku: "CLTH-BAG-005-GRN",
        },
      }),
    ]);
  }

  const sunglasses = products.find((p) => p.sku === "CLTH-SUN-006");
  if (sunglasses) {
    await Promise.all([
      prisma.productVariant.create({
        data: {
          productId: sunglasses.id,
          color: "Gold/Silver",
          stock: 75,
          sku: "CLTH-SUN-006-GLD",
        },
      }),
      prisma.productVariant.create({
        data: {
          productId: sunglasses.id,
          color: "Matte Black",
          stock: 75,
          sku: "CLTH-SUN-006-BLK",
        },
      }),
    ]);
  }

  console.log("✅ Created product variants");

  // ==================== SAMPLE REVIEWS ====================
  console.log("\nCreating sample reviews...");

  const headphones = products.find((p) => p.sku === "ELEC-HEAD-001");
  if (headphones) {
    await prisma.review.create({
      data: {
        userId: user.id,
        productId: headphones.id,
        rating: 5,
        title: "Amazing sound quality!",
        comment: "Best headphones I've ever owned. The noise cancellation is incredible and the battery lasts forever.",
        isApproved: true,
        isVerified: true,
      },
    });
  }

  console.log("✅ Created sample reviews");

  // ==================== SUMMARY ====================
  console.log("\n========================================");
  console.log("🎉 Database seeded successfully!");
  console.log("========================================\n");
  console.log("📊 Summary:");
  console.log(`   Users:        2 (1 Admin, 1 User)`);
  console.log(`   Categories:   ${categories.length}`);
  console.log(`   Products:     ${products.length}`);
  console.log(`   Variants:     5`);
  console.log(`   Reviews:      1\n`);
  console.log("🔐 Login Credentials:\n");
  console.log("   ADMIN:");
  console.log("   Email:    admin@trendycart.com");
  console.log("   Password: admin123\n");
  console.log("   USER:");
  console.log("   Email:    user@trendycart.com");
  console.log("   Password: user123\n");
  console.log("========================================\n");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
