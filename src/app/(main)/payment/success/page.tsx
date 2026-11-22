import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PaymentConfirmation } from "@/components/payment/payment-confirmation";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Payment success",
};

export default async function PaymentSuccessPage({
  searchParams,
}: PageProps<"/payment/success">) {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in?redirect=%2Fdashboard%2Fvendor%2Fsubscription");
  }

  if (session.user.role !== "vendor") {
    redirect("/dashboard");
  }

  const { session_id: sessionId } = await searchParams;

  return (
    <section className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg space-y-5 rounded-3xl bg-card p-8 text-center shadow-sm ring-1 ring-foreground/5 sm:p-10">
        {typeof sessionId === "string" && sessionId.startsWith("cs_") ? (
          <PaymentConfirmation sessionId={sessionId} />
        ) : (
          <>
            <h1 className="text-3xl font-semibold">No payment to show</h1>
            <p className="text-muted-foreground">
              This page opens after a Stripe payment. Start from your subscription page.
            </p>
            <Button asChild className="h-11 rounded-full px-6">
              <Link href="/dashboard/vendor/subscription">Go to subscription</Link>
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
