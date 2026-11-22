import { SparklesIcon } from "lucide-react";

export function SectionPlaceholder({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-accent text-primary">
        <SparklesIcon className="size-5" />
      </span>
      <p className="font-heading text-xl font-semibold">This section is on the way</p>
      <p className="max-w-md text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
