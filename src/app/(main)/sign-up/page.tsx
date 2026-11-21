import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Sign up",
};

export default async function SignUpPage({
  searchParams,
}: PageProps<"/sign-up">) {
  const { role } = await searchParams;
  const defaultRole = role === "vendor" || role === "customer" ? role : "";

  return (
    <AuthCard
      eyebrow="Join WedPlan"
      title="Create your account"
      description="Book trusted wedding vendors, or list your own services."
    >
      <SignUpForm defaultRole={defaultRole} />
    </AuthCard>
  );
}
