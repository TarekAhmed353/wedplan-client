import type { Metadata } from "next";
import Link from "next/link";
import { CrownIcon, InfoIcon } from "lucide-react";
import { AddServiceForm } from "@/components/dashboard/add-service-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-error";
import { serverApiFetch } from "@/lib/server-api";
import type { PlanSummary } from "@/lib/services";

export const metadata: Metadata = {
  title: "Add service",
};

export default async function AddServicePage() {
  let plan: PlanSummary | null = null;
  let errorMessage: string | null = null;

  try {
    plan = await serverApiFetch<PlanSummary>("/api/vendor/plan");
  } catch (error) {
    errorMessage =
      error instanceof ApiError ? error.message : "Could not load your plan.";
  }

  return (
    <>
      <PageHeader
        title="Add service"
        description="List a new wedding service. An admin reviews it before customers can see it."
      />

      {!plan && (
        <p className="rounded-2xl bg-destructive/10 p-5 text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      {plan && !plan.canAddService && (
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-card px-6 py-14 text-center shadow-sm ring-1 ring-foreground/5">
          <span className="flex size-14 items-center justify-center rounded-full bg-gold/15 text-gold">
            <CrownIcon className="size-6" />
          </span>
          <h2 className="text-2xl font-semibold">You have reached the free limit</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            The free plan allows {plan.limit} active services. Upgrade to
            Premium to list as many services as you like, or switch one of
            your services off to free a slot.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild className="h-11 rounded-full px-6">
              <Link href="/dashboard/vendor/subscription">Upgrade to Premium</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-full px-6">
              <Link href="/dashboard/vendor/services">My services</Link>
            </Button>
          </div>
        </div>
      )}

      {plan?.canAddService && (
        <>
          <div className="mb-6 flex items-start gap-3 rounded-2xl bg-accent/60 px-4 py-3 text-sm text-primary">
            <InfoIcon className="mt-0.5 size-4 shrink-0" />
            {plan.plan === "premium" ? (
              <p>You are on Premium, so you can add as many services as you like.</p>
            ) : (
              <p>
                Free plan: {plan.activeServices} of {plan.limit} active services
                used.{" "}
                <Link
                  href="/dashboard/vendor/subscription"
                  className="font-medium underline underline-offset-4"
                >
                  Upgrade to Premium
                </Link>{" "}
                for unlimited services.
              </p>
            )}
          </div>
          <AddServiceForm />
        </>
      )}
    </>
  );
}
