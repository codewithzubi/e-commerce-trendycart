import { Suspense } from "react";
import { AuthShell } from "@/components/auth-shell";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AuthShell />
    </Suspense>
  );
}
