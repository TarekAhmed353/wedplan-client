import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BlockedNotice } from "@/components/dashboard/blocked-notice";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Account blocked",
};

export default async function AccountBlockedPage() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  if (!session.user.isBlocked) {
    redirect("/dashboard");
  }

  return <BlockedNotice />;
}
