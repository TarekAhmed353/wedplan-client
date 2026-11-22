import { requireRole } from "@/lib/dashboard-auth";

export default async function CustomerLayout({
  children,
}: LayoutProps<"/dashboard/customer">) {
  await requireRole("customer");
  return children;
}
