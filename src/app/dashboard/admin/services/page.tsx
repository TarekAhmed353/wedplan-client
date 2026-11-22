import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionPlaceholder } from "@/components/dashboard/section-placeholder";

export const metadata: Metadata = {
  title: "Manage services",
};

export default function AdminServicesPage() {
  return (
    <>
      <PageHeader
        title="Manage services"
        description="Review new services and approve or reject them."
      />
      <SectionPlaceholder text="Approving, rejecting and removing services comes in a later step." />
    </>
  );
}
