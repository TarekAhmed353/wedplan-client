import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionPlaceholder } from "@/components/dashboard/section-placeholder";

export const metadata: Metadata = {
  title: "My services",
};

export default function VendorServicesPage() {
  return (
    <>
      <PageHeader
        title="My services"
        description="All the services you have listed on WedPlan."
      />
      <SectionPlaceholder text="Your services and their approval status will be listed here." />
    </>
  );
}
