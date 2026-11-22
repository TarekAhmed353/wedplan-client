import Link from "next/link";
import { ArrowRightIcon, BadgeCheckIcon, BanknoteIcon, SearchIcon } from "lucide-react";
import { HeroBackground } from "@/components/home/hero-background";
import { HeroSlideshow } from "@/components/home/hero-slideshow";
import { Reveal } from "@/components/home/reveal";
import { Button } from "@/components/ui/button";

const highlights = [
  { label: "Every vendor reviewed by our team", icon: BadgeCheckIcon },
  { label: "Prices shown in taka", icon: BanknoteIcon },
  { label: "Free to browse", icon: SearchIcon },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-accent via-background to-secondary">
      <HeroBackground />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
        <Reveal className="space-y-7">
          <p className="text-xs font-medium tracking-[0.25em] text-gold uppercase">
            Plan your wedding in one place
          </p>
          <h1 className="text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl">
            Find trusted vendors for your{" "}
            <span className="text-primary italic">big day</span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Photographers, venues, decorators, caterers, stylists and designers.
            Compare prices, read the details, and send booking requests without
            the endless phone calls.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="h-12 rounded-full px-7 text-base">
              <Link href="/services">
                Explore wedding services
                <ArrowRightIcon />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-primary/30 bg-card/60 px-7 text-base text-primary hover:bg-accent hover:text-primary"
            >
              <Link href="/sign-up?role=vendor">Become a vendor</Link>
            </Button>
          </div>
          <ul className="flex flex-wrap gap-2.5">
            {highlights.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 rounded-full bg-card/85 py-1.5 pr-4 pl-1.5 text-sm font-medium text-foreground shadow-sm ring-1 ring-gold/40 backdrop-blur-sm"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-gold text-gold-foreground">
                  <item.icon className="size-4" />
                </span>
                {item.label}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.15} className="mx-auto w-full max-w-sm sm:max-w-md lg:max-w-104">
          <HeroSlideshow />
        </Reveal>
      </div>
    </section>
  );
}
