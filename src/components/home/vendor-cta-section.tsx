import Link from "next/link";
import { CrownIcon, HeartHandshakeIcon } from "lucide-react";
import { Reveal } from "@/components/home/reveal";
import { Button } from "@/components/ui/button";

export function VendorCtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-primary-foreground ring-1 ring-transparent sm:px-12 dark:bg-accent dark:text-foreground dark:ring-gold/20">
          <div className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-xs font-medium tracking-[0.25em] text-gold uppercase">
                <HeartHandshakeIcon className="size-4" />
                For wedding vendors
              </p>
              <h2 className="text-3xl font-semibold text-primary-foreground sm:text-4xl dark:text-foreground">
                Grow your wedding business with WedPlan
              </h2>
              <p className="max-w-2xl text-primary-foreground/80 dark:text-foreground/80">
                List up to 3 services for free and reply to booking requests from
                your dashboard. Go Premium for unlimited services and a Premium
                badge on every listing.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="h-12 rounded-full bg-gold px-7 text-base text-gold-foreground hover:bg-gold/90">
                <Link href="/sign-up?role=vendor">
                  <CrownIcon />
                  Join as a vendor
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
