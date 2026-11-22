import { requireRole } from "@/lib/dashboard-auth";

export default async function VendorLayout({
  children,
}: LayoutProps<"/dashboard/vendor">) {
  await requireRole("vendor");
  return children;
}
