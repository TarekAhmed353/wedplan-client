import type { Metadata } from "next";
import { CheckIcon, CrownIcon } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { CancelPremiumButton, UpgradeButton } from "@/components/dashboard/subscription-actions";
import { ApiError } from "@/lib/api-error";
import { serverApiFetch } from "@/lib/server-api";
import type { PlanSummary } from "@/lib/services";
import { formatLongDate, PLANS } from "@/lib/subscription";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Subscription",
};

export default async function SubscriptionPage() {
  let plan: PlanSummary | null = null;
  let errorMessage: string | null = null;

  try {
    plan = await serverApiFetch<PlanSummary>("/api/vendor/plan");
  } catch (error) {
    errorMessage = error instanceof ApiError ? error.message : "Could not load your plan.";
  }

  const isPremium = plan?.plan === "premium";
  const endsOn = plan?.subscriptionExpiresAt ? formatLongDate(plan.subscriptionExpiresAt) : null;

  return (
    <>
      <PageHeader
        title="Subscription"
        description="Stay on Free with up to 3 active services, or go Premium for unlimited services and a Premium badge."
      />

      {errorMessage && (
        <p className="rounded-2xl bg-destructive/10 p-5 text-sm text-destructive">{errorMessage}</p>
      )}

      {plan && (
        <>
          <div className="mb-8 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-foreground/5">
            <p className="text-sm text-muted-foreground">Your current plan</p>
            <p className="flex items-center gap-2 font-heading text-2xl font-semibold">
              {isPremium && <CrownIcon className="size-5 text-gold" />}
              {isPremium ? "Premium" : "Free"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {isPremium
                ? plan.cancelAtPeriodEnd
                  ? `Cancelled. Premium stays active until ${endsOn}.`
                  : `Renews automatically on ${endsOn}.`
                : `${plan.activeServices} of ${plan.limit} active services used.`}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {PLANS.map((item) => {
              const current = item.id === plan.plan;
              const premiumCard = item.id === "premium";
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex flex-col gap-6 rounded-3xl bg-card p-6 shadow-sm ring-1 sm:p-8",
                    premiumCard ? "ring-2 ring-gold" : "ring-foreground/5",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="flex items-center gap-2 font-heading text-2xl font-semibold">
                        {premiumCard && <CrownIcon className="size-5 text-gold" />}
                        {item.name}
                      </p>
                      <p className="mt-2">
                        <span className="font-heading text-4xl font-semibold text-primary">
                          {item.price}
                        </span>{" "}
                        <span className="text-sm text-muted-foreground">{item.period}</span>
                      </p>
                    </div>
                    {current && (
                      <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-primary">
                        Current plan
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <span className="flex size-5 items-center justify-center rounded-full bg-accent text-primary">
                          <CheckIcon className="size-3" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    {premiumCard && !isPremium && <UpgradeButton />}
                    {premiumCard && isPremium && !plan.cancelAtPeriodEnd && endsOn && (
                      <CancelPremiumButton endsOn={endsOn} />
                    )}
                    {premiumCard && isPremium && plan.cancelAtPeriodEnd && (
                      <p className="text-center text-sm text-muted-foreground">
                        Premium ends on {endsOn}.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Payments are handled by Stripe in test mode. Use the test card 4242 4242 4242 4242
            with any future date and any CVC.
          </p>
        </>
      )}
    </>
  );
}
