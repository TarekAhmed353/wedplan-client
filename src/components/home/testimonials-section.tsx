import { QuoteIcon, StarIcon } from "lucide-react";
import { Reveal } from "@/components/home/reveal";
import { SectionHeading } from "@/components/home/section-heading";

const testimonials = [
  {
    quote:
      "We found our photographer and our caterer in one evening. Seeing the prices first saved us so many calls.",
    name: "Nusrat",
    place: "Dhaka",
    booked: "Photography and catering",
  },
  {
    quote:
      "The decorator accepted our request the next day. Being able to see every request in one dashboard kept us calm.",
    name: "Tanvir",
    place: "Chattogram",
    booked: "Decoration",
  },
  {
    quote:
      "I booked my bridal makeup and my mother's makeup together. Simple, clear and no surprises on the day.",
    name: "Farhana",
    place: "Sylhet",
    booked: "Makeup and styling",
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-accent/40">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="mb-12">
          <SectionHeading
            eyebrow="Customer testimonials"
            title="Couples who planned with WedPlan"
          />
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <Reveal key={item.name} delay={index * 0.1}>
              <figure className="flex h-full flex-col gap-5 rounded-3xl bg-card p-7 shadow-sm ring-1 ring-foreground/5">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5 text-gold" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }, (_, star) => (
                      <StarIcon key={star} className="size-4 fill-current" />
                    ))}
                  </div>
                  <QuoteIcon className="size-7 text-primary/15" />
                </div>
                <blockquote className="flex-1 text-foreground/90">{item.quote}</blockquote>
                <figcaption className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-full bg-primary font-heading text-lg text-primary-foreground">
                    {item.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block font-medium">
                      {item.name}, {item.place}
                    </span>
                    <span className="block text-xs text-muted-foreground">Booked {item.booked.toLowerCase()}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
