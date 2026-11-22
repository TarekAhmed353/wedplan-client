import Image from "next/image";
import { MapPinIcon, TagIcon } from "lucide-react";
import { ServiceStatusBadge } from "@/components/dashboard/service-status-badge";
import { VendorServiceActions } from "@/components/dashboard/vendor-service-actions";
import { formatPrice } from "@/lib/format";
import type { Service } from "@/lib/services";

function visibilityNote(service: Service) {
  if (service.status === "rejected") {
    return "Hidden from customers. Edit it to send it for review again.";
  }

  if (service.status === "pending") {
    return "Waiting for an admin to approve it.";
  }

  return service.isAvailable
    ? "Live on WedPlan. Customers can see and book it."
    : "Hidden while it is switched off.";
}

export function VendorServiceCard({ service }: { service: Service }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-foreground/5">
      <div className="relative aspect-4/3 bg-muted">
        <Image
          src={service.images[0]}
          alt={service.serviceName}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute top-3 left-3 rounded-full bg-card shadow-sm">
          <ServiceStatusBadge status={service.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="space-y-1">
          <h2 className="line-clamp-1 text-xl font-semibold">{service.serviceName}</h2>
          <p className="font-heading text-lg font-semibold text-primary">
            {formatPrice(service.price)}
          </p>
        </div>

        <div className="space-y-1.5 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <TagIcon className="size-4 shrink-0" />
            {service.category}
          </p>
          <p className="flex items-center gap-2">
            <MapPinIcon className="size-4 shrink-0" />
            {service.location}
          </p>
        </div>

        <p className="line-clamp-2 text-sm">{service.description}</p>

        <p className="mt-auto rounded-xl bg-accent/50 px-3 py-2 text-xs text-primary">
          {visibilityNote(service)}
        </p>

        <VendorServiceActions
          id={service._id}
          name={service.serviceName}
          isAvailable={service.isAvailable}
        />
      </div>
    </article>
  );
}
