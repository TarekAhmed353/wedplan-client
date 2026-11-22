import Link from "next/link";
import { ArrowRightIcon, StoreIcon } from "lucide-react";
import { Reveal } from "@/components/home/reveal";
import { SectionHeading } from "@/components/home/section-heading";
import { ServiceCard } from "@/components/services/service-card";
import { Button } from "@/components/ui/button";
import { publicApiFetch } from "@/lib/public-api";
import type { PublicServiceList } from "@/lib/services";

export async function FeaturedServices() {
  let data: PublicServiceList | null = null;

  try {
    data = await publicApiFetch<PublicServiceList>("/api/services?sort=newest");
  } catch {
    data = null;
  }

  const services = data?.services.slice(0, 8) ?? [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <SectionHeading
          align="left"
          eyebrow="Featured services"
          title="Loved by couples, reviewed by us"
          description="The newest approved services on WedPlan, ready for your booking request."
        />
        <Button asChild variant="outline" className="h-11 rounded-full px-5">
          <Link href="/services">
            View all services
            <ArrowRightIcon />
          </Link>
        </Button>
      </Reveal>

      {services.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service, index) => (
            <Reveal key={service._id} delay={Math.min(index, 3) * 0.08}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
          <StoreIcon className="size-8 text-muted-foreground" />
          <p className="font-heading text-xl font-semibold">
            {data ? "New services are on the way" : "Services could not be loaded"}
          </p>
          <p className="max-w-md text-sm text-muted-foreground">
            {data
              ? "Vendors are adding their services. Check back soon, or list your own."
              : "Please refresh the page in a moment."}
          </p>
        </div>
      )}
    </section>
  );
}
