import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { requireDashboardUser } from "@/lib/dashboard-auth";

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const user = await requireDashboardUser();
  const navUser = { name: user.name, email: user.email, image: user.image };

  return (
    <TooltipProvider>
      <SidebarProvider>
        <DashboardSidebar role={user.role} />
        <SidebarInset>
          <DashboardHeader role={user.role} user={navUser} />
          <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-8 md:py-10">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
