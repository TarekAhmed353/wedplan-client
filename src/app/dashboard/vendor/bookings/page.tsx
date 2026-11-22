import type { Metadata } from "next";
import { CalendarDaysIcon, InboxIcon, MailIcon, MapPinIcon, MessageSquareIcon } from "lucide-react";
import { BookingStatusBadge } from "@/components/dashboard/booking-status-badge";
import { BookingTabs } from "@/components/dashboard/booking-tabs";
import { PageHeader } from "@/components/dashboard/page-header";
import { VendorBookingActions } from "@/components/dashboard/vendor-booking-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ApiError } from "@/lib/api-error";
import { formatEventDate, formatRequestDate } from "@/lib/booking-format";
import type { BookingCounts, VendorBooking } from "@/lib/booking-types";
import { serverApiFetch } from "@/lib/server-api";

export const metadata: Metadata = {
  title: "Booking requests",
};

const statuses = ["pending", "accepted", "rejected", "cancelled"];

const closedNotes: Record<string, string> = {
  accepted: "You accepted this request",
  rejected: "You rejected this request",
  cancelled: "The customer cancelled this request",
};

export default async function BookingRequestsPage({
  searchParams,
}: PageProps<"/dashboard/vendor/bookings">) {
  const { status: statusParam } = await searchParams;
  const status = typeof statusParam === "string" && statuses.includes(statusParam) ? statusParam : "all";

  let bookings: (VendorBooking & { respondedAt?: string })[] = [];
  let counts: BookingCounts | null = null;
  let errorMessage: string | null = null;

  try {
    const data = await serverApiFetch<{ bookings: VendorBooking[]; counts: BookingCounts }>(
      `/api/vendor/bookings${status === "all" ? "" : `?status=${status}`}`,
    );
    bookings = data.bookings;
    counts = data.counts;
  } catch (error) {
    errorMessage = error instanceof ApiError ? error.message : "Could not load booking requests.";
  }

  return (
    <>
      <PageHeader
        title="Booking requests"
        description="Requests from couples for your services. Accept or reject each pending request once."
      />

      {errorMessage && (
        <p className="rounded-2xl bg-destructive/10 p-5 text-sm text-destructive">{errorMessage}</p>
      )}

      {counts && <BookingTabs basePath="/dashboard/vendor/bookings" active={status} counts={counts} />}

      {!errorMessage && bookings.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-accent text-primary">
            <InboxIcon className="size-6" />
          </span>
          <h2 className="text-2xl font-semibold">
            {status === "all" ? "No booking requests yet" : `No ${status} requests`}
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            When couples request one of your approved services, it shows up here.
          </p>
        </div>
      )}

      {bookings.length > 0 && (
        <ul className="space-y-4">
          {bookings.map((booking) => {
            const customerName = booking.customer?.name ?? "Deleted account";
            return (
              <li key={booking._id} className="space-y-4 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-foreground/5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-11">
                      {booking.customer?.image ? (
                        <AvatarImage src={booking.customer.image} alt={customerName} />
                      ) : null}
                      <AvatarFallback className="bg-accent text-primary">
                        {customerName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium">{customerName}</p>
                      {booking.customer?.email && (
                        <a
                          href={`mailto:${booking.customer.email}`}
                          className="flex items-center gap-1 truncate text-sm text-muted-foreground hover:text-primary"
                        >
                          <MailIcon className="size-3.5 shrink-0" />
                          {booking.customer.email}
                        </a>
                      )}
                    </div>
                  </div>
                  <BookingStatusBadge status={booking.status} />
                </div>

                <div className="grid gap-3 rounded-xl bg-secondary/50 p-4 text-sm sm:grid-cols-2">
                  <p>
                    <span className="block text-xs text-muted-foreground">Service</span>
                    {booking.service?.serviceName ?? "This service was removed"}
                  </p>
                  <p className="flex items-start gap-1.5">
                    <CalendarDaysIcon className="mt-0.5 size-4 shrink-0 text-gold" />
                    <span>
                      <span className="block text-xs text-muted-foreground">Event date</span>
                      {formatEventDate(booking.eventDate)}
                    </span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <MapPinIcon className="mt-0.5 size-4 shrink-0 text-gold" />
                    <span>
                      <span className="block text-xs text-muted-foreground">Event location</span>
                      {booking.eventLocation}
                    </span>
                  </p>
                  <p>
                    <span className="block text-xs text-muted-foreground">Requested on</span>
                    {formatRequestDate(booking.createdAt)}
                  </p>
                </div>

                {booking.message && (
                  <p className="flex items-start gap-2 text-sm">
                    <MessageSquareIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <span className="whitespace-pre-line">{booking.message}</span>
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  {booking.status === "pending" ? (
                    <>
                      <p className="text-sm text-muted-foreground">Waiting for your answer</p>
                      <VendorBookingActions id={booking._id} customerName={customerName} />
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {closedNotes[booking.status]}
                      {booking.respondedAt ? ` on ${formatRequestDate(booking.respondedAt)}` : ""}
                      {booking.status === "cancelled" && booking.cancelledAt
                        ? ` on ${formatRequestDate(booking.cancelledAt)}`
                        : ""}
                      .
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
