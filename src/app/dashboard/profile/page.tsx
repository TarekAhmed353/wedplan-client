import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionPlaceholder } from "@/components/dashboard/section-placeholder";

export const metadata: Metadata = {
  title: "Profile settings",
};

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        title="Profile settings"
        description="Update your name and profile photo."
      />
      <SectionPlaceholder text="Editing your profile comes in a later step." />
    </>
  );
}
