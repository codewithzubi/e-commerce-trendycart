import Link from "next/link";
import {
  ShoppingCart,
  Twitter,
  Facebook,
  Instagram,
  Mail,
  CreditCard,
  MapPin,
  Phone,
} from "lucide-react";
import { Newsletter } from "./newsletter";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-white via-purple-50/60 to-slate-100 text-slate-900 dark:from-[#0f0a1a] dark:via-[#1a0f2e] dark:to-[#0d1b2a] dark:text-white">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle at 25px 25px, currentColor 1px, transparent 0)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500" />

      <div className="container relative z-10 mx-auto px-4 py-16">
        <div className="mb-16 rounded-3xl border border-slate-200/80 bg-white/75 p-8 shadow-2xl backdrop-blur-lg dark:border-white/10 dark:bg-white/5">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h3 className="mb-3 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
              Stay in the Loop
            </h3>
            <p className="mb-6 text-base text-slate-600 dark:text-gray-400 sm:text-lg">
              Get exclusive deals, new arrivals, and trendy updates delivered to your inbox.
            </p>
            <div className="mx-auto max-w-md">
              <Newsletter />
            </div>
          </div>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="group mb-5 inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg transition-transform duration-300 group-hover:scale-110">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-black text-slate-900 transition-colors group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-300">
                TrendyCart
              </span>
            </Link>

            <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-gray-400">
              Your one-stop destination for trendy products, unbeatable deals, and a premium shopping experience.
            </p>

            <div className="flex gap-3">
              {[
                { icon: Twitter, label: "Twitter", color: "hover:bg-sky-500 hover:border-sky-500" },
                { icon: Facebook, label: "Facebook", color: "hover:bg-blue-600 hover:border-blue-600" },
                { icon: Instagram, label: "Instagram", color: "hover:bg-pink-500 hover:border-pink-500" },
              ].map(({ icon: Icon, label, color }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all duration-300 hover:scale-110 hover:text-white hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:text-gray-400 ${color}`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
              <div className="h-1 w-8 rounded-full bg-gradient-to-r from-violet-500 to-pink-500" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/products", label: "Products" },
                { href: "/orders", label: "Orders" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-600 transition-all duration-300 hover:translate-x-1 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-300"
                  >
                    <span className="h-0 w-0 rounded-full bg-violet-400 transition-all duration-300 group-hover:h-0.5 group-hover:w-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
              <div className="h-1 w-8 rounded-full bg-gradient-to-r from-pink-500 to-cyan-500" />
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/refunds", label: "Refund Policy" },
                { href: "/terms", label: "Terms of Service" },
                { href: "/privacy", label: "Privacy Policy" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-600 transition-all duration-300 hover:translate-x-1 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-300"
                  >
                    <span className="h-0 w-0 rounded-full bg-pink-400 transition-all duration-300 group-hover:h-0.5 group-hover:w-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
              <div className="h-1 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
                  <MapPin className="h-4 w-4 text-cyan-500" />
                </div>
                <p className="text-sm leading-snug text-slate-600 dark:text-gray-400">
                  123 Trendy Street
                  <br />
                  Lahore, Pakistan
                </p>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
                  <Mail className="h-4 w-4 text-pink-500" />
                </div>
                <a
                  href="mailto:support@trendycart.com"
                  className="text-sm text-slate-600 transition-colors hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-300"
                >
                  support@trendycart.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
                  <Phone className="h-4 w-4 text-violet-500" />
                </div>
                <a
                  href="tel:+923001234567"
                  className="text-sm text-slate-600 transition-colors hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-300"
                >
                  +92 300 1234567
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-white/10" />

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm text-slate-600 dark:text-gray-500">
              &copy; {new Date().getFullYear()} <span className="font-semibold text-slate-900 dark:text-gray-300">TrendyCart</span>. All rights reserved.
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-gray-600">
              Made with love in Pakistan
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <span className="mr-2 text-xs text-slate-500 dark:text-gray-600">We Accept:</span>
            {[
              { name: "Visa", color: "from-blue-600 to-blue-700" },
              { name: "Mastercard", color: "from-red-500 to-orange-500" },
              { name: "Stripe", color: "from-purple-500 to-indigo-600" },
            ].map(({ name, color }) => (
              <div
                key={name}
                className={`flex h-8 items-center justify-center rounded-lg bg-gradient-to-r ${color} px-3 shadow-md`}
              >
                <CreditCard className="h-4 w-4 text-white" />
                <span className="ml-1 hidden text-[10px] font-bold text-white sm:inline">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
