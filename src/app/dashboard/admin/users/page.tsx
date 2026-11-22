import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionPlaceholder } from "@/components/dashboard/section-placeholder";

export const metadata: Metadata = {
  title: "Manage users",
};

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader
        title="Manage users"
        description="Find users, see their details, and block or unblock accounts."
      />
      <SectionPlaceholder text="Searching, filtering and blocking users comes in a later step." />
    </>
  );
}
