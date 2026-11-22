import { requireRole } from "@/lib/dashboard-auth";

export default async function AdminLayout({
  children,
}: LayoutProps<"/dashboard/admin">) {
  await requireRole("admin");
  return children;
}
