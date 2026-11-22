import { redirect } from "next/navigation";
import { type DashboardRole, isDashboardRole } from "@/lib/dashboard";
import { getSession } from "@/lib/session";

export async function requireDashboardUser() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.isBlocked) {
    redirect("/account-blocked");
  }

  if (session.user.roleChosen === false) {
    redirect("/choose-role");
  }

  if (!isDashboardRole(session.user.role)) {
    redirect("/");
  }

  return { ...session.user, role: session.user.role };
}

export async function requireRole(role: DashboardRole) {
  const user = await requireDashboardUser();

  if (user.role !== role) {
    redirect(`/dashboard/${user.role}`);
  }

  return user;
}
