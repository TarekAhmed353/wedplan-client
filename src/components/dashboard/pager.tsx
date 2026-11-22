import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type PagerProps = {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
};

export function Pager({ page, totalPages, hrefFor }: PagerProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pages" className="mt-6 flex items-center justify-between gap-3">
      {page > 1 ? (
        <Button asChild variant="outline" className="h-10 rounded-full">
          <Link href={hrefFor(page - 1)}>
            <ChevronLeftIcon />
            Previous
          </Link>
        </Button>
      ) : (
        <span />
      )}
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      {page < totalPages ? (
        <Button asChild variant="outline" className="h-10 rounded-full">
          <Link href={hrefFor(page + 1)}>
            Next
            <ChevronRightIcon />
          </Link>
        </Button>
      ) : (
        <span />
      )}
    </nav>
  );
}
