"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERVICE_CATEGORIES, type ServiceStatus } from "@/lib/services";
import { cn } from "@/lib/utils";

const ALL = "all";

const tabs: { value: typeof ALL | ServiceStatus; label: string }[] = [
  { value: ALL, label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export function AdminServiceFilters({
  counts,
}: {
  counts: Record<typeof ALL | ServiceStatus, number>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const activeStatus = searchParams.get("status") ?? ALL;
  const category = searchParams.get("category") ?? ALL;

  function hrefWith(changes: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    for (const [key, value] of Object.entries(changes)) {
      if (!value || value === ALL) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(hrefWith({ search: search.trim() || null }));
  }

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col gap-3 md:flex-row">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2" role="search">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by service name"
              aria-label="Search services by name"
              className="h-11 rounded-full bg-card pl-10"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Button type="submit" className="h-11 rounded-full px-5">
            Search
          </Button>
        </form>

        <Select
          value={category}
          onValueChange={(value) => router.push(hrefWith({ category: value }))}
        >
          <SelectTrigger
            aria-label="Filter by category"
            className="w-full rounded-full bg-card px-4 data-[size=default]:h-11 md:w-64"
          >
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All categories</SelectItem>
            {SERVICE_CATEGORIES.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = activeStatus === tab.value;
          return (
            <Link
              key={tab.value}
              href={hrefWith({ status: tab.value })}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground ring-1 ring-foreground/10 hover:text-primary",
              )}
            >
              {tab.label}
              <span className={cn("ml-1.5", active ? "opacity-80" : "opacity-60")}>
                {counts[tab.value]}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
