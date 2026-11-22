import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { getSafeRedirect } from "@/lib/safe-redirect";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Sign up",
};

export default async function SignUpPage({
  searchParams,
}: PageProps<"/sign-up">) {
  const { role, redirect: redirectParam } = await searchParams;
  const redirectTo = getSafeRedirect(redirectParam);
  const session = await getSession();

  if (session) {
    redirect(redirectTo);
  }

  const defaultRole = role === "vendor" || role === "customer" ? role : "";

  return (
    <AuthCard
      eyebrow="Join WedPlan"
      title="Create your account"
      description="Book trusted wedding vendors, or list your own services."
      googleRedirectTo={redirectTo}
    >
      <SignUpForm defaultRole={defaultRole} redirectTo={redirectTo} />
    </AuthCard>
  );
}
