"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate subscription (in production, integrate with email service)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSuccess(true);
    setIsLoading(false);
    setEmail("");
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-cyan-200/70 bg-gradient-to-r from-fuchsia-50 via-pink-50 to-cyan-50 p-4 text-center shadow-sm dark:border-cyan-900/40 dark:from-fuchsia-950/30 dark:via-pink-950/20 dark:to-cyan-950/20 animate-in fade-in zoom-in duration-300">
        <CheckCircle className="mx-auto mb-2 h-5 w-5 text-cyan-600 dark:text-cyan-300" />
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Subscribed successfully!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          required
        />
        <Button
          type="submit"
          disabled={isLoading}
          size="sm"
          className="border-0 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 text-white shadow-[0_16px_35px_rgba(236,72,153,0.24)] transition-all duration-300 hover:scale-105"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Get updates on new products and exclusive deals
      </p>
    </form>
  );
}
