"use client";

import {
  BadgePercent,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";

type TickerItem = {
  icon: LucideIcon;
  text: string;
};

const tickerItems: TickerItem[] = [
  { icon: Sparkles, text: "New Summer Collection 2026 is Live" },
  { icon: Truck, text: "Free Shipping on All Orders Above \u20B92500" },
  { icon: RefreshCcw, text: "30-Day Hassle-Free Return Policy" },
  { icon: ShieldCheck, text: "Secure Payment with Stripe & Razorpay" },
  { icon: Users, text: "Trusted by 50,000+ Happy Customers" },
  { icon: BadgePercent, text: "Limited Time: Up to 60% Off on Selected Items" },
  { icon: Truck, text: "Same Day Delivery in Selected Cities" },
];

export function HomeNewsTicker() {
  return (
    <section className="relative z-10 w-[100vw] -translate-x-1/2 left-1/2 overflow-hidden px-0 pt-6 pb-10 sm:pt-8 sm:pb-12 lg:pt-10 lg:pb-14">
      <div className="relative w-full overflow-hidden border-y border-white/10 bg-[linear-gradient(90deg,#120f2f_0%,#1a123d_35%,#0f172a_70%,#070b16_100%)] shadow-[0_18px_50px_rgba(15,23,42,0.28)]">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-500/10 to-cyan-500/10" />
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#070b16] to-transparent sm:w-32" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#070b16] to-transparent sm:w-32" />

        <div className="relative overflow-hidden">
          <div className="group flex w-max min-w-max items-center py-4 animate-marquee-scroll group-hover:[animation-play-state:paused] sm:py-5">
            {[...tickerItems, ...tickerItems].map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={`${item.text}-${index}`}
                  className="flex min-w-max shrink-0 items-center gap-4 px-6 text-slate-50 sm:px-8"
                >
                  <Icon className="h-5 w-5 shrink-0 text-fuchsia-300" />
                  <span className="text-[0.95rem] font-semibold tracking-[0.015em] text-slate-100 sm:text-[1.05rem]">
                    {item.text}
                  </span>
                  <span className="text-sm font-bold text-white/40 sm:text-base">•</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
