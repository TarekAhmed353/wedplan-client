import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { ChooseRoleForm } from "@/components/auth/choose-role-form";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Choose your role",
};

export default async function ChooseRolePage() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.roleChosen !== false) {
    redirect("/");
  }

  const firstName = session.user.name.split(" ")[0];

  return (
    <AuthCard
      eyebrow={`Welcome, ${firstName}`}
      title="How will you use WedPlan?"
      description="You can only choose once, so pick the one that fits you."
    >
      <ChooseRoleForm />
    </AuthCard>
  );
}
