"use client";

import Link from "next/link";
import { ShoppingBag, Package, Gift, ArrowLeft, Search, Heart, Star } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden flex items-center justify-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-pink-50 to-orange-100 dark:from-violet-950 dark:via-pink-950 dark:to-orange-950 animate-gradient-shift" />

      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-icon floating-icon-1">
          <ShoppingBag className="w-12 h-12 text-violet-400/30 dark:text-violet-500/20" />
        </div>
        <div className="floating-icon floating-icon-2">
          <Package className="w-10 h-10 text-pink-400/30 dark:text-pink-500/20" />
        </div>
        <div className="floating-icon floating-icon-3">
          <Gift className="w-14 h-14 text-orange-400/30 dark:text-orange-500/20" />
        </div>
        <div className="floating-icon floating-icon-4">
          <Heart className="w-8 h-8 text-rose-400/30 dark:text-rose-500/20" />
        </div>
        <div className="floating-icon floating-icon-5">
          <Star className="w-10 h-10 text-amber-400/30 dark:text-amber-500/20" />
        </div>
        <div className="floating-icon floating-icon-6">
          <Search className="w-9 h-9 text-cyan-400/30 dark:text-cyan-500/20" />
        </div>
        <div className="floating-icon floating-icon-7">
          <ShoppingBag className="w-11 h-11 text-emerald-400/30 dark:text-emerald-500/20" />
        </div>
        <div className="floating-icon floating-icon-8">
          <Package className="w-13 h-13 text-indigo-400/30 dark:text-indigo-500/20" />
        </div>

        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-violet-300/20 to-pink-300/20 rounded-full blur-xl animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-orange-300/20 to-amber-300/20 rounded-full blur-xl animate-float-slow" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-pink-300/20 to-rose-300/20 rounded-full blur-xl animate-float-medium" />
        <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-gradient-to-br from-cyan-300/20 to-blue-300/20 rounded-full blur-xl animate-float-fast" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        {/* Animated 404 text */}
        <div className="mb-8">
          <h1 className="text-9xl sm:text-[12rem] font-black leading-none select-none animate-pulse-slow">
            <span className="bg-gradient-to-r from-violet-600 via-pink-600 to-orange-600 bg-clip-text text-transparent animate-gradient-text">
              404
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 animate-fade-in-up">
          Oops! Page Not Found
        </h2>

        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto animate-fade-in-up animation-delay-200">
          The page you are looking for seems to have wandered off.
          Let us help you find your way back to shopping!
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-400">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-violet-600 via-pink-600 to-orange-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Go Home
          </Link>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-background/80 backdrop-blur-sm border border-border text-foreground font-semibold rounded-full hover:bg-background hover:shadow-md transition-all duration-300 hover:scale-105"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse Products
          </Link>
        </div>

        {/* Fun message */}
        <div className="mt-12 animate-fade-in-up animation-delay-600">
          <p className="text-sm text-muted-foreground">
            Or check out these popular pages:
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <Link href="/products" className="text-sm text-violet-600 dark:text-violet-400 hover:underline">
              Products
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/cart" className="text-sm text-pink-600 dark:text-pink-400 hover:underline">
              Cart
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/orders" className="text-sm text-orange-600 dark:text-orange-400 hover:underline">
              Orders
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/faq" className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline">
              FAQ
            </Link>
          </div>
        </div>
      </div>

      {/* Inline styles for animations */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes gradient-text {
          0%, 100% {
            background-size: 200% auto;
            background-position: 0% center;
          }
          50% {
            background-size: 200% auto;
            background-position: 100% center;
          }
        }

        @keyframes float-1 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(30px, -40px) rotate(10deg);
          }
          50% {
            transform: translate(-20px, -60px) rotate(-5deg);
          }
          75% {
            transform: translate(40px, -20px) rotate(8deg);
          }
        }

        @keyframes float-2 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(-40px, -30px) rotate(-8deg);
          }
          50% {
            transform: translate(30px, -50px) rotate(12deg);
          }
          75% {
            transform: translate(-25px, -25px) rotate(-6deg);
          }
        }

        @keyframes float-3 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          33% {
            transform: translate(50px, -35px) rotate(15deg) scale(1.1);
          }
          66% {
            transform: translate(-30px, -55px) rotate(-10deg) scale(0.95);
          }
        }

        @keyframes float-4 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          20% {
            transform: translate(-35px, -45px) rotate(-12deg);
          }
          40% {
            transform: translate(25px, -30px) rotate(8deg);
          }
          60% {
            transform: translate(-45px, -50px) rotate(-15deg);
          }
          80% {
            transform: translate(35px, -20px) rotate(10deg);
          }
        }

        @keyframes float-5 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(40px, -60px) scale(1.2);
          }
        }

        @keyframes float-6 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(-50px, -40px) rotate(-10deg);
          }
          66% {
            transform: translate(30px, -25px) rotate(15deg);
          }
        }

        @keyframes float-7 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          25% {
            transform: translate(45px, -25px) rotate(12deg) scale(1.05);
          }
          50% {
            transform: translate(-35px, -45px) rotate(-8deg) scale(0.95);
          }
          75% {
            transform: translate(20px, -35px) rotate(6deg) scale(1.02);
          }
        }

        @keyframes float-8 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          30% {
            transform: translate(-30px, -50px) rotate(-15deg);
          }
          70% {
            transform: translate(40px, -30px) rotate(10deg);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-30px) translateX(20px);
          }
        }

        @keyframes float-medium {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-40px) translateX(-25px);
          }
        }

        @keyframes float-fast {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-50px) translateX(30px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.85;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }

        .animate-gradient-text {
          background-size: 200% auto;
          animation: gradient-text 4s ease infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .floating-icon {
          position: absolute;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .floating-icon-1 {
          top: 10%;
          left: 8%;
          animation: float-1 12s infinite;
        }

        .floating-icon-2 {
          top: 15%;
          right: 12%;
          animation: float-2 14s infinite;
        }

        .floating-icon-3 {
          top: 60%;
          left: 5%;
          animation: float-3 16s infinite;
        }

        .floating-icon-4 {
          top: 70%;
          right: 8%;
          animation: float-4 10s infinite;
        }

        .floating-icon-5 {
          bottom: 15%;
          left: 20%;
          animation: float-5 13s infinite;
        }

        .floating-icon-6 {
          top: 25%;
          left: 75%;
          animation: float-6 11s infinite;
        }

        .floating-icon-7 {
          top: 80%;
          right: 25%;
          animation: float-7 15s infinite;
        }

        .floating-icon-8 {
          bottom: 25%;
          left: 15%;
          animation: float-8 17s infinite;
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 15s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
