"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CircleAlertIcon, CrownIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import { formatLongDate, type PaymentStatus } from "@/lib/subscription";

const MAX_TRIES = 20;

type View =
  | { kind: "checking" }
  | { kind: "paid"; data: PaymentStatus }
  | { kind: "closed"; status: string }
  | { kind: "not-found" }
  | { kind: "slow" };

export function PaymentConfirmation({ sessionId }: { sessionId: string }) {
  const [view, setView] = useState<View>({ kind: "checking" });

  useEffect(() => {
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let tries = 0;

    async function check() {
      try {
        const data = await apiFetch<PaymentStatus>(
          `/api/stripe/session/${encodeURIComponent(sessionId)}`,
        );
        if (stopped) return;

        if (data.status === "paid" && data.isPremium) {
          setView({ kind: "paid", data });
          return;
        }

        if (data.status === "expired" || data.status === "failed") {
          setView({ kind: "closed", status: data.status });
          return;
        }
      } catch (error) {
        if (stopped) return;
        if (error instanceof ApiError && error.status === 404) {
          setView({ kind: "not-found" });
          return;
        }
      }

      tries += 1;

      if (tries >= MAX_TRIES) {
        setView({ kind: "slow" });
        return;
      }

      timer = setTimeout(check, 2000);
    }

    check();

    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [sessionId]);

  if (view.kind === "paid") {
    return (
      <>
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-gold/15 text-gold">
          <CrownIcon className="size-7" />
        </span>
        <h1 className="text-3xl font-semibold sm:text-4xl">You are now Premium</h1>
        <p className="text-muted-foreground">
          We received your payment of ${view.data.amount.toFixed(2)}. You can now
          list unlimited services, and your Premium badge is live.
          {view.data.subscriptionExpiresAt &&
            ` Your plan renews on ${formatLongDate(view.data.subscriptionExpiresAt)}.`}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild className="h-11 rounded-full px-6">
            <Link href="/dashboard/vendor/services/new">Add a service</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-full px-6">
            <Link href="/dashboard/vendor/subscription">View subscription</Link>
          </Button>
        </div>
      </>
    );
  }

  if (view.kind === "checking") {
    return (
      <>
        <Loader2Icon className="mx-auto size-10 animate-spin text-primary" />
        <h1 className="text-3xl font-semibold sm:text-4xl">Confirming your payment</h1>
        <p className="text-muted-foreground">
          Stripe is telling us about your payment. This usually takes a few seconds.
        </p>
      </>
    );
  }

  const messages = {
    closed: "This payment was not completed, so you were not charged.",
    "not-found": "We could not find this payment on your account.",
    slow: "Your payment is still being confirmed. Check your subscription page again in a minute.",
  } as const;

  return (
    <>
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent text-primary">
        <CircleAlertIcon className="size-7" />
      </span>
      <h1 className="text-3xl font-semibold sm:text-4xl">
        {view.kind === "slow" ? "Almost there" : "Payment not confirmed"}
      </h1>
      <p className="text-muted-foreground">{messages[view.kind]}</p>
      <Button asChild className="h-11 rounded-full px-6">
        <Link href="/dashboard/vendor/subscription">Go to subscription</Link>
      </Button>
    </>
  );
}
