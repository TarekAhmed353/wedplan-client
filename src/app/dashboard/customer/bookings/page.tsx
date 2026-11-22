import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionPlaceholder } from "@/components/dashboard/section-placeholder";

export const metadata: Metadata = {
  title: "My bookings",
};

export default function CustomerBookingsPage() {
  return (
    <>
      <PageHeader
        title="My bookings"
        description="Every booking request you have sent."
      />
      <SectionPlaceholder text="Your booking requests and their status will be listed here." />
    </>
  );
}
