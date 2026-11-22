import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cache } from "react";
import {
  ArrowLeftIcon,
  CalendarHeartIcon,
  CrownIcon,
  InfoIcon,
  MapPinIcon,
  SearchXIcon,
  TagIcon,
} from "lucide-react";
import { BookingForm } from "@/components/services/booking-form";
import { ServiceGallery } from "@/components/services/service-gallery";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-error";
import { formatPrice } from "@/lib/format";
import { serverApiFetch } from "@/lib/server-api";
import type { ServiceDetail } from "@/lib/services";
import { getSession } from "@/lib/session";

const getService = cache(async (id: string) => {
  try {
    const { service } = await serverApiFetch<{ service: ServiceDetail }>(
      `/api/services/${encodeURIComponent(id)}`,
    );
    return { service, error: null };
  } catch (error) {
    if (error instanceof ApiError) {
      return { service: null, error };
    }
    throw error;
  }
});

export async function generateMetadata({
  params,
}: PageProps<"/services/[id]">): Promise<Metadata> {
  const { id } = await params;
  const { service } = await getService(id);
  return { title: service ? service.serviceName : "Service not available" };
}

function BookingNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-accent/60 px-4 py-3 text-sm text-primary">
      <InfoIcon className="mt-0.5 size-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export default async function ServiceDetailsPage({
  params,
}: PageProps<"/services/[id]">) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    redirect(`/sign-in?redirect=${encodeURIComponent(`/services/${id}`)}`);
  }

  if (session.user.isBlocked) {
    redirect("/account-blocked");
  }

  const { service, error } = await getService(id);

  if (error?.code === "ACCOUNT_BLOCKED") {
    redirect("/account-blocked");
  }

  if (!service) {
    return (
      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-accent text-primary">
          <SearchXIcon className="size-7" />
        </span>
        <h1 className="text-3xl font-semibold sm:text-4xl">This service is not available</h1>
        <p className="max-w-md text-muted-foreground">
          {error && error.status !== 404
            ? error.message
            : "The link may be wrong, or the vendor has removed or paused this service."}
        </p>
        <Button asChild className="h-11 rounded-full px-6">
          <Link href="/services">Browse other services</Link>
        </Button>
      </section>
    );
  }

  const user = session.user;
  const vendorName = service.vendor.businessName || service.vendor.name;
  const isOwnService = service.vendor._id === user.id;

  let bookingArea: React.ReactNode;

  if (user.roleChosen === false) {
    bookingArea = (
      <BookingNote>
        Choose how you use WedPlan before booking.{" "}
        <Link href="/choose-role" className="font-medium underline underline-offset-4">
          Choose your role
        </Link>
      </BookingNote>
    );
  } else if (user.role === "customer") {
    bookingArea = <BookingForm serviceId={service._id} />;
  } else if (isOwnService) {
    bookingArea = (
      <BookingNote>
        This is your service. You can change it from{" "}
        <Link
          href="/dashboard/vendor/services"
          className="font-medium underline underline-offset-4"
        >
          My services
        </Link>
        .
      </BookingNote>
    );
  } else if (user.role === "vendor") {
    bookingArea = (
      <BookingNote>
        Vendor accounts cannot book services. Sign in with a customer account to
        send a booking request.
      </BookingNote>
    );
  } else {
    bookingArea = <BookingNote>Admin accounts cannot book services.</BookingNote>;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link
        href="/services"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
      >
        <ArrowLeftIcon className="size-4" />
        Back to all services
      </Link>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-8">
          <ServiceGallery images={service.images} name={service.serviceName} />

          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-primary">
              <TagIcon className="size-3.5" />
              {service.category}
            </span>
            <h1 className="text-4xl font-semibold sm:text-5xl">{service.serviceName}</h1>
            <p className="flex items-center gap-1.5 text-muted-foreground">
              <MapPinIcon className="size-4" />
              {service.location}
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">About this service</h2>
            <p className="leading-relaxed whitespace-pre-line text-foreground/90">
              {service.description}
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-foreground/5">
            <Avatar className="size-14">
              {service.vendor.image ? (
                <AvatarImage src={service.vendor.image} alt={vendorName} />
              ) : null}
              <AvatarFallback className="bg-accent text-lg text-primary">
                {vendorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-medium tracking-[0.2em] text-gold uppercase">
                Offered by
              </p>
              <p className="flex flex-wrap items-center gap-2 font-heading text-xl font-semibold">
                {vendorName}
                {service.vendor.isPremium && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 font-sans text-xs font-medium text-gold-foreground">
                    <CrownIcon className="size-3 text-gold" />
                    Premium vendor
                  </span>
                )}
              </p>
              {service.vendor.businessName && (
                <p className="text-sm text-muted-foreground">{service.vendor.name}</p>
              )}
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-5 rounded-3xl bg-card p-6 shadow-sm ring-1 ring-foreground/5">
            <div>
              <p className="text-sm text-muted-foreground">Starting price</p>
              <p className="font-heading text-4xl font-semibold text-primary">
                {formatPrice(service.price)}
              </p>
            </div>
            <div className="flex items-center gap-2 border-t border-border pt-5">
              <CalendarHeartIcon className="size-5 text-gold" />
              <h2 className="text-xl font-semibold">Request a booking</h2>
            </div>
            {bookingArea}
          </div>
        </aside>
      </div>
    </section>
  );
}
