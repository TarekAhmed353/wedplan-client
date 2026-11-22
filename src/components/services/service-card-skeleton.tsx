import { Skeleton } from "@/components/ui/skeleton";

export function ServiceCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-foreground/5">
      <Skeleton className="aspect-4/3 rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-7 rounded-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex items-center justify-between border-t border-border pt-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}
