import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionPlaceholder } from "@/components/dashboard/section-placeholder";

export const metadata: Metadata = {
  title: "Customer overview",
};

export default function CustomerPage() {
  return (
    <>
      <PageHeader
        title="Overview"
        description="Your booking requests at a glance."
      />
      <SectionPlaceholder text="Your booking numbers will show here soon." />
    </>
  );
}
