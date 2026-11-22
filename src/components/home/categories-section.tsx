import Link from "next/link";
import {
  ArrowRightIcon,
  Building2Icon,
  CameraIcon,
  Flower2Icon,
  ShirtIcon,
  SparklesIcon,
  UtensilsCrossedIcon,
} from "lucide-react";
import { Reveal } from "@/components/home/reveal";
import { SectionHeading } from "@/components/home/section-heading";
import type { ServiceCategory } from "@/lib/services";

const categories: { name: ServiceCategory; description: string; icon: typeof CameraIcon }[] = [
  { name: "Photography & Videography", description: "Capture every look and every laugh.", icon: CameraIcon },
  { name: "Wedding Venues", description: "Halls, gardens and rooftops for every guest list.", icon: Building2Icon },
  { name: "Decoration & Florist", description: "Stages, gates, flowers and lights.", icon: Flower2Icon },
  { name: "Catering Services", description: "Biryani, roasts, desserts and more.", icon: UtensilsCrossedIcon },
  { name: "Makeup & Styling", description: "Bridal makeup, hair and mehendi.", icon: SparklesIcon },
  { name: "Wedding Fashion", description: "Lehengas, sherwanis and tailoring.", icon: ShirtIcon },
];

export function CategoriesSection() {
  return (
    <section className="bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="mb-10">
          <SectionHeading
            eyebrow="Categories"
            title="Everything your wedding needs"
            description="Pick a category to see the services in it."
          />
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Reveal key={category.name} delay={(index % 3) * 0.08}>
              <Link
                href={`/services?category=${encodeURIComponent(category.name)}`}
                className="group flex h-full items-start gap-4 rounded-2xl bg-card p-6 shadow-sm ring-1 ring-foreground/5 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/20"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <category.icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-heading text-xl font-semibold">{category.name}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{category.description}</span>
                </span>
                <ArrowRightIcon className="mt-1 size-4 shrink-0 text-gold transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
