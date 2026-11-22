import Link from "next/link";
import { cn } from "@/lib/utils";

type FilterTab = {
  label: string;
  href: string;
  active: boolean;
  count?: number;
};

export function FilterTabs({ tabs, label }: { tabs: FilterTab[]; label: string }) {
  return (
    <nav aria-label={label} className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={tab.active ? "page" : undefined}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            tab.active
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground ring-1 ring-foreground/10 hover:text-primary",
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn("ml-1.5", tab.active ? "opacity-80" : "opacity-60")}>
              {tab.count}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}

export function withParams(basePath: string, current: URLSearchParams, changes: Record<string, string | null>) {
  const params = new URLSearchParams(current);
  params.delete("page");

  for (const [key, value] of Object.entries(changes)) {
    if (value) params.set(key, value);
    else params.delete(key);
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}
