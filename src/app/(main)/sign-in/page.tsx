import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "@/components/auth/sign-in-form";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function SignInPage() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

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
