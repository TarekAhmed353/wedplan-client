import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionPlaceholder } from "@/components/dashboard/section-placeholder";

export const metadata: Metadata = {
  title: "Vendor overview",
};

export default function VendorPage() {
  return (
    <>
      <PageHeader
        title="Overview"
        description="Your services, bookings and plan at a glance."
      />
      <SectionPlaceholder text="Your service and booking numbers will show here soon." />
    </>
  );
}
