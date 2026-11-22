import { Skeleton } from "@/components/ui/skeleton";

export default function ServiceDetailsLoading() {
  return (
    <section
      className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      aria-busy="true"
      aria-label="Loading service"
    >
      <Skeleton className="mb-6 h-4 w-40" />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-8">
          <Skeleton className="aspect-4/3 rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-48 rounded-full" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        <Skeleton className="h-[30rem] rounded-3xl" />
      </div>
    </section>
  );
}
