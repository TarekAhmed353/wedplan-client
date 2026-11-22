import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl space-y-3",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <p className="text-xs font-medium tracking-[0.25em] text-gold uppercase">{eyebrow}</p>
      <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
