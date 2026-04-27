# TrendyCart 🛒

A modern, production-ready full-stack e-commerce platform built with Next.js 16, TypeScript, AI-powered shopping assistant, and Stripe payments.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2d3748?style=for-the-badge&logo=prisma)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635bff?style=for-the-badge&logo=stripe)
![AI](https://img.shields.io/badge/AI-Groq-10a37f?style=for-the-badge&logo=openai)

---

## ✨ Features

### 🛍️ Customer Features
- **Product Catalog** — Browse, search, filter, and sort products
- **Smart Search** — Full-text search across titles, descriptions, brands, and tags
- **Shopping Cart** — Add, update, remove items with real-time count
- **Wishlist** — Save products for later
- **Secure Checkout** — Stripe-powered payments with test mode
- **Order History** — View past orders and track status
- **AI Chat Assistant** — Groq-powered shopping assistant
- **Dark Mode** — System-aware theme switching
- **Fully Responsive** — Works on mobile, tablet, and desktop

### 🛠️ Admin Features
- **Dashboard Overview** — Stats, revenue, low stock alerts
- **Product Management** — Add, edit, delete products with image uploads
- **Order Management** — View orders, update status, track fulfillment
- **User Management** — View registered users
- **Role-Based Access** — Admin-only protected routes

### 🤖 AI Chatbot Capabilities
- Search and browse products by category, brand, or keyword
- Provide detailed product information and recommendations
- Add items to cart or manage existing cart
- View and manage wishlist
- Check order history and status
- Answer checkout and payment questions
- Suggest alternatives and guide to purchase

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 (Strict Mode) |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | Shadcn/ui + Radix UI |
| **Database** | PostgreSQL (Neon) |
| **ORM** | Prisma 6.5 |
| **Authentication** | NextAuth.js v5 |
| **Payments** | Stripe Checkout |
| **File Uploads** | UploadThing |
| **AI** | Vercel AI SDK + Groq |
| **Validation** | Zod |
| **Notifications** | Sonner (Toast) |
| **Icons** | Lucide React |

---

## 📋 Prerequisites

Before running the project, ensure you have:

- **Node.js** 18 or higher
- **npm** or **yarn** package manager
- **Groq API Key** (for AI chatbot) — [Get here](https://console.groq.com/keys)
- **Stripe Account** (for payments) — [Get here](https://stripe.com)
- **UploadThing Account** (for image uploads) — [Get here](https://uploadthing.com)

---

## 🚀 Getting Started

Follow these steps to run TrendyCart locally:

### 1. Clone the Repository

```bash
cd trendycart
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in the required values:

- `DATABASE_URL` — Set to your Neon PostgreSQL connection string
- `NEXTAUTH_SECRET` — Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` — Set to `http://localhost:3000` locally, and your Vercel URL in production
- `GROQ_API_KEY` — Your Groq API key
- `UPLOADTHING_SECRET` & `UPLOADTHING_APP_ID` — From UploadThing dashboard
- `STRIPE_*` keys — From Stripe dashboard

### 4. Set Up Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Default Credentials

After running `npm run db:seed`, you can log in with:

### Admin Account
- **Email:** `admin@trendycart.com`
- **Password:** `admin123`
- **Access:** Full admin dashboard, product/order management

### User Account
- **Email:** `user@trendycart.com`
- **Password:** `user123`
- **Access:** Shopping, cart, orders, wishlist

---

## 💳 Testing Payments

Use this test card during checkout:

- **Card Number:** `4242 4242 4242 4242`
- **Expiry:** Any future date (e.g., `12/30`)
- **CVC:** Any 3 digits (e.g., `123`)

---

## 📁 Project Structure

```
trendycart/
├── prisma/
│   ├── schema.prisma          # Database models & relations
│   ├── seed.ts                # Sample data seeder
│   └── seed.ts                # Sample data seeder for PostgreSQL/Neon
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── admin/             # Admin dashboard (protected)
│   │   ├── api/               # API routes
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Checkout flow
│   │   ├── products/          # Product catalog & detail
│   │   ├── orders/            # Order history
│   │   └── ...                # Other pages
│   ├── components/            # React components
│   │   ├── ui/                # Shadcn/ui primitives
│   │   ├── admin/             # Admin components
│   │   ├── chat/              # AI chat UI
│   │   └── ...                # Reusable components
│   ├── lib/                   # Utilities & server logic
│   │   ├── actions.ts         # Server actions
│   │   ├── auth.ts            # NextAuth config
│   │   ├── prisma.ts          # Prisma client
│   │   ├── stripe.ts          # Stripe client
│   │   └── ...                # Helpers
│   └── types/                 # TypeScript types
├── .env.example               # Environment template
├── next.config.ts             # Next.js configuration
└── package.json
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Sync schema to database |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |
| `npm run db:seed` | Seed database with sample data |

---

## 🌐 Deployment on Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure environment variables from `.env.example`
5. Click **"Deploy"**

### Step 3: Set Up Production Database

This project already uses PostgreSQL. For Vercel, connect it to Neon:

1. Create a PostgreSQL database on [Neon](https://neon.tech)

2. Copy the Neon connection string into `DATABASE_URL`:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require"
   ```

3. Push the schema:
   ```bash
   npm run db:push
   ```

4. Seed the database:
   ```bash
   npm run db:seed
   ```

### Step 4: Configure Production URLs

Update these in your Vercel environment variables:

- `NEXTAUTH_URL` — Your production URL (e.g., `https://trendycart.vercel.app`)
- `NEXTAUTH_SECRET` — Generate a new secret for production
- Use production Stripe keys (not test mode)

### Step 5: Vercel Environment Variables

Set these in the Vercel project settings:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GROQ_API_KEY`
- `UPLOADTHING_SECRET`
- `UPLOADTHING_APP_ID`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

---

## 🎨 Key Pages

| URL | Description |
|-----|-------------|
| `/` | Home page with hero, categories, featured products |
| `/products` | Product catalog with filters, search, sorting |
| `/products/[slug]` | Product detail page with variants & reviews |
| `/cart` | Shopping cart with quantity controls |
| `/wishlist` | Saved products |
| `/checkout` | Shipping info + Stripe payment |
| `/checkout/success` | Order confirmation |
| `/orders` | User order history |
| `/admin` | Admin dashboard overview |
| `/admin/products` | Product management (CRUD) |
| `/admin/orders` | Order management & status updates |

---

## 🔒 Security Features

- **Role-Based Access Control** — Admin routes protected by role check
- **Server-Side Validation** — All API routes validate sessions
- **Password Hashing** — bcrypt for credential security
- **JWT Sessions** — Secure, encrypted session management
- **Stripe Integration** — PCI-compliant payment processing
- **Input Sanitization** — Zod validation on all user inputs
- **HSTS & Security Headers** — Configured in `next.config.ts`

---

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset schema and reseed (PostgreSQL/Neon)
npx prisma db push
npm run db:seed
```

### Prisma Client Errors
```bash
npm run db:generate
```

### Auth Not Working
- Ensure `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your current URL
- Clear browser cookies and try again

### AI Chatbot Not Responding
- Verify `GROQ_API_KEY` is valid
- Check OpenAI account has available credits
- Ensure API key has proper permissions

### Image Upload Fails
- Verify UploadThing keys are correct
- Check UploadThing app is active in dashboard
- Ensure file size is under 4MB per image

---

## 📝 License

MIT License — feel free to use this project for learning or commercial purposes.

---

## 🤝 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js 16, TypeScript, and modern web technologies**
