"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CloudAlertIcon, RotateCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  error: unknown;
  retry: () => void;
  homeHref?: string;
  homeLabel?: string;
};

export function ErrorState({
  error,
  retry,
  homeHref = "/",
  homeLabel = "Go to home page",
}: ErrorStateProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest = error instanceof Error && "digest" in error ? String(error.digest) : null;

  return (
    <section className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="w-full max-w-md space-y-5 rounded-3xl bg-card p-8 text-center shadow-sm ring-1 ring-foreground/5 sm:p-10">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <CloudAlertIcon className="size-7" />
        </span>
        <h1 className="text-3xl font-semibold">Something went wrong</h1>
        <p className="text-muted-foreground">
          We could not load this page. Please try again in a moment.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={() => retry()} className="h-11 rounded-full px-6">
            <RotateCwIcon />
            Try again
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-full px-6">
            <Link href={homeHref}>{homeLabel}</Link>
          </Button>
        </div>
        {digest && <p className="text-xs text-muted-foreground">Error code: {digest}</p>}
      </div>
    </section>
  );
}
