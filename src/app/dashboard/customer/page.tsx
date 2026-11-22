import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarCheckIcon,
  CalendarHeartIcon,
  CalendarXIcon,
  ClockIcon,
  SearchIcon,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-error";
import { serverApiFetch } from "@/lib/server-api";

export const metadata: Metadata = {
  title: "Customer overview",
};

type CustomerStats = {
  totalRequests: number;
  pending: number;
  accepted: number;
  rejected: number;
  cancelled: number;
};

export default async function CustomerOverviewPage() {
  let stats: CustomerStats | null = null;
  let errorMessage: string | null = null;

  try {
    stats = await serverApiFetch<CustomerStats>("/api/customer/stats");
  } catch (error) {
    errorMessage = error instanceof ApiError ? error.message : "Could not load your numbers.";
  }

  return (
    <>
      <PageHeader
        title="Overview"
        description="Your booking requests at a glance."
        action={
          <Button asChild className="h-11 rounded-full px-5">
            <Link href="/services">
              <SearchIcon />
              Browse services
            </Link>
          </Button>
        }
      />

      {errorMessage && (
        <p className="rounded-2xl bg-destructive/10 p-5 text-sm text-destructive">{errorMessage}</p>
      )}

      {stats && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total booking requests" value={stats.totalRequests} icon={CalendarHeartIcon} />
            <StatCard label="Pending" value={stats.pending} icon={ClockIcon} />
            <StatCard label="Accepted" value={stats.accepted} icon={CalendarCheckIcon} />
            <StatCard label="Rejected" value={stats.rejected} icon={CalendarXIcon} />
          </div>

          <div className="mt-8 rounded-2xl bg-card p-6 shadow-sm ring-1 ring-foreground/5">
            <h2 className="text-xl font-semibold">
              {stats.totalRequests === 0 ? "Start planning" : "Your requests"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {stats.totalRequests === 0
                ? "You have not sent any booking requests yet. Find a photographer, venue or caterer you love."
                : stats.pending > 0
                  ? `${stats.pending} request${stats.pending === 1 ? " is" : "s are"} waiting for a vendor to reply.`
                  : "No requests are waiting right now."}
            </p>
            <Button asChild variant="outline" className="mt-4 h-10 rounded-full">
              <Link href={stats.totalRequests === 0 ? "/services" : "/dashboard/customer/bookings"}>
                {stats.totalRequests === 0 ? "Browse services" : "See my bookings"}
              </Link>
            </Button>
          </div>
        </>
      )}
    </>
  );
}
