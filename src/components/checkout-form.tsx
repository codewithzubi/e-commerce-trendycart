"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { createCheckoutSession } from "@/lib/actions";
import { toast } from "sonner";
import {
  Loader2,
  CreditCard,
  MapPin,
  ShieldCheck,
  Lock,
  BadgeCheck,
} from "lucide-react";
import type { User } from "next-auth";
import { cn } from "@/lib/utils";

interface CheckoutFormProps {
  user: User;
}

type CheckoutErrors = Partial<Record<
  "name" | "email" | "phone" | "addressLine1" | "addressLine2" | "city" | "state" | "postalCode" | "country",
  string
>>;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong";
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs font-medium text-rose-600 dark:text-rose-300">{message}</p>;
}

function getFieldClassName(hasError?: boolean) {
  return cn(
    "h-12 rounded-2xl border-slate-200/80 bg-white/90 px-4 text-slate-900 placeholder:text-slate-400 shadow-sm transition-all duration-300 focus-visible:border-fuchsia-400 focus-visible:ring-fuchsia-300 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500",
    hasError &&
      "border-rose-300 focus-visible:border-rose-400 focus-visible:ring-rose-300 dark:border-rose-900/60"
  );
}

export function CheckoutForm({ user }: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const nextErrors: CheckoutErrors = {};

    if (!formData.name.trim()) nextErrors.name = "Full name is required.";
    if (!formData.email.trim()) nextErrors.email = "Email is required.";
    if (!formData.addressLine1.trim()) nextErrors.addressLine1 = "Address line 1 is required.";
    if (!formData.city.trim()) nextErrors.city = "City is required.";
    if (!formData.postalCode.trim()) nextErrors.postalCode = "Postal code is required.";
    if (!formData.country.trim()) nextErrors.country = "Country is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please review the required shipping fields");
      return;
    }

    setIsLoading(true);

    try {
      await createCheckoutSession(formData);
    } catch (error: unknown) {
      if (getErrorMessage(error).includes("NEXT_REDIRECT")) return;
      toast.error("Checkout failed", { description: getErrorMessage(error) });
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border-purple-100/70 bg-white/90 shadow-[0_20px_60px_rgba(76,29,149,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
      <CardHeader className="border-b border-slate-200/70 bg-gradient-to-r from-fuchsia-500/10 via-pink-500/5 to-cyan-500/10 dark:border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/30 dark:text-purple-300">
              <MapPin className="h-3.5 w-3.5" />
              Shipping details
            </div>
            <CardTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Shipping Address
            </CardTitle>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Enter the delivery address where you want your order shipped.
            </p>
          </div>
          <div className="hidden rounded-2xl border border-white/10 bg-white/70 p-3 text-slate-700 shadow-sm dark:bg-white/5 dark:text-slate-200 md:block">
            <ShieldCheck className="h-5 w-5 text-purple-500" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 p-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={getFieldClassName(!!errors.name)}
                  required
                />
                <FieldError message={errors.name} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Contact Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={getFieldClassName(!!errors.email)}
                  required
                />
                <FieldError message={errors.email} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className={getFieldClassName(!!errors.phone)}
              />
              <FieldError message={errors.phone} />
            </div>
          </section>

          <Separator className="bg-slate-200/70 dark:bg-white/10" />

          <section className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="addressLine1" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Address Line 1 *
                </Label>
                <Input
                  id="addressLine1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                  className={getFieldClassName(!!errors.addressLine1)}
                  required
                />
                <FieldError message={errors.addressLine1} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine2" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Address Line 2
                </Label>
                <Input
                  id="addressLine2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  placeholder="Apartment, suite, unit"
                  className={getFieldClassName(!!errors.addressLine2)}
                />
                <FieldError message={errors.addressLine2} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  City *
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="New York"
                  className={getFieldClassName(!!errors.city)}
                  required
                />
                <FieldError message={errors.city} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Province / State
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="NY"
                  className={getFieldClassName(!!errors.state)}
                />
                <FieldError message={errors.state} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="postalCode" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Postal Code *
                </Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="10001"
                  className={getFieldClassName(!!errors.postalCode)}
                  required
                />
                <FieldError message={errors.postalCode} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Country *
                </Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="United States"
                  className={getFieldClassName(!!errors.country)}
                  required
                />
                <FieldError message={errors.country} />
              </div>
            </div>
          </section>

          <Separator className="bg-slate-200/70 dark:bg-white/10" />

          <section className="space-y-4">
            <div className="rounded-[1.75rem] border border-purple-100/70 bg-gradient-to-br from-white to-purple-50/40 p-5 shadow-sm dark:border-white/10 dark:from-slate-950 dark:to-slate-900">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-cyan-500 text-white shadow-lg">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Secure Payment
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    You&apos;ll be redirected to Stripe to complete payment securely. We never store card details on this site.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {["Visa", "Mastercard", "Amex", "Stripe"].map((method) => (
                  <Badge
                    key={method}
                    variant="secondary"
                    className="rounded-full border border-white/50 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  >
                    {method}
                  </Badge>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {[
                  { icon: ShieldCheck, text: "Secure Checkout" },
                  { icon: Lock, text: "SSL Protected" },
                  { icon: BadgeCheck, text: "Trusted Payments" },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/80 px-3 py-2 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                  >
                    <Icon className="h-4 w-4 text-purple-500" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full border-0 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 text-white shadow-[0_16px_35px_rgba(236,72,153,0.24)] transition-all duration-300 hover:scale-[1.01]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Redirecting to Stripe...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                Place Order
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
