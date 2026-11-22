"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CrownIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { ApiError } from "@/lib/api-error";

export function UpgradeButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpgrade() {
    setIsLoading(true);

    try {
      const { url } = await apiFetch<{ url: string }>("/api/stripe/checkout", { method: "POST" });
      window.location.href = url;
    } catch (error) {
      setIsLoading(false);
      toast.error(error instanceof ApiError ? error.message : "Could not open the payment page.");
    }
  }

  return (
    <Button onClick={handleUpgrade} disabled={isLoading} className="h-11 w-full rounded-full text-base">
      {isLoading ? <Loader2Icon className="animate-spin" /> : <CrownIcon />}
      {isLoading ? "Opening Stripe..." : "Upgrade to Premium"}
    </Button>
  );
}

export function CancelPremiumButton({ endsOn }: { endsOn: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleCancel() {
    setIsLoading(true);

    try {
      await apiFetch("/api/stripe/cancel", { method: "POST" });
      toast.success(`Premium will end on ${endsOn}. You keep it until then.`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not cancel Premium.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="h-11 w-full rounded-full" disabled={isLoading}>
          {isLoading && <Loader2Icon className="animate-spin" />}
          Cancel Premium
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Premium?</AlertDialogTitle>
          <AlertDialogDescription>
            You keep Premium until {endsOn}. After that you go back to the Free
            plan, and only 3 services can stay switched on.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-full">Keep Premium</AlertDialogCancel>
          <AlertDialogAction variant="destructive" className="rounded-full" onClick={handleCancel}>
            Cancel Premium
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
