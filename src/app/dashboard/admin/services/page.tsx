import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, SearchXIcon } from "lucide-react";
import { AdminServiceActions } from "@/components/dashboard/admin-service-actions";
import { AdminServiceFilters } from "@/components/dashboard/admin-service-filters";
import { PageHeader } from "@/components/dashboard/page-header";
import { ServiceStatusBadge } from "@/components/dashboard/service-status-badge";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-error";
import { formatDate, formatPrice } from "@/lib/format";
import { serverApiFetch } from "@/lib/server-api";
import type { AdminServiceList } from "@/lib/services";

export const metadata: Metadata = {
  title: "Manage services",
};

const allowedParams = ["search", "status", "category", "page"];

export default async function ManageServicesPage({
  searchParams,
}: PageProps<"/dashboard/admin/services">) {
  const params = await searchParams;
  const query = new URLSearchParams();

  for (const key of allowedParams) {
    const value = params[key];
    if (typeof value === "string" && value) query.set(key, value);
  }

  let data: AdminServiceList | null = null;
  let errorMessage: string | null = null;

  try {
    data = await serverApiFetch<AdminServiceList>(`/api/admin/services?${query}`);
  } catch (error) {
    errorMessage =
      error instanceof ApiError ? error.message : "Could not load services.";
  }

  function pageHref(page: number) {
    const next = new URLSearchParams(query);
    next.set("page", String(page));
    return `/dashboard/admin/services?${next}`;
  }

  return (
    <>
      <PageHeader
        title="Manage services"
        description="Review new services, approve or reject them, and remove anything that breaks the rules."
      />

      {errorMessage && (
        <p className="rounded-2xl bg-destructive/10 p-5 text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      {data && (
        <>
          <AdminServiceFilters counts={data.counts} />

          {data.services.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <SearchXIcon className="size-8 text-muted-foreground" />
              <p className="font-heading text-xl font-semibold">No services found</p>
              <p className="text-sm text-muted-foreground">
                Try another search, category or status.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {data.services.map((service) => (
                <li
                  key={service._id}
                  className="flex flex-col gap-4 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-foreground/5 md:flex-row md:items-center"
                >
                  <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-xl bg-muted md:w-36">
                    <Image
                      src={service.images[0]}
                      alt={service.serviceName}
                      fill
                      sizes="(min-width: 768px) 144px, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold">{service.serviceName}</h2>
                      <ServiceStatusBadge status={service.status} />
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                        {service.isAvailable ? "On" : "Off"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {service.category} · {service.location} ·{" "}
                      <span className="font-medium text-primary">
                        {formatPrice(service.price)}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Vendor: </span>
                      {service.vendor ? (
                        <>
                          {service.vendor.businessName || service.vendor.name}
                          <span className="text-muted-foreground">
                            {" "}
                            ({service.vendor.email})
                          </span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Account removed</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Added {formatDate(service.createdAt)}
                    </p>
                  </div>

                  <div className="md:shrink-0">
                    <AdminServiceActions
                      id={service._id}
                      name={service.serviceName}
                      status={service.status}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}

          {data.totalPages > 1 && (
            <nav
              aria-label="Pages"
              className="mt-6 flex items-center justify-between gap-3"
            >
              {data.page > 1 ? (
                <Button asChild variant="outline" className="h-10 rounded-full">
                  <Link href={pageHref(data.page - 1)}>
                    <ChevronLeftIcon />
                    Previous
                  </Link>
                </Button>
              ) : (
                <span />
              )}
              <p className="text-sm text-muted-foreground">
                Page {data.page} of {data.totalPages}
              </p>
              {data.page < data.totalPages ? (
                <Button asChild variant="outline" className="h-10 rounded-full">
                  <Link href={pageHref(data.page + 1)}>
                    Next
                    <ChevronRightIcon />
                  </Link>
                </Button>
              ) : (
                <span />
              )}
            </nav>
          )}
        </>
      )}
    </>
  );
}
