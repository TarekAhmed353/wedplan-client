import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthErrorToast } from "@/components/auth/auth-error-toast";
import { SignInForm } from "@/components/auth/sign-in-form";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Sign in",
};

function getErrorMessage(error: string | string[] | undefined) {
  if (!error) return null;

  if (error === "ACCOUNT_BLOCKED") {
    return "Your account is blocked. Please contact support.";
  }

  return "Google sign in did not finish. Please try again.";
}

export default async function SignInPage({
  searchParams,
}: PageProps<"/sign-in">) {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  const { error } = await searchParams;

  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Sign in to WedPlan"
      description="Pick up your wedding plans where you left off."
      withGoogle
    >
      <AuthErrorToast message={getErrorMessage(error)} />
      <SignInForm />
    </AuthCard>
  );
}
