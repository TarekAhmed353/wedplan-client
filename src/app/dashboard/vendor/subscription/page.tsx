import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionPlaceholder } from "@/components/dashboard/section-placeholder";

export const metadata: Metadata = {
  title: "Subscription",
};

export default function VendorSubscriptionPage() {
  return (
    <>
      <PageHeader
        title="Subscription"
        description="Your current plan and the Premium upgrade."
      />
      <SectionPlaceholder text="Plan details and the Upgrade to Premium button come with Stripe." />
    </>
  );
}
