import type { Metadata } from "next";
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
    <section className="flex flex-1 items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-sm ring-1 ring-foreground/5 sm:p-10">
        <div className="mb-8 space-y-2 text-center">
          <p className="text-xs font-medium tracking-[0.25em] text-gold uppercase">
            Join WedPlan
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Book trusted wedding vendors, or list your own services.
          </p>
        </div>
        <SignUpForm defaultRole={defaultRole} />
      </div>
    </section>
  );
}
