"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SearchIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERVICE_CATEGORIES, SERVICE_SORTS } from "@/lib/services";

const ALL = "all";
const selectClass = "w-full rounded-full bg-card px-4 data-[size=default]:h-11";

export function ServiceFilters({ locations }: { locations: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const category = searchParams.get("category") ?? ALL;
  const location = searchParams.get("location") ?? ALL;
  const sort = searchParams.get("sort") ?? "newest";
  const hasFilters = ["search", "category", "location", "sort"].some((key) =>
    searchParams.get(key),
  );

  function update(changes: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    for (const [key, value] of Object.entries(changes)) {
      if (!value || value === ALL || (key === "sort" && value === "newest")) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    update({ search: search.trim() || null });
  }

  return (
    <div className="space-y-3 rounded-3xl bg-secondary/60 p-4 sm:p-5">
      <form onSubmit={handleSearch} className="flex gap-2" role="search">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search photographers, venues, caterers..."
            aria-label="Search services"
            className="h-11 rounded-full bg-card pl-11"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Button type="submit" className="h-11 rounded-full px-6">
          Search
        </Button>
      </form>

      <div className="grid gap-2 sm:grid-cols-3">
        <Select value={category} onValueChange={(value) => update({ category: value })}>
          <SelectTrigger aria-label="Filter by category" className={selectClass}>
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

        <Select value={location} onValueChange={(value) => update({ location: value })}>
          <SelectTrigger aria-label="Filter by location" className={selectClass}>
            <SelectValue placeholder="All locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All locations</SelectItem>
            {location !== ALL && !locations.includes(location) && (
              <SelectItem value={location}>{location}</SelectItem>
            )}
            {locations.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(value) => update({ sort: value })}>
          <SelectTrigger aria-label="Sort services" className={selectClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SERVICE_SORTS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Link
          href={pathname}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
          onClick={() => setSearch("")}
        >
          <XIcon className="size-4" />
          Clear filters
        </Link>
      )}
    </div>
  );
}
