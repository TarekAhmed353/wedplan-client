import { CircleCheckIcon, ClockIcon, CircleXIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ServiceStatus } from "@/lib/services";
import { cn } from "@/lib/utils";

const statusStyles: Record<
  ServiceStatus,
  { label: string; className: string; icon: typeof ClockIcon }
> = {
  pending: {
    label: "Pending review",
    className: "bg-gold/15 text-gold-foreground dark:text-gold",
    icon: ClockIcon,
  },
  approved: {
    label: "Approved",
    className: "bg-primary/10 text-primary",
    icon: CircleCheckIcon,
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive",
    icon: CircleXIcon,
  },
};

export function ServiceStatusBadge({ status }: { status: ServiceStatus }) {
  const { label, className, icon: Icon } = statusStyles[status];

  return (
    <Badge className={cn("gap-1 rounded-full border-0 px-2.5", className)}>
      <Icon className="size-3" />
      {label}
    </Badge>
  );
}
