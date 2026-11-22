import Image from "next/image";
import Link from "next/link";
import { CrownIcon, MapPinIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import type { PublicService } from "@/lib/services";

export function ServiceCard({ service }: { service: PublicService }) {
  const vendorName = service.vendor.businessName || service.vendor.name;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-foreground/5 transition-shadow hover:shadow-md">
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <Image
          src={service.images[0]}
          alt={service.serviceName}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm">
          {service.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="space-y-1">
          <h3 className="line-clamp-1 text-xl font-semibold">{service.serviceName}</h3>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPinIcon className="size-4 shrink-0" />
            {service.location}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Avatar className="size-7">
            {service.vendor.image ? (
              <AvatarImage src={service.vendor.image} alt={vendorName} />
            ) : null}
            <AvatarFallback className="bg-accent text-xs text-primary">
              {vendorName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="min-w-0 truncate text-sm">{vendorName}</span>
          {service.vendor.isPremium && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-[0.7rem] font-medium text-gold-foreground">
              <CrownIcon className="size-3 text-gold" />
              Premium
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
          <p className="font-heading text-xl font-semibold text-primary">
            {formatPrice(service.price)}
          </p>
          <Button asChild size="sm" className="h-9 rounded-full px-4">
            <Link href={`/services/${service._id}`}>View details</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
