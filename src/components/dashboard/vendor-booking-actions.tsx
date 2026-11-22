"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckIcon, Loader2Icon, XIcon } from "lucide-react";
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

type Decision = "accepted" | "rejected";

const copy: Record<Decision, { title: string; body: string; action: string; toast: string }> = {
  accepted: {
    title: "Accept this booking?",
    body: "The customer will see that you accepted. You cannot change this later.",
    action: "Accept booking",
    toast: "Booking accepted.",
  },
  rejected: {
    title: "Reject this booking?",
    body: "The customer will see that you said no. You cannot change this later.",
    action: "Reject booking",
    toast: "Booking rejected.",
  },
};

export function VendorBookingActions({ id, customerName }: { id: string; customerName: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<Decision | null>(null);

  async function respond(status: Decision) {
    setBusy(status);

    try {
      await apiFetch(`/api/bookings/${id}/respond`, { method: "PATCH", json: { status } });
      toast.success(copy[status].toast);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not update the booking.");
    } finally {
      setBusy(null);
      router.refresh();
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {(["accepted", "rejected"] as const).map((decision) => (
        <AlertDialog key={decision}>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant={decision === "accepted" ? "default" : "outline"}
              className="h-9 rounded-full px-4"
              disabled={busy !== null}
              aria-label={`${decision === "accepted" ? "Accept" : "Reject"} request from ${customerName}`}
            >
              {busy === decision ? (
                <Loader2Icon className="animate-spin" />
              ) : decision === "accepted" ? (
                <CheckIcon />
              ) : (
                <XIcon />
              )}
              {decision === "accepted" ? "Accept" : "Reject"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{copy[decision].title}</AlertDialogTitle>
              <AlertDialogDescription>
                Request from {customerName}. {copy[decision].body}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">Go back</AlertDialogCancel>
              <AlertDialogAction
                variant={decision === "accepted" ? "default" : "destructive"}
                className="rounded-full"
                onClick={() => respond(decision)}
              >
                {copy[decision].action}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </div>
  );
}
