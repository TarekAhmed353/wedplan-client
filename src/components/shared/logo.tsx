import Link from "next/link";
import { GemIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  onClick?: () => void;
};

export function Logo({ className, onClick }: LogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="WedPlan home"
      className={cn("flex shrink-0 items-center gap-2", className)}
    >
      <span className="flex size-9 items-center justify-center rounded-full bg-primary text-gold">
        <GemIcon className="size-4.5" />
      </span>
      <span className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        Wed<span className="text-primary">Plan</span>
      </span>
    </Link>
  );
}
