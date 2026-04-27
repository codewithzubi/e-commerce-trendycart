# 🎯 TrendyCart - Quick Start Card

## ⚡ Fastest Way to Get Running

### Step 1: Open PowerShell
```powershell
cd "C:\Users\Zubair Ahmed\Desktop\E-COM\trendycart"
```

### Step 2: Quick Setup (Copy & Paste All)
```powershell
npm install --legacy-peer-deps
copy .env.example .env
npx prisma generate
npx prisma db push
npx prisma db seed
```

### Step 3: Start Server
```powershell
npm run dev
```

### Step 4: Open Browser
🌐 **http://localhost:3000**

---

## 🔑 Default Logins

### Admin Account
- **Email:** admin@trendycart.com
- **Password:** admin123
- **Access:** Can add/edit/delete products, view all orders

### User Account
- **Email:** user@trendycart.com
- **Password:** user123
- **Access:** Can shop, add to cart, place orders

---

## 📱 Features Available Immediately

✅ **Product Catalog** - 12 sample products with images
✅ **User Authentication** - Email/password login
✅ **Shopping Cart** - Add/remove items, update quantities
✅ **Order Management** - View order history
✅ **Dark/Light Mode** - Toggle in header
✅ **Responsive Design** - Works on all devices
✅ **Admin Dashboard** - Manage products and orders
✅ **AI Chat Assistant** - UI ready (needs OpenAI key)

---

## 🚀 Optional Enhancements

### Enable AI Chatbot
1. Get key from https://platform.openai.com
2. Add to `.env`: `OPENAI_API_KEY=sk-your-key`

### Enable Payments
1. Get keys from https://dashboard.stripe.com
2. Add to `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_your-key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
   ```

### Enable Google Login
1. Setup at https://console.cloud.google.com
2. Add to `.env`:
   ```
   GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-secret
   ```

### Enable Image Uploads
1. Sign up at https://uploadthing.com
2. Add to `.env`:
   ```
   UPLOADTHING_SECRET=sk_live_your-secret
   UPLOADTHING_APP_ID=your-app-id
   ```

---

## 📂 Important Files

| File | Purpose |
|------|---------|
| `.env` | Your environment variables (API keys) |
| `prisma/schema.prisma` | Database structure |
| `src/lib/actions.ts` | Server actions (cart, orders, products) |
| `src/app/page.tsx` | Homepage |
| `src/components/header.tsx` | Site navigation |

---

## 🎨 Tech Stack Summary

- **Framework:** Next.js 16.2.2 + React 19
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS v4
- **UI:** Shadcn/ui + Radix UI
- **Database:** SQLite (dev) / PostgreSQL (prod)
- **ORM:** Prisma 6.5
- **Auth:** NextAuth.js v5
- **Payments:** Stripe
- **AI:** Vercel AI SDK + OpenAI GPT-4o
- **Uploads:** UploadThing

---

## 💡 Pro Tips

1. **View Database:** Run `npm run db:studio` to open Prisma Studio
2. **Add Products:** Login as admin → Admin Dashboard → Add Product
3. **Test Checkout:** Works without Stripe keys (just won't process payment)
4. **AI Chat:** Click the message bubble icon (bottom-right)
5. **Dark Mode:** Click the sun/moon icon in header

---

## 🆘 Need Help?

- **Setup Issues:** See `SETUP_GUIDE.md`
- **Full Documentation:** See `README.md`
- **Database Questions:** Check `prisma/schema.prisma`
- **API Routes:** Look in `src/app/api/`

---

**Made with ❤️ using Next.js 16**
