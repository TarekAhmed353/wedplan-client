import Link from "next/link";
import { CompassIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type NotFoundStateProps = {
  primaryHref: string;
  primaryLabel: string;
};

export function NotFoundState({ primaryHref, primaryLabel }: NotFoundStateProps) {
  return (
    <section className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="w-full max-w-md space-y-5 text-center">
        <p className="font-heading text-8xl font-semibold text-primary/15">404</p>
        <span className="mx-auto -mt-14 flex size-16 items-center justify-center rounded-full bg-accent text-primary">
          <CompassIcon className="size-7" />
        </span>
        <h1 className="text-3xl font-semibold sm:text-4xl">Page not found</h1>
        <p className="text-muted-foreground">
          The page you are looking for does not exist, or it may have moved.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild className="h-11 rounded-full px-6">
            <Link href={primaryHref}>{primaryLabel}</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-full px-6">
            <Link href="/services">Browse services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
