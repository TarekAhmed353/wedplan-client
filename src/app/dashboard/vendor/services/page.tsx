import type { Metadata } from "next";
import Link from "next/link";
import { PlusIcon, StoreIcon } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { VendorServiceCard } from "@/components/dashboard/vendor-service-card";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-error";
import { serverApiFetch } from "@/lib/server-api";
import type { PlanSummary, Service } from "@/lib/services";

export const metadata: Metadata = {
  title: "My services",
};

export default async function MyServicesPage() {
  let services: Service[] = [];
  let plan: PlanSummary | null = null;
  let errorMessage: string | null = null;

  try {
    const [list, summary] = await Promise.all([
      serverApiFetch<{ services: Service[] }>("/api/vendor/services"),
      serverApiFetch<PlanSummary>("/api/vendor/plan"),
    ]);
    services = list.services;
    plan = summary;
  } catch (error) {
    errorMessage =
      error instanceof ApiError ? error.message : "Could not load your services.";
  }

  return (
    <>
      <PageHeader
        title="My services"
        description="Everything you have listed, with its review status. Switch a service off to hide it without deleting it."
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
        <p className="rounded-2xl bg-destructive/10 p-5 text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      {plan && (
        <p className="mb-6 text-sm text-muted-foreground">
          {plan.plan === "premium"
            ? `Premium plan: ${plan.activeServices} active services, no limit.`
            : `Free plan: ${plan.activeServices} of ${plan.limit} active services used.`}
        </p>
      )}

      {!errorMessage && services.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-accent text-primary">
            <StoreIcon className="size-6" />
          </span>
          <h2 className="text-2xl font-semibold">No services yet</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Add your first service. Once an admin approves it, couples can find
            and book it.
          </p>
          <Button asChild className="h-11 rounded-full px-6">
            <Link href="/dashboard/vendor/services/new">Add your first service</Link>
          </Button>
        </div>
      )}

      {services.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <VendorServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}
    </>
  );
}
