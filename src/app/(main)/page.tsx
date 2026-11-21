export default function Home() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-xl w-full rounded-2xl border bg-card p-8 space-y-5">
        <p className="text-xs tracking-[0.25em] uppercase text-gold">
          Theme check
        </p>
        <h1 className="text-4xl font-semibold leading-tight">
          Wed<span className="text-primary">Plan</span> plum and champagne
        </h1>
        <p className="text-muted-foreground">
          This paragraph should be in Inter, and the heading above should be in
          Playfair Display.
        </p>
        <div className="flex flex-wrap gap-3">
          <span className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">
            Primary
          </span>
          <span className="rounded-full bg-gold px-5 py-2 text-sm text-gold-foreground">
            Gold
          </span>
          <span className="rounded-full bg-secondary px-5 py-2 text-sm text-secondary-foreground">
            Secondary
          </span>
          <span className="rounded-full bg-accent px-5 py-2 text-sm text-accent-foreground">
            Accent
          </span>
        </div>
      </div>
    </div>
  );
}