"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BanIcon, EyeIcon, Loader2Icon, ShieldCheckIcon } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { AdminUser, AdminUserDetails } from "@/lib/admin-types";
import { apiFetch } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import { formatRequestDate } from "@/lib/booking-format";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[9rem_1fr] gap-3 py-2 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  );
}

function UserDetailsDialog({ user }: { user: AdminUser }) {
  const [details, setDetails] = useState<AdminUserDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load(open: boolean) {
    if (!open || details) return;

    try {
      setDetails(await apiFetch<AdminUserDetails>(`/api/admin/users/${user._id}`));
    } catch (loadError) {
      setError(loadError instanceof ApiError ? loadError.message : "Could not load details.");
    }
  }

  return (
    <Dialog onOpenChange={load}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 rounded-full px-4">
          <EyeIcon />
          View details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">{user.name}</DialogTitle>
          <DialogDescription>{user.email}</DialogDescription>
        </DialogHeader>
        <dl className="divide-y divide-border">
          <Row label="Role">{user.role ?? "Not set"}</Row>
          <Row label="Status">{user.isBlocked ? "Blocked" : "Active"}</Row>
          {user.role === "vendor" && (
            <>
              <Row label="Business name">{user.businessName || "Not given"}</Row>
              <Row label="Plan">{user.isPremium ? "Premium" : "Free"}</Row>
            </>
          )}
          {user.roleChosen === false && <Row label="Role choice">Not chosen yet (Google sign up)</Row>}
          <Row label="Joined">{formatRequestDate(user.createdAt)}</Row>
          {details ? (
            <>
              {user.role === "vendor" && (
                <>
                  <Row label="Services">{details.stats.services}</Row>
                  <Row label="Requests received">{details.stats.bookingsReceived}</Row>
                  <Row label="Payments">{details.stats.payments}</Row>
                </>
              )}
              {user.role === "customer" && <Row label="Requests sent">{details.stats.bookingsSent}</Row>}
            </>
          ) : (
            <p className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
              {error ?? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Loading activity...
                </>
              )}
            </p>
          )}
        </dl>
      </DialogContent>
    </Dialog>
  );
}

export function AdminUserActions({ user, canBlock }: { user: AdminUser; canBlock: boolean }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const nextBlocked = !user.isBlocked;

  async function toggleBlock() {
    setIsSaving(true);

    try {
      await apiFetch(`/api/admin/users/${user._id}/block`, {
        method: "PATCH",
        json: { isBlocked: nextBlocked },
      });
      toast.success(nextBlocked ? `${user.name} is blocked and signed out.` : `${user.name} is unblocked.`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not update the user.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <UserDetailsDialog user={user} />

      {canBlock && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant={nextBlocked ? "destructive" : "outline"}
              className="h-9 rounded-full px-4"
              disabled={isSaving}
              aria-label={`${nextBlocked ? "Block" : "Unblock"} ${user.name}`}
            >
              {isSaving ? (
                <Loader2Icon className="animate-spin" />
              ) : nextBlocked ? (
                <BanIcon />
              ) : (
                <ShieldCheckIcon />
              )}
              {nextBlocked ? "Block" : "Unblock"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {nextBlocked ? `Block ${user.name}?` : `Unblock ${user.name}?`}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {nextBlocked
                  ? "They will be signed out straight away and cannot sign in, book, or use their dashboard until you unblock them."
                  : "They will be able to sign in and use WedPlan again."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">Go back</AlertDialogCancel>
              <AlertDialogAction
                variant={nextBlocked ? "destructive" : "default"}
                className="rounded-full"
                onClick={toggleBlock}
              >
                {nextBlocked ? "Block user" : "Unblock user"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
