"use client";

import { usePathname } from "next/navigation";
import { UserMenu, type NavUser } from "@/components/layout/user-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { type DashboardRole, dashboardNav, getActiveHref } from "@/lib/dashboard";

type DashboardHeaderProps = {
  role: DashboardRole;
  user: NavUser;
};

export function DashboardHeader({ role, user }: DashboardHeaderProps) {
  const pathname = usePathname();
  const items = dashboardNav[role];
  const activeHref = getActiveHref(pathname, items);
  const title = items.find((item) => item.href === activeHref)?.label ?? "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border/70 bg-background/85 px-4 backdrop-blur-md md:px-6">
      <SidebarTrigger className="-ml-1 size-9 rounded-full" />
      <Separator orientation="vertical" className="h-5!" />
      <p className="truncate text-sm font-medium text-muted-foreground">{title}</p>
      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
