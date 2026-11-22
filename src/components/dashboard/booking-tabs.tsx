import Link from "next/link";
import { BOOKING_TABS, type BookingCounts } from "@/lib/booking-types";
import { cn } from "@/lib/utils";

type BookingTabsProps = {
  basePath: string;
  active: string;
  counts: BookingCounts;
};

export function BookingTabs({ basePath, active, counts }: BookingTabsProps) {
  return (
    <nav aria-label="Filter by status" className="mb-6 flex flex-wrap gap-2">
      {BOOKING_TABS.map((tab) => {
        const isActive = active === tab.value;
        return (
          <Link
            key={tab.value}
            href={tab.value === "all" ? basePath : `${basePath}?status=${tab.value}`}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground ring-1 ring-foreground/10 hover:text-primary",
            )}
          >
            {tab.label}
            <span className={cn("ml-1.5", isActive ? "opacity-80" : "opacity-60")}>
              {counts[tab.value]}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
