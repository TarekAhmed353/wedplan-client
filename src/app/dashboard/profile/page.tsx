import type { Metadata } from "next";
import { LockIcon } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import { roleLabels } from "@/lib/dashboard";

export const metadata: Metadata = {
  title: "Profile settings",
};

export default async function ProfileSettingsPage() {
  const user = await requireDashboardUser();
  const businessName = typeof user.businessName === "string" ? user.businessName : null;

  return (
    <>
      <PageHeader title="Profile settings" description="Update your name and profile photo." />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <ProfileForm
          name={user.name}
          email={user.email}
          image={user.image ?? null}
          role={user.role}
          businessName={businessName}
        />

        <aside className="h-fit space-y-3 rounded-2xl bg-card p-5 text-sm shadow-sm ring-1 ring-foreground/5">
          <p className="flex items-center gap-2 font-medium">
            <LockIcon className="size-4 text-gold" />
            Account details
          </p>
          <p>
            <span className="block text-xs text-muted-foreground">Account type</span>
            {roleLabels[user.role]}
          </p>
          {user.role === "vendor" && (
            <p>
              <span className="block text-xs text-muted-foreground">Plan</span>
              {user.subscriptionPlan === "premium" ? "Premium" : "Free"}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Your account type and plan cannot be changed from this page.
          </p>
        </aside>
      </div>
    </>
  );
}
