import type { Metadata } from "next";
import { CrownIcon, UserSearchIcon } from "lucide-react";
import { AdminUserActions } from "@/components/dashboard/admin-user-actions";
import { FilterTabs, withParams } from "@/components/dashboard/filter-tabs";
import { PageHeader } from "@/components/dashboard/page-header";
import { Pager } from "@/components/dashboard/pager";
import { SearchBox } from "@/components/dashboard/search-box";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { AdminUserList } from "@/lib/admin-types";
import { ApiError } from "@/lib/api-error";
import { formatRequestDate } from "@/lib/booking-format";
import { serverApiFetch } from "@/lib/server-api";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Manage users",
};

const BASE = "/dashboard/admin/users";
const allowedParams = ["search", "role", "status", "page"];

const roleTabs = [
  { value: null, label: "All", key: "all" },
  { value: "customer", label: "Customers", key: "customer" },
  { value: "vendor", label: "Vendors", key: "vendor" },
  { value: "admin", label: "Admins", key: "admin" },
] as const;

const statusTabs = [
  { value: null, label: "Any status" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
] as const;

export default async function ManageUsersPage({
  searchParams,
}: PageProps<"/dashboard/admin/users">) {
  const params = await searchParams;
  const query = new URLSearchParams();

  for (const key of allowedParams) {
    const value = params[key];
    if (typeof value === "string" && value) query.set(key, value);
  }

  const session = await getSession();
  let data: AdminUserList | null = null;
  let errorMessage: string | null = null;

  try {
    data = await serverApiFetch<AdminUserList>(`/api/admin/users?${query}`);
  } catch (error) {
    errorMessage = error instanceof ApiError ? error.message : "Could not load users.";
  }

  const activeRole = query.get("role");
  const activeStatus = query.get("status");

  return (
    <>
      <PageHeader
        title="Manage users"
        description="Find any customer, vendor or admin, see their details, and block or unblock accounts."
      />

      {errorMessage && (
        <p className="rounded-2xl bg-destructive/10 p-5 text-sm text-destructive">{errorMessage}</p>
      )}

      {data && (
        <>
          <div className="mb-6 space-y-3">
            <SearchBox placeholder="Search by name or email" label="Search users by name or email" />
            <FilterTabs
              label="Filter by role"
              tabs={roleTabs.map((tab) => ({
                label: tab.label,
                count: data.counts[tab.key],
                active: activeRole === tab.value || (!activeRole && tab.value === null),
                href: withParams(BASE, query, { role: tab.value }),
              }))}
            />
            <FilterTabs
              label="Filter by status"
              tabs={statusTabs.map((tab) => ({
                label: tab.label,
                active: activeStatus === tab.value || (!activeStatus && tab.value === null),
                href: withParams(BASE, query, { status: tab.value }),
              }))}
            />
          </div>

          {data.users.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <UserSearchIcon className="size-8 text-muted-foreground" />
              <p className="font-heading text-xl font-semibold">No users found</p>
              <p className="text-sm text-muted-foreground">Try another name, email or filter.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {data.users.map((user) => {
                const isSelf = user._id === session?.user.id;
                const canBlock = !isSelf && user.role !== "admin";
                return (
                  <li
                    key={user._id}
                    className="flex flex-col gap-4 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-foreground/5 md:flex-row md:items-center"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <Avatar className="size-11">
                        {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
                        <AvatarFallback className="bg-accent text-primary">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium">{user.name}</p>
                          {isSelf && <span className="text-xs text-muted-foreground">(you)</span>}
                          <Badge className="rounded-full border-0 bg-accent px-2.5 text-primary capitalize">
                            {user.role ?? "no role"}
                          </Badge>
                          {user.isPremium && (
                            <Badge className="gap-1 rounded-full border-0 bg-gold/15 px-2.5 text-gold-foreground dark:text-gold">
                              <CrownIcon className="size-3 text-gold" />
                              Premium
                            </Badge>
                          )}
                          <Badge
                            className={
                              user.isBlocked
                                ? "rounded-full border-0 bg-destructive/10 px-2.5 text-destructive"
                                : "rounded-full border-0 bg-muted px-2.5 text-muted-foreground"
                            }
                          >
                            {user.isBlocked ? "Blocked" : "Active"}
                          </Badge>
                        </div>
                        <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined {formatRequestDate(user.createdAt)}
                          {user.businessName ? ` · ${user.businessName}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="md:shrink-0">
                      <AdminUserActions user={user} canBlock={canBlock} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <Pager
            page={data.page}
            totalPages={data.totalPages}
            hrefFor={(page) => {
              const next = new URLSearchParams(query);
              next.set("page", String(page));
              return `${BASE}?${next}`;
            }}
          />
        </>
      )}
    </>
  );
}
