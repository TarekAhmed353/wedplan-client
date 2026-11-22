import type { Metadata } from "next";
import { BanknoteIcon, CircleCheckIcon, HourglassIcon, LockIcon, ReceiptTextIcon } from "lucide-react";
import { FilterTabs, withParams } from "@/components/dashboard/filter-tabs";
import { PageHeader } from "@/components/dashboard/page-header";
import { Pager } from "@/components/dashboard/pager";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { formatMoney, type TransactionList, type TransactionStatus } from "@/lib/admin-types";
import { ApiError } from "@/lib/api-error";
import { formatRequestDate } from "@/lib/booking-format";
import { serverApiFetch } from "@/lib/server-api";

export const metadata: Metadata = {
  title: "Transactions",
};

const BASE = "/dashboard/admin/transactions";
const statuses: TransactionStatus[] = ["paid", "pending", "expired", "failed"];

const statusStyles: Record<TransactionStatus, string> = {
  paid: "bg-primary/10 text-primary",
  pending: "bg-gold/15 text-gold-foreground",
  expired: "bg-muted text-muted-foreground",
  failed: "bg-destructive/10 text-destructive",
};

export default async function TransactionsPage({
  searchParams,
}: PageProps<"/dashboard/admin/transactions">) {
  const params = await searchParams;
  const query = new URLSearchParams();

  if (typeof params.status === "string" && statuses.includes(params.status as TransactionStatus)) {
    query.set("status", params.status);
  }
  if (typeof params.page === "string") query.set("page", params.page);

  let data: TransactionList | null = null;
  let errorMessage: string | null = null;

  try {
    data = await serverApiFetch<TransactionList>(`/api/admin/transactions?${query}`);
  } catch (error) {
    errorMessage = error instanceof ApiError ? error.message : "Could not load transactions.";
  }

  const activeStatus = query.get("status");

  return (
    <>
      <PageHeader
        title="Transactions"
        description="Every Premium payment started by vendors, newest first."
      />

      {errorMessage && (
        <p className="rounded-2xl bg-destructive/10 p-5 text-sm text-destructive">{errorMessage}</p>
      )}

      {data && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <StatCard label="Money received" value={formatMoney(data.revenue, data.currency)} icon={BanknoteIcon} />
            <StatCard label="Paid payments" value={data.counts.paid} icon={CircleCheckIcon} />
            <StatCard
              label="Unfinished checkouts"
              value={data.counts.pending + data.counts.expired + data.counts.failed}
              icon={HourglassIcon}
            />
          </div>

          <div className="mb-6">
            <FilterTabs
              label="Filter by status"
              tabs={[null, ...statuses].map((value) => ({
                label: value ? value.charAt(0).toUpperCase() + value.slice(1) : "All",
                count: data.counts[value ?? "all"],
                active: activeStatus === value || (!activeStatus && value === null),
                href: withParams(BASE, new URLSearchParams(), { status: value }),
              }))}
            />
          </div>

          {data.transactions.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <ReceiptTextIcon className="size-8 text-muted-foreground" />
              <p className="font-heading text-xl font-semibold">No transactions yet</p>
              <p className="text-sm text-muted-foreground">
                Payments appear here when vendors start a Premium upgrade.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {data.transactions.map((transaction) => (
                <li
                  key={transaction._id}
                  className="grid gap-3 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-foreground/5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="font-medium">
                      {transaction.vendor?.businessName || transaction.vendor?.name || "Deleted vendor"}
                    </p>
                    {transaction.vendor?.email && (
                      <p className="truncate text-sm text-muted-foreground">{transaction.vendor.email}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {transaction.stripeInvoiceId ? "Monthly renewal" : "Premium upgrade"} ·{" "}
                      {formatRequestDate(transaction.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 sm:justify-end">
                    <span className="text-sm capitalize text-muted-foreground">{transaction.plan}</span>
                    <span className="font-heading text-lg font-semibold">
                      {formatMoney(transaction.amount, transaction.currency)}
                    </span>
                    <Badge className={`rounded-full border-0 px-2.5 capitalize ${statusStyles[transaction.status]}`}>
                      {transaction.status}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <Pager
            page={data.page}
            totalPages={data.totalPages}
            hrefFor={(page) => withParams(BASE, query, { page: String(page) })}
          />

          <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <LockIcon className="size-3.5" />
            Payment status comes from Stripe and cannot be changed here.
          </p>
        </>
      )}
    </>
  );
}
