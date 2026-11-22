import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionPlaceholder } from "@/components/dashboard/section-placeholder";

export const metadata: Metadata = {
  title: "Booking requests",
};

export default function VendorBookingsPage() {
  return (
    <>
      <PageHeader
        title="Booking requests"
        description="Requests from customers for your services."
      />
      <SectionPlaceholder text="You will accept or reject booking requests here." />
    </>
  );
}
