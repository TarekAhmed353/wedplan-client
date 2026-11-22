import {
  BanknoteIcon,
  CalendarCheckIcon,
  LayoutDashboardIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { Reveal } from "@/components/home/reveal";
import { SectionHeading } from "@/components/home/section-heading";

const reasons = [
  {
    icon: ShieldCheckIcon,
    title: "Reviewed vendors",
    text: "Our team checks every service before couples can see it.",
  },
  {
    icon: BanknoteIcon,
    title: "Clear prices",
    text: "See the price in taka up front, before you ask for a booking.",
  },
  {
    icon: CalendarCheckIcon,
    title: "Simple booking requests",
    text: "Pick your date and place, add a note, and the vendor replies.",
  },
  {
    icon: LayoutDashboardIcon,
    title: "Everything in one place",
    text: "Track every request and every answer from your own dashboard.",
  },
];

export function WhyChooseSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal className="mb-12">
        <SectionHeading
          eyebrow="Why choose WedPlan"
          title="Less stress, more celebrating"
          description="Planning a wedding is a lot. WedPlan keeps the vendor part simple."
        />
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((reason, index) => (
          <Reveal key={reason.title} delay={index * 0.08}>
            <div className="h-full space-y-3 rounded-2xl bg-card p-6 text-center shadow-sm ring-1 ring-foreground/5">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-gold/15 text-gold">
                <reason.icon className="size-6" />
              </span>
              <h3 className="text-xl font-semibold">{reason.title}</h3>
              <p className="text-sm text-muted-foreground">{reason.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
