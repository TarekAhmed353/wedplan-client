import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionPlaceholder } from "@/components/dashboard/section-placeholder";

export const metadata: Metadata = {
  title: "Add service",
};

export default function VendorServicesNewPage() {
  return (
    <>
      <PageHeader
        title="Add service"
        description="List a new wedding service for customers to find."
      />
      <SectionPlaceholder text="The form to add a service comes in the next step." />
    </>
  );
}
