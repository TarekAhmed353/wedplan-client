"use client";

import Link from "next/link";
import "./globals.css";

export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-background p-6 font-sans text-foreground">
        <title>Something went wrong | WedPlan</title>
        <div className="w-full max-w-md space-y-5 rounded-3xl bg-card p-8 text-center shadow-sm ring-1 ring-foreground/5">
          <p className="text-xs font-medium tracking-[0.25em] text-gold uppercase">WedPlan</p>
          <h1 className="text-3xl font-semibold">Something went wrong</h1>
          <p className="text-muted-foreground">
            The site could not load. Please try again in a moment.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => retry()}
              className="h-11 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground"
            >
              Try again
            </button>
            <Link
              href="/"
              className="flex h-11 items-center rounded-full border border-border px-6 text-sm font-medium"
            >
              Go to home page
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
