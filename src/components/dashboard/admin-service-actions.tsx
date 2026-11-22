"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckIcon, Loader2Icon, Trash2Icon, XIcon } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiFetch } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import type { ServiceStatus } from "@/lib/services";

const statusLabels: Record<ServiceStatus, string> = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
};

const successMessages: Record<ServiceStatus, string> = {
  pending: "Service moved back to pending.",
  approved: "Service approved. It is now visible if the vendor has it switched on.",
  rejected: "Service rejected. Customers can no longer see it.",
};

type AdminServiceActionsProps = {
  id: string;
  name: string;
  status: ServiceStatus;
};

export function AdminServiceActions({ id, name, status }: AdminServiceActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState<ServiceStatus | "delete" | null>(null);

  async function changeStatus(next: ServiceStatus) {
    if (next === status) return;
    setBusy(next);

    try {
      await apiFetch(`/api/admin/services/${id}/status`, {
        method: "PATCH",
        json: { status: next },
      });
      toast.success(successMessages[next]);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not change the status.");
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete() {
    setBusy("delete");

    try {
      await apiFetch(`/api/admin/services/${id}`, { method: "DELETE" });
      toast.success("Service deleted.");
      router.refresh();
    } catch (error) {
      setBusy(null);
      toast.error(error instanceof ApiError ? error.message : "Could not delete the service.");
    }
  }

  const disabled = busy !== null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === "pending" ? (
        <>
          <Button
            size="sm"
            className="h-9 rounded-full px-4"
            onClick={() => changeStatus("approved")}
            disabled={disabled}
          >
            {busy === "approved" ? <Loader2Icon className="animate-spin" /> : <CheckIcon />}
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-9 rounded-full px-4"
            onClick={() => changeStatus("rejected")}
            disabled={disabled}
          >
            {busy === "rejected" ? <Loader2Icon className="animate-spin" /> : <XIcon />}
            Reject
          </Button>
        </>
      ) : (
        <Select
          value={status}
          onValueChange={(value) => changeStatus(value as ServiceStatus)}
          disabled={disabled}
        >
          <SelectTrigger
            size="sm"
            aria-label={`Change status of ${name}`}
            className="w-40 rounded-full px-3 data-[size=sm]:h-9"
          >
            {busy ? <Loader2Icon className="animate-spin" /> : null}
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(statusLabels) as ServiceStatus[]).map((value) => (
              <SelectItem key={value} value={value}>
                {statusLabels[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            variant="destructive"
            className="h-9 rounded-full px-4"
            disabled={disabled}
            aria-label={`Delete ${name}`}
          >
            {busy === "delete" ? <Loader2Icon className="animate-spin" /> : <Trash2Icon />}
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this service?</AlertDialogTitle>
            <AlertDialogDescription>
              {name} will be removed for good. Use this for services that break
              the rules. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Keep it</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              className="rounded-full"
              onClick={handleDelete}
            >
              Delete service
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
