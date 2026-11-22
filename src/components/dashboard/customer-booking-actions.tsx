"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeIcon, Loader2Icon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { BookingStatusBadge } from "@/components/dashboard/booking-status-badge";
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
import { apiFetch } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import { formatEventDate, formatRequestDate } from "@/lib/booking-format";
import type { CustomerBooking } from "@/lib/booking-types";
import { formatPrice } from "@/lib/format";

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-3 py-2 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  );
}

export function CustomerBookingActions({ booking }: { booking: CustomerBooking }) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);
  const serviceName = booking.service?.serviceName ?? "Removed service";
  const vendorName = booking.vendor?.businessName || booking.vendor?.name || "Unknown vendor";

  async function handleCancel() {
    setIsCancelling(true);

    try {
      await apiFetch(`/api/bookings/${booking._id}/cancel`, { method: "PATCH" });
      toast.success("Booking request cancelled.");
      router.refresh();
    } catch (error) {
      setIsCancelling(false);
      toast.error(error instanceof ApiError ? error.message : "Could not cancel the request.");
      router.refresh();
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 rounded-full px-4">
            <EyeIcon />
            View details
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">{serviceName}</DialogTitle>
            <DialogDescription>Your booking request</DialogDescription>
          </DialogHeader>
          <dl className="divide-y divide-border">
            <DetailRow label="Status">
              <BookingStatusBadge status={booking.status} />
            </DetailRow>
            <DetailRow label="Event date">{formatEventDate(booking.eventDate)}</DetailRow>
            <DetailRow label="Event location">{booking.eventLocation}</DetailRow>
            <DetailRow label="Your message">
              {booking.message ? (
                <span className="whitespace-pre-line">{booking.message}</span>
              ) : (
                <span className="text-muted-foreground">No message</span>
              )}
            </DetailRow>
            <DetailRow label="Vendor">
              {vendorName}
              {booking.vendor?.email && (
                <span className="block text-muted-foreground">{booking.vendor.email}</span>
              )}
            </DetailRow>
            {booking.service && (
              <>
                <DetailRow label="Category">{booking.service.category}</DetailRow>
                <DetailRow label="Price">{formatPrice(booking.service.price)}</DetailRow>
              </>
            )}
            <DetailRow label="Requested on">{formatRequestDate(booking.createdAt)}</DetailRow>
            {booking.cancelledAt && (
              <DetailRow label="Cancelled on">{formatRequestDate(booking.cancelledAt)}</DetailRow>
            )}
          </dl>
        </DialogContent>
      </Dialog>

      {booking.status === "pending" && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="h-9 rounded-full px-4"
              disabled={isCancelling}
            >
              {isCancelling ? <Loader2Icon className="animate-spin" /> : <XIcon />}
              Cancel request
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel this booking request?</AlertDialogTitle>
              <AlertDialogDescription>
                {vendorName} will see that you cancelled your request for{" "}
                {formatEventDate(booking.eventDate)}. You can send a new request later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">Keep request</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                className="rounded-full"
                onClick={handleCancel}
              >
                Cancel request
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
