import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionPlaceholder } from "@/components/dashboard/section-placeholder";

export const metadata: Metadata = {
  title: "Transactions",
};

export default function AdminTransactionsPage() {
  return (
    <>
      <PageHeader
        title="Transactions"
        description="Every Premium payment made by vendors."
      />
      <SectionPlaceholder text="The payment history appears here once Stripe is connected." />
    </>
  );
}
