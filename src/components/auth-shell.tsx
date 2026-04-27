"use client";

import { useEffect, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Heart,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Mode = "login" | "signup";

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function AuthShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const initialMode = (searchParams.get("mode") === "signup" ? "signup" : "login") as Mode;

  const [mode, setMode] = useState<Mode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const nextMode = (searchParams.get("mode") === "signup" ? "signup" : "login") as Mode;
    setMode(nextMode);
  }, [searchParams]);

  const branding = useMemo(() => {
    if (mode === "signup") {
      return {
        title: "Join TrendyCart Today",
        subtitle: "Start shopping smarter with premium deals, curated picks, and a seamless checkout experience.",
        bullets: [
          { icon: ShoppingBag, text: "Curated trending products" },
          { icon: ShieldCheck, text: "Secure and fast checkout" },
          { icon: Heart, text: "Save favorites to wishlist" },
        ],
      };
    }

    return {
      title: "Welcome Back to TrendyCart",
      subtitle: "Shop the latest trends with confidence, discover new arrivals, and pick up right where you left off.",
      bullets: [
        { icon: Truck, text: "Fast delivery and easy returns" },
        { icon: ShieldCheck, text: "Trusted payment protection" },
        { icon: Star, text: "Top-rated products and offers" },
      ],
    };
  }, [mode]);

  function updateMode(nextMode: Mode) {
    setMode(nextMode);
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", nextMode);
    router.replace(`/login?${params.toString()}`);
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: loginForm.email,
        password: loginForm.password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        toast.error("Invalid email or password. Please try again.");
        return;
      }

      toast.success("Logged in successfully!");
      router.push(callbackUrl);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignupSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (signupForm.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupForm.name,
          email: signupForm.email,
          password: signupForm.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Registration failed");
        return;
      }

      toast.success("Account created successfully!");
      setMode("login");
      const params = new URLSearchParams(searchParams.toString());
      params.set("mode", "login");
      router.replace(`/login?${params.toString()}`);

      await signIn("credentials", {
        email: signupForm.email,
        password: signupForm.password,
        redirect: false,
        callbackUrl,
      });

      router.push(callbackUrl);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch {
      toast.error("Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/60 to-cyan-50/50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl items-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 shadow-[0_30px_100px_rgba(76,29,149,0.18)] backdrop-blur-2xl lg:grid-cols-2 dark:border-white/10 dark:bg-slate-950/70">
          {/* Form Side */}
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mb-6 flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to home
              </Link>
              <button
                type="button"
                onClick={() => updateMode(mode === "login" ? "signup" : "login")}
                className="rounded-full border border-purple-200/70 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 transition-all hover:bg-purple-100 dark:border-purple-900/50 dark:bg-purple-950/30 dark:text-purple-300"
              >
                {mode === "login" ? "Sign up" : "Login"}
              </button>
            </div>

            <div className="mb-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/30 dark:text-purple-300">
                <Sparkles className="h-3.5 w-3.5" />
                TrendyCart
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                <span className="bg-gradient-to-r from-purple-700 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                  {mode === "login" ? "Sign in to continue" : "Create your account"}
                </span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                {mode === "login"
                  ? "Access your cart, wishlist, and orders with a secure login."
                  : "Join the store for a smoother checkout, saved favorites, and personalized deals."}
              </p>
            </div>

            <div className="mb-6 grid gap-3 rounded-[1.5rem] border border-purple-100/80 bg-gradient-to-br from-white to-purple-50/50 p-4 dark:border-white/10 dark:from-slate-950 dark:to-purple-950/20">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="h-12 border border-slate-200 bg-white text-slate-900 transition-all duration-300 hover:border-purple-200 hover:bg-purple-50 dark:border-white/10 dark:bg-slate-950/40 dark:text-white"
              >
                {googleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                {googleLoading ? "Connecting..." : "Continue with Google"}
              </Button>
              <p className="text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Or continue with email
              </p>
            </div>

            <div style={{ perspective: "1200px" }}>
              <div
                className={cn(
                  "relative min-h-[520px] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                )}
                style={{
                  transformStyle: "preserve-3d",
                  transform: mode === "signup" ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Login Face */}
                <div
                  className={cn(
                    "absolute inset-0",
                    mode === "signup" && "pointer-events-none opacity-0"
                  )}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          className="h-12 rounded-xl border-slate-200 pl-10 transition-all focus-visible:border-purple-400 focus-visible:ring-purple-300 dark:border-white/10 dark:bg-slate-950/30"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          className="h-12 rounded-xl border-slate-200 pl-10 pr-11 transition-all focus-visible:border-purple-400 focus-visible:ring-purple-300 dark:border-white/10 dark:bg-slate-950/30"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword((value) => !value)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <label className="flex items-center gap-2 text-sm text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 dark:border-white/20 dark:bg-slate-950"
                        />
                        Remember me
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-purple-700 transition-colors hover:text-purple-900 dark:text-purple-300 dark:hover:text-purple-200"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="h-12 w-full border-0 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 font-semibold text-white shadow-[0_16px_35px_rgba(236,72,153,0.28)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_18px_45px_rgba(236,72,153,0.34)]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => updateMode("signup")}
                        className="font-semibold text-purple-700 transition-colors hover:text-purple-900 dark:text-purple-300 dark:hover:text-purple-200"
                      >
                        Sign up
                      </button>
                    </p>
                  </form>
                </div>

                {/* Signup Face */}
                <div
                  className={cn(
                    "absolute inset-0",
                    mode === "login" && "pointer-events-none opacity-0"
                  )}
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <form onSubmit={handleSignupSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="John Doe"
                          value={signupForm.name}
                          onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                          className="h-12 rounded-xl border-slate-200 pl-10 transition-all focus-visible:border-purple-400 focus-visible:ring-purple-300 dark:border-white/10 dark:bg-slate-950/30"
                          required
                          minLength={2}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          value={signupForm.email}
                          onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                          className="h-12 rounded-xl border-slate-200 pl-10 transition-all focus-visible:border-purple-400 focus-visible:ring-purple-300 dark:border-white/10 dark:bg-slate-950/30"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type={showSignupPassword ? "text" : "password"}
                          placeholder="Min. 6 characters"
                          value={signupForm.password}
                          onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                          className="h-12 rounded-xl border-slate-200 pl-10 pr-11 transition-all focus-visible:border-purple-400 focus-visible:ring-purple-300 dark:border-white/10 dark:bg-slate-950/30"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword((value) => !value)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter password"
                          value={signupForm.confirmPassword}
                          onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                          className="h-12 rounded-xl border-slate-200 pl-10 pr-11 transition-all focus-visible:border-purple-400 focus-visible:ring-purple-300 dark:border-white/10 dark:bg-slate-950/30"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((value) => !value)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="h-12 w-full border-0 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 font-semibold text-white shadow-[0_16px_35px_rgba(236,72,153,0.28)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_18px_45px_rgba(236,72,153,0.34)]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => updateMode("login")}
                        className="font-semibold text-purple-700 transition-colors hover:text-purple-900 dark:text-purple-300 dark:hover:text-purple-200"
                      >
                        Login
                      </button>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Branding Side */}
          <div className="relative hidden overflow-hidden p-8 lg:block lg:p-10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4c1d95] via-[#be185d] to-[#2563eb]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.22),_transparent_35%)]" />
            <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-fuchsia-400/30 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-400/25 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col justify-between text-white">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] backdrop-blur-md">
                  <Sparkles className="h-4 w-4" />
                  TrendyCart
                </div>

                <h2 className="mt-8 max-w-md text-4xl font-black leading-tight">
                  {branding.title}
                </h2>
                <p className="mt-5 max-w-lg text-base leading-8 text-white/90">
                  {branding.subtitle}
                </p>
              </div>

              <div className="space-y-4">
                {branding.bullets.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.text}
                      className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <p className="font-medium text-white/95">{item.text}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                <p className="text-sm uppercase tracking-[0.2em] text-white/75">Shopping made better</p>
                <p className="mt-3 text-lg font-semibold">
                  Premium products, clean checkout, and a polished shopping experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
