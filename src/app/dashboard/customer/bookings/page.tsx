import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDaysIcon, CalendarHeartIcon, ImageOffIcon, MapPinIcon } from "lucide-react";
import { BookingStatusBadge } from "@/components/dashboard/booking-status-badge";
import { BookingTabs } from "@/components/dashboard/booking-tabs";
import { CustomerBookingActions } from "@/components/dashboard/customer-booking-actions";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-error";
import { formatEventDate, formatRequestDate } from "@/lib/booking-format";
import type { BookingCounts, CustomerBooking } from "@/lib/booking-types";
import { serverApiFetch } from "@/lib/server-api";

export const metadata: Metadata = {
  title: "My bookings",
};

const statuses = ["pending", "accepted", "rejected", "cancelled"];

export default async function MyBookingsPage({
  searchParams,
}: PageProps<"/dashboard/customer/bookings">) {
  const { status: statusParam } = await searchParams;
  const status = typeof statusParam === "string" && statuses.includes(statusParam) ? statusParam : "all";

  let bookings: CustomerBooking[] = [];
  let counts: BookingCounts | null = null;
  let errorMessage: string | null = null;

  try {
    const data = await serverApiFetch<{ bookings: CustomerBooking[]; counts: BookingCounts }>(
      `/api/customer/bookings${status === "all" ? "" : `?status=${status}`}`,
    );
    bookings = data.bookings;
    counts = data.counts;
  } catch (error) {
    errorMessage = error instanceof ApiError ? error.message : "Could not load your bookings.";
  }

  return (
    <>
      <PageHeader
        title="My bookings"
        description="Every booking request you have sent, and what the vendor said."
      />

      {errorMessage && (
        <p className="rounded-2xl bg-destructive/10 p-5 text-sm text-destructive">{errorMessage}</p>
      )}

      {counts && (
        <BookingTabs basePath="/dashboard/customer/bookings" active={status} counts={counts} />
      )}

      {!errorMessage && bookings.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-accent text-primary">
            <CalendarHeartIcon className="size-6" />
          </span>
          <h2 className="text-2xl font-semibold">
            {status === "all" ? "No booking requests yet" : `No ${status} bookings`}
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Find a service you love and send a booking request. It will show up here.
          </p>
          <Button asChild className="h-11 rounded-full px-6">
            <Link href="/services">Browse services</Link>
          </Button>
        </div>
      )}

      {bookings.length > 0 && (
        <ul className="space-y-4">
          {bookings.map((booking) => {
            const vendorName =
              booking.vendor?.businessName || booking.vendor?.name || "Unknown vendor";
            return (
              <li
                key={booking._id}
                className="flex flex-col gap-4 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-foreground/5 md:flex-row md:items-center"
              >
                <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-xl bg-muted md:w-40">
                  {booking.service?.images[0] ? (
                    <Image
                      src={booking.service.images[0]}
                      alt={booking.service.serviceName}
                      fill
                      sizes="(min-width: 768px) 160px, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                      <ImageOffIcon className="size-6" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">
                      {booking.service?.serviceName ?? "This service was removed"}
                    </h2>
                    <BookingStatusBadge status={booking.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">by {vendorName}</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
                    <span className="flex items-center gap-1.5">
                      <CalendarDaysIcon className="size-4 text-gold" />
                      {formatEventDate(booking.eventDate)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPinIcon className="size-4 text-gold" />
                      {booking.eventLocation}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Requested on {formatRequestDate(booking.createdAt)}
                  </p>
                </div>

                <div className="md:shrink-0">
                  <CustomerBookingActions booking={booking} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
