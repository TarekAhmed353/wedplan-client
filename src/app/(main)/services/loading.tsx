import { BrowseHeader } from "@/components/services/browse-header";
import { ServiceCardSkeleton } from "@/components/services/service-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function BrowseServicesLoading() {
  return (
    <section
      className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
      aria-busy="true"
      aria-label="Loading services"
    >
      <BrowseHeader />
      <Skeleton className="h-32 rounded-3xl" />
      <Skeleton className="mt-8 mb-4 h-4 w-32" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <ServiceCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
