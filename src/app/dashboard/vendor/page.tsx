import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarCheckIcon,
  CrownIcon,
  InboxIcon,
  PlusIcon,
  StoreIcon,
  ToggleRightIcon,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-error";
import { serverApiFetch } from "@/lib/server-api";
import { formatLongDate } from "@/lib/subscription";

export const metadata: Metadata = {
  title: "Vendor overview",
};

type VendorStats = {
  totalServices: number;
  activeServices: number;
  pendingRequests: number;
  acceptedBookings: number;
  plan: "free" | "premium";
  limit: number | null;
  subscriptionExpiresAt: string | null;
};

export default async function VendorOverviewPage() {
  let stats: VendorStats | null = null;
  let errorMessage: string | null = null;

  try {
    stats = await serverApiFetch<VendorStats>("/api/vendor/stats");
  } catch (error) {
    errorMessage = error instanceof ApiError ? error.message : "Could not load your numbers.";
  }

  return (
    <>
      <PageHeader
        title="Overview"
        description="Your services, booking requests and plan at a glance."
        action={
          <Button asChild className="h-11 rounded-full px-5">
            <Link href="/dashboard/vendor/services/new">
              <PlusIcon />
              Add service
            </Link>
          </Button>
        }
      />

      {errorMessage && (
        <p className="rounded-2xl bg-destructive/10 p-5 text-sm text-destructive">{errorMessage}</p>
      )}

      {stats && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="Total services" value={stats.totalServices} icon={StoreIcon} />
            <StatCard
              label={stats.limit ? `Active services (limit ${stats.limit})` : "Active services"}
              value={stats.activeServices}
              icon={ToggleRightIcon}
            />
            <StatCard label="Pending booking requests" value={stats.pendingRequests} icon={InboxIcon} />
            <StatCard label="Accepted bookings" value={stats.acceptedBookings} icon={CalendarCheckIcon} />
            <StatCard
              label="Current plan"
              value={stats.plan === "premium" ? "Premium" : "Free"}
              icon={CrownIcon}
            />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-foreground/5">
              <h2 className="text-xl font-semibold">Booking requests</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {stats.pendingRequests === 0
                  ? "No requests are waiting for you right now."
                  : `${stats.pendingRequests} request${stats.pendingRequests === 1 ? " is" : "s are"} waiting for your answer.`}
              </p>
              <Button asChild variant="outline" className="mt-4 h-10 rounded-full">
                <Link href="/dashboard/vendor/bookings?status=pending">See requests</Link>
              </Button>
            </div>
            <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-foreground/5">
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <CrownIcon className="size-5 text-gold" />
                {stats.plan === "premium" ? "Premium plan" : "Free plan"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {stats.plan === "premium"
                  ? `Unlimited services${stats.subscriptionExpiresAt ? ` until ${formatLongDate(stats.subscriptionExpiresAt)}` : ""}.`
                  : `${stats.activeServices} of ${stats.limit} active services used. Go Premium for unlimited services.`}
              </p>
              <Button asChild variant="outline" className="mt-4 h-10 rounded-full">
                <Link href="/dashboard/vendor/subscription">
                  {stats.plan === "premium" ? "Manage plan" : "See Premium"}
                </Link>
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
