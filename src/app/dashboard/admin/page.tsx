import type { Metadata } from "next";
import {
  ClipboardListIcon,
  HourglassIcon,
  ReceiptTextIcon,
  StoreIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ApiError } from "@/lib/api-error";
import { serverApiFetch } from "@/lib/server-api";

export const metadata: Metadata = {
  title: "Admin overview",
};

type AdminStats = {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalServices: number;
  pendingServices: number;
  totalTransactions: number;
};

export default async function AdminOverviewPage() {
  let stats: AdminStats | null = null;
  let errorMessage: string | null = null;

  try {
    stats = await serverApiFetch<AdminStats>("/api/admin/stats");
  } catch (error) {
    errorMessage =
      error instanceof ApiError ? error.message : "Could not load the numbers.";
  }

  return (
    <>
      <PageHeader
        title="Overview"
        description="A quick look at users, services and payments on WedPlan."
      />
      {stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Total users" value={stats.totalUsers} icon={UsersIcon} />
          <StatCard label="Vendors" value={stats.totalVendors} icon={StoreIcon} />
          <StatCard label="Customers" value={stats.totalCustomers} icon={UserIcon} />
          <StatCard
            label="Total services"
            value={stats.totalServices}
            icon={ClipboardListIcon}
          />
          <StatCard
            label="Pending services"
            value={stats.pendingServices}
            icon={HourglassIcon}
          />
          <StatCard
            label="Transactions"
            value={stats.totalTransactions}
            icon={ReceiptTextIcon}
          />
        </div>
      ) : (
        <p className="rounded-2xl bg-destructive/10 p-5 text-sm text-destructive">
          {errorMessage}
        </p>
      )}
    </>
  );
}
