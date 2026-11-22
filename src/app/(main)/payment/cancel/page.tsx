import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CircleXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Payment cancelled",
};

export default async function PaymentCancelPage() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in?redirect=%2Fdashboard%2Fvendor%2Fsubscription");
  }

  if (session.user.role !== "vendor") {
    redirect("/dashboard");
  }

  return (
    <section className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg space-y-5 rounded-3xl bg-card p-8 text-center shadow-sm ring-1 ring-foreground/5 sm:p-10">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent text-primary">
          <CircleXIcon className="size-7" />
        </span>
        <h1 className="text-3xl font-semibold sm:text-4xl">Payment cancelled</h1>
        <p className="text-muted-foreground">
          You left the payment page, so you were not charged. You are still on the
          Free plan and can upgrade any time.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild className="h-11 rounded-full px-6">
            <Link href="/dashboard/vendor/subscription">Back to subscription</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-full px-6">
            <Link href="/dashboard/vendor">Go to dashboard</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
