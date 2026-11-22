import {
  CalendarHeartIcon,
  ClipboardCheckIcon,
  CrownIcon,
  InboxIcon,
  LayoutDashboardIcon,
  type LucideIcon,
  PlusCircleIcon,
  ReceiptTextIcon,
  StoreIcon,
  UserCogIcon,
  UsersIcon,
} from "lucide-react";

export type DashboardRole = "admin" | "vendor" | "customer";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const profileItem: DashboardNavItem = {
  href: "/dashboard/profile",
  label: "Profile settings",
  icon: UserCogIcon,
};

export const dashboardNav: Record<DashboardRole, DashboardNavItem[]> = {
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboardIcon },
    { href: "/dashboard/admin/users", label: "Manage users", icon: UsersIcon },
    {
      href: "/dashboard/admin/services",
      label: "Manage services",
      icon: ClipboardCheckIcon,
    },
    {
      href: "/dashboard/admin/transactions",
      label: "Transactions",
      icon: ReceiptTextIcon,
    },
    profileItem,
  ],
  vendor: [
    { href: "/dashboard/vendor", label: "Overview", icon: LayoutDashboardIcon },
    { href: "/dashboard/vendor/services", label: "My services", icon: StoreIcon },
    {
      href: "/dashboard/vendor/services/new",
      label: "Add service",
      icon: PlusCircleIcon,
    },
    {
      href: "/dashboard/vendor/bookings",
      label: "Booking requests",
      icon: InboxIcon,
    },
    {
      href: "/dashboard/vendor/subscription",
      label: "Subscription",
      icon: CrownIcon,
    },
    profileItem,
  ],
  customer: [
    {
      href: "/dashboard/customer",
      label: "Overview",
      icon: LayoutDashboardIcon,
    },
    {
      href: "/dashboard/customer/bookings",
      label: "My bookings",
      icon: CalendarHeartIcon,
    },
    profileItem,
  ],
};

export const roleLabels: Record<DashboardRole, string> = {
  admin: "Admin",
  vendor: "Vendor",
  customer: "Customer",
};

export function isDashboardRole(role: unknown): role is DashboardRole {
  return role === "admin" || role === "vendor" || role === "customer";
}

export function getActiveHref(pathname: string, items: DashboardNavItem[]) {
  return items
    .filter(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}
