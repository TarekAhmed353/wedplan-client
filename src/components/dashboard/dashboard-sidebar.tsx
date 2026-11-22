"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartIcon, HouseIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  type DashboardRole,
  dashboardNav,
  getActiveHref,
  roleLabels,
} from "@/lib/dashboard";

export function DashboardSidebar({ role }: { role: DashboardRole }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const items = dashboardNav[role];
  const activeHref = getActiveHref(pathname, items);
  const closeMobile = () => setOpenMobile(false);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip="WedPlan home">
              <Link href="/" onClick={closeMobile}>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-gold dark:bg-accent">
                  <HeartIcon className="size-4 fill-current" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="font-heading text-lg font-semibold text-foreground">
                    Wed<span className="text-primary">Plan</span>
                  </span>
                  <span className="text-[0.65rem] font-medium tracking-[0.2em] text-gold uppercase">
                    {`${roleLabels[role]} dashboard`}
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                const active = item.href === activeHref;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                      className="h-10 rounded-lg data-active:bg-accent data-active:text-primary"
                    >
                      <Link
                        href={item.href}
                        onClick={closeMobile}
                        aria-current={active ? "page" : undefined}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Back to website" className="h-10">
              <Link href="/" onClick={closeMobile}>
                <HouseIcon />
                <span>Back to website</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
