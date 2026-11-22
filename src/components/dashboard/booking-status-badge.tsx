import { BanIcon, CircleCheckIcon, CircleXIcon, ClockIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/lib/bookings";
import { cn } from "@/lib/utils";

const styles: Record<BookingStatus, { label: string; className: string; icon: typeof ClockIcon }> = {
  pending: { label: "Pending", className: "bg-gold/15 text-gold-foreground", icon: ClockIcon },
  accepted: { label: "Accepted", className: "bg-primary/10 text-primary", icon: CircleCheckIcon },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive", icon: CircleXIcon },
  cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground", icon: BanIcon },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const { label, className, icon: Icon } = styles[status];

  return (
    <Badge className={cn("gap-1 rounded-full border-0 px-2.5", className)}>
      <Icon className="size-3" />
      {label}
    </Badge>
  );
}
