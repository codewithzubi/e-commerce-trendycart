# 🚀 TrendyCart Setup Guide

## ⚠️ Important: WSL Permission Issues

Due to WSL/Windows filesystem permission restrictions, you need to complete the setup from **Windows PowerShell** or **Command Prompt**.

---

## 📋 Step-by-Step Setup

### Option 1: Using PowerShell Script (Recommended)

1. **Open PowerShell** in the trendycart directory:
   ```powershell
   cd "C:\Users\Zubair Ahmed\Desktop\E-COM\trendycart"
   ```

2. **Run the setup script:**
   ```powershell
   .\setup.ps1
   ```

3. **If you get execution policy error, run:**
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   .\setup.ps1
   ```

### Option 2: Manual Setup from PowerShell/Command Prompt

```powershell
# Navigate to project
cd "C:\Users\Zubair Ahmed\Desktop\E-COM\trendycart"

# Install dependencies
npm install --legacy-peer-deps

# Copy environment file
copy .env.example .env

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed database with sample data
npx prisma db seed
```

---

## 🔑 Environment Variables Setup

After running the setup, open `.env` and configure these values:

### Required for Basic Functionality:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

**Generate NEXTAUTH_SECRET:**
```powershell
openssl rand -base64 32
```

### Required for AI Chatbot:
```env
OPENAI_API_KEY="sk-your-openai-api-key"
```

Get your key from: https://platform.openai.com/api-keys

### Required for Image Uploads:
```env
UPLOADTHING_SECRET="sk_live_your-secret"
UPLOADTHING_APP_ID="your-app-id"
```

Sign up at: https://uploadthing.com/

### Required for Payments:
```env
STRIPE_SECRET_KEY="sk_test_your-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your-key"
STRIPE_WEBHOOK_SECRET="whsec_your-secret"
```

Get from: https://dashboard.stripe.com/

### Required for Google Login:
```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-secret"
```

Set up at: https://console.cloud.google.com/

---

## 🎯 Quick Start (Minimal Setup)

If you want to test quickly without all the external services:

```powershell
cd "C:\Users\Zubair Ahmed\Desktop\E-COM\trendycart"

# Install dependencies
npm install --legacy-peer-deps

# Copy env file
copy .env.example .env

# Edit .env and only set these (no external services needed):
# DATABASE_URL="file:./dev.db"
# NEXTAUTH_SECRET="any-random-string-here"
# NEXTAUTH_URL="http://localhost:3000"
# Remove or comment out OPENAI, UPLOADTHING, STRIPE, and GOOGLE keys

# Setup database
npx prisma generate
npx prisma db push
npx prisma db seed

# Start the app
npm run dev
```

This will give you a working app with:
- ✅ Product browsing
- ✅ User authentication (email/password)
- ✅ Shopping cart
- ✅ Order management
- ❌ AI Chatbot (requires OpenAI key)
- ❌ Image uploads (requires UploadThing)
- ❌ Payment processing (requires Stripe)
- ❌ Google login (requires Google OAuth)

---

## 🚀 Start the Development Server

```powershell
npm run dev
```

Open your browser to: **http://localhost:3000**

---

## 🔐 Default Login Credentials

After running `npm run db:seed`:

**Admin Account:**
- Email: `admin@trendycart.com`
- Password: `admin123`

**Regular User:**
- Email: `user@trendycart.com`
- Password: `user123`

---

## 📦 Installed Packages

### Dependencies:
- `next@16.2.2` - Next.js framework
- `react@19.2.4` - React 19
- `react-dom@19.2.4` - React DOM
- `@prisma/client@6.5.0` - Prisma ORM client
- `next-auth@5.0.0-beta.25` - Authentication
- `@auth/prisma-adapter@2.8.0` - Prisma adapter for NextAuth
- `ai@4.2.0` - Vercel AI SDK
- `@ai-sdk/openai@1.3.0` - OpenAI integration
- `@ai-sdk/react@1.2.0` - React hooks for AI
- `stripe@17.7.0` - Stripe payments
- `@stripe/stripe-js@5.7.0` - Stripe JavaScript client
- `uploadthing@7.6.0` - File uploads
- `@uploadthing/react@7.1.0` - React components for UploadThing
- `zod@3.24.2` - Schema validation
- `lucide-react@0.479.0` - Icon library
- `next-themes@0.4.6` - Theme management
- `bcryptjs@3.0.2` - Password hashing
- `class-variance-authority@0.7.1` - Component variants
- `clsx@2.1.1` - className utility
- `tailwind-merge@3.0.2` - Tailwind class merger
- `@radix-ui/*` - Headless UI primitives

### DevDependencies:
- `typescript@5` - TypeScript
- `tailwindcss@4` - Tailwind CSS v4
- `@tailwindcss/postcss@4` - PostCSS plugin
- `prisma@6.5.0` - Prisma CLI
- `eslint@9` - Linter
- `eslint-config-next@16.2.2` - Next.js ESLint config
- `@types/node`, `@types/react`, `@types/react-dom`, `@types/bcryptjs` - Type definitions

---

## 📁 Complete Folder Structure

```
trendycart/
│
├── prisma/
│   ├── schema.prisma              # Database models (User, Product, Cart, Order, etc.)
│   └── seed.ts                    # Sample data (12 products + 2 users)
│
├── public/                        # Static assets
│
├── src/
│   ├── app/                       # Next.js 16 App Router
│   │   ├── layout.tsx             # Root layout with providers
│   │   ├── page.tsx               # Home page (hero + featured products)
│   │   ├── globals.css            # Tailwind v4 + CSS variables
│   │   │
│   │   ├── products/
│   │   │   ├── page.tsx           # Products listing with filters
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Product detail page
│   │   │
│   │   ├── cart/
│   │   │   └── page.tsx           # Shopping cart page
│   │   │
│   │   ├── checkout/
│   │   │   └── page.tsx           # Checkout flow
│   │   │
│   │   ├── orders/
│   │   │   └── page.tsx           # Order history
│   │   │
│   │   ├── admin/
│   │   │   ├── page.tsx           # Admin dashboard
│   │   │   └── products/
│   │   │       └── new/
│   │   │           └── page.tsx   # Add product form
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts   # NextAuth endpoints
│   │       │
│   │       ├── chat/
│   │       │   ├── route.ts       # AI chatbot API
│   │       │   └── tools.ts       # Tool definitions
│   │       │
│   │       ├── uploadthing/
│   │       │   └── route.ts       # Upload handler
│   │       │
│   │       └── webhooks/
│   │           └── stripe/
│   │               └── route.ts   # Stripe webhook
│   │
│   ├── components/
│   │   ├── ui/                    # Shadcn/ui primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   └── skeleton.tsx
│   │   │
│   │   ├── chat/                  # AI Chat components
│   │   │   ├── ChatBot.tsx        # Floating chat widget
│   │   │   └── ChatMessage.tsx    # Message bubble
│   │   │
│   │   ├── header.tsx             # Site header with nav
│   │   ├── footer.tsx             # Site footer
│   │   ├── providers.tsx          # Theme + Auth providers
│   │   ├── theme-toggle.tsx       # Dark/light mode toggle
│   │   ├── product-card.tsx       # Product card component
│   │   └── add-to-cart-button.tsx # Add to cart button
│   │
│   ├── lib/                       # Utilities & configs
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── auth.ts                # NextAuth v5 config
│   │   ├── actions.ts             # Server actions (CRUD operations)
│   │   ├── stripe.ts              # Stripe client
│   │   ├── validations.ts         # Zod schemas
│   │   ├── uploadthing.ts         # UploadThing server config
│   │   ├── uploadthing-client.ts  # UploadThing client components
│   │   └── utils.ts               # Helper functions
│   │
│   └── types/
│       └── index.ts               # TypeScript types/interfaces
│
├── .env.example                   # Environment variables template
├── .gitignore
├── next.config.ts                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies & scripts
├── setup.ps1                      # PowerShell setup script
├── setup.sh                       # Bash setup script
└── README.md                      # Documentation
```

---

## 🛠️ Available NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (http://localhost:3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run db:seed` | Seed database with sample data |

---

## 🤖 AI Chatbot Setup

The AI assistant has tool calling capabilities to:
- Search and browse products
- Manage shopping cart
- Track orders
- Provide recommendations

**To enable:**
1. Get OpenAI API key from https://platform.openai.com
2. Add to `.env`:
   ```env
   OPENAI_API_KEY="sk-your-key-here"
   ```

The chatbot uses GPT-4o model with custom tools defined in `src/app/api/chat/tools.ts`.

---

## 💳 Stripe Payment Setup

1. Create Stripe account at https://dashboard.stripe.com
2. Get API keys from Developers > API keys
3. Add to `.env`:
   ```env
   STRIPE_SECRET_KEY="sk_test_your-key"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your-key"
   ```

4. Setup webhook endpoint:
   - Go to Developers > Webhooks
   - Add endpoint: `http://localhost:3000/api/webhooks/stripe`
   - Listen to `checkout.session.completed` event
   - Copy webhook secret to `.env`:
     ```env
     STRIPE_WEBHOOK_SECRET="whsec_your-secret"
     ```

---

## 📸 UploadThing Setup

1. Sign up at https://uploadthing.com
2. Create a new app
3. Get credentials from dashboard
4. Add to `.env`:
   ```env
   UPLOADTHING_SECRET="sk_live_your-secret"
   UPLOADTHING_APP_ID="your-app-id"
   ```

---

## 🌐 Google OAuth Setup

1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
   - Application type: Web application
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Add to `.env`:
   ```env
   GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-secret"
   ```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@prisma/client'"
**Solution:**
```powershell
npx prisma generate
```

### Issue: "Database not found"
**Solution:**
```powershell
npx prisma db push
```

### Issue: "Missing environment variables"
**Solution:** Make sure `.env` file exists with all required variables

### Issue: Port 3000 already in use
**Solution:**
```powershell
npm run dev -- -p 3001
```

### Issue: WSL permission errors
**Solution:** Run all npm commands from Windows PowerShell/Command Prompt, not from WSL bash

---

## 📚 Next Steps

1. ✅ Complete setup following this guide
2. ✅ Start dev server: `npm run dev`
3. ✅ Open http://localhost:3000
4. ✅ Login with default credentials
5. ✅ Browse products, test cart, checkout
6. ✅ Try the AI chatbot (bottom-right corner)
7. ✅ Access admin dashboard with admin account
8. ✅ Customize and add your own products!

---

## 🎉 You're All Set!

Your TrendyCart e-commerce platform is ready. Start customizing and adding your own products!

For questions or issues, refer to the README.md or check the code comments for detailed explanations.
