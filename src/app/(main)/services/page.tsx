import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, SearchXIcon } from "lucide-react";
import { BrowseHeader } from "@/components/services/browse-header";
import { ServiceCard } from "@/components/services/service-card";
import { ServiceFilters } from "@/components/services/service-filters";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-error";
import { publicApiFetch } from "@/lib/public-api";
import type { PublicServiceList } from "@/lib/services";

export const metadata: Metadata = {
  title: "Browse services",
  description:
    "Browse approved wedding photographers, venues, decorators, caterers, stylists and fashion designers on WedPlan.",
};

const allowedParams = ["search", "category", "location", "sort", "page"];

export default async function BrowseServicesPage({
  searchParams,
}: PageProps<"/services">) {
  const params = await searchParams;
  const query = new URLSearchParams();

  for (const key of allowedParams) {
    const value = params[key];
    if (typeof value === "string" && value) query.set(key, value);
  }

  let data: PublicServiceList | null = null;
  let locations: string[] = [];
  let errorMessage: string | null = null;

  try {
    const [list, locationData] = await Promise.all([
      publicApiFetch<PublicServiceList>(`/api/services?${query}`),
      publicApiFetch<{ locations: string[] }>("/api/services/locations"),
    ]);
    data = list;
    locations = locationData.locations;
  } catch (error) {
    errorMessage =
      error instanceof ApiError ? error.message : "Could not load services.";
  }

  function pageHref(page: number) {
    const next = new URLSearchParams(query);
    next.set("page", String(page));
    return `/services?${next}`;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <BrowseHeader />
      <ServiceFilters locations={locations} />

      {errorMessage && (
        <p className="mt-8 rounded-2xl bg-destructive/10 p-5 text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      {data && (
        <>
          <p className="mt-8 mb-4 text-sm text-muted-foreground">
            {data.total === 1 ? "1 service found" : `${data.total} services found`}
          </p>

          {data.services.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-accent text-primary">
                <SearchXIcon className="size-6" />
              </span>
              <p className="font-heading text-2xl font-semibold">No services match</p>
              <p className="max-w-md text-sm text-muted-foreground">
                Try a different word, or clear the filters to see everything.
              </p>
              <Button asChild variant="outline" className="h-11 rounded-full px-6">
                <Link href="/services">Clear filters</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}

          {data.totalPages > 1 && (
            <nav aria-label="Pages" className="mt-10 flex items-center justify-between gap-3">
              {data.page > 1 ? (
                <Button asChild variant="outline" className="h-11 rounded-full">
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
                <Button asChild variant="outline" className="h-11 rounded-full">
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
    </section>
  );
}
