import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Sign in to WedPlan"
      description="Pick up your wedding plans where you left off."
    >
      <SignInForm />
    </AuthCard>
  );
}
