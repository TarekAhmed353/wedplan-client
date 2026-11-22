import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-full max-w-lg" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-foreground/5"
          >
            <Skeleton className="size-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-16" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-24 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
