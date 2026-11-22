"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2Icon, PencilIcon, Trash2Icon } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { apiFetch } from "@/lib/api";
import { ApiError } from "@/lib/api-error";

type VendorServiceActionsProps = {
  id: string;
  name: string;
  isAvailable: boolean;
};

export function VendorServiceActions({
  id,
  name,
  isAvailable,
}: VendorServiceActionsProps) {
  const router = useRouter();
  const [available, setAvailable] = useState(isAvailable);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleToggle(next: boolean) {
    setIsToggling(true);
    setAvailable(next);

    try {
      await apiFetch(`/api/services/${id}/availability`, {
        method: "PATCH",
        json: { isAvailable: next },
      });
      toast.success(next ? "Service switched on." : "Service switched off.");
      router.refresh();
    } catch (error) {
      setAvailable(!next);
      toast.error(
        error instanceof ApiError ? error.message : "Could not update the service.",
      );
    } finally {
      setIsToggling(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);

    try {
      await apiFetch(`/api/services/${id}`, { method: "DELETE" });
      toast.success("Service deleted.");
      router.refresh();
    } catch (error) {
      setIsDeleting(false);
      toast.error(
        error instanceof ApiError ? error.message : "Could not delete the service.",
      );
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
      <label className="flex items-center gap-2 text-sm">
        <Switch
          checked={available}
          onCheckedChange={handleToggle}
          disabled={isToggling}
          aria-label={`Switch ${name} ${available ? "off" : "on"}`}
        />
        {available ? "On" : "Off"}
      </label>

      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm" className="h-9 rounded-full px-4">
          <Link href={`/dashboard/vendor/services/${id}/edit`}>
            <PencilIcon />
            Edit
          </Link>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="h-9 rounded-full px-4"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2Icon className="animate-spin" /> : <Trash2Icon />}
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this service?</AlertDialogTitle>
              <AlertDialogDescription>
                {name} will be removed from WedPlan for good. This cannot be undone.
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
    </div>
  );
}
