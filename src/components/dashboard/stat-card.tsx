import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: number | string;
  icon: LucideIcon;
};

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-foreground/5">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm text-muted-foreground">{label}</p>
        <p className="font-heading text-3xl font-semibold">{value}</p>
      </div>
    </div>
  );
}
