export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 400 400"
      role="img"
      aria-label="Two gold wedding rings surrounded by flowers"
      className="h-auto w-full"
    >
      <circle cx="200" cy="200" r="180" className="fill-card" />
      <circle cx="200" cy="200" r="180" className="fill-none stroke-gold/40" strokeWidth="1.5" strokeDasharray="4 8" />
      <circle cx="200" cy="200" r="150" className="fill-accent/70" />

      <g className="stroke-primary/60" fill="none" strokeWidth="2" strokeLinecap="round">
        <path d="M70 250c30-10 52-38 58-70" />
        <path d="M86 236c-10-14-10-30 0-42 12 10 14 28 0 42Z" className="fill-primary/10" />
        <path d="M108 214c-14-8-20-24-14-38 14 6 22 22 14 38Z" className="fill-primary/10" />
        <path d="M122 190c-12-10-14-26-6-38 12 8 16 24 6 38Z" className="fill-primary/10" />
        <path d="M330 250c-30-10-52-38-58-70" />
        <path d="M314 236c10-14 10-30 0-42-12 10-14 28 0 42Z" className="fill-primary/10" />
        <path d="M292 214c14-8 20-24 14-38-14 6-22 22-14 38Z" className="fill-primary/10" />
        <path d="M278 190c12-10 14-26 6-38-12 8-16 24-6 38Z" className="fill-primary/10" />
      </g>

      <g className="stroke-gold" fill="none" strokeWidth="10">
        <circle cx="168" cy="210" r="52" />
        <circle cx="232" cy="210" r="52" />
      </g>
      <g className="stroke-card" fill="none" strokeWidth="2" opacity="0.7">
        <circle cx="168" cy="210" r="52" />
        <circle cx="232" cy="210" r="52" />
      </g>

      <g className="fill-gold">
        <path d="M232 146l8 10-8 10-8-10Z" />
      </g>
      <g className="fill-card">
        <path d="M232 150l4 6-4 6-4-6Z" />
      </g>

      <g className="fill-primary/70">
        <circle cx="200" cy="96" r="10" />
        <circle cx="186" cy="104" r="8" className="fill-primary/40" />
        <circle cx="214" cy="104" r="8" className="fill-primary/40" />
        <circle cx="200" cy="112" r="6" className="fill-gold" />
      </g>

      <g className="fill-gold">
        <path d="M96 120l3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" />
        <path d="M312 110l2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" />
        <path d="M318 300l3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" />
        <path d="M80 300l2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" />
      </g>

      <path
        d="M140 322c20 10 40 14 60 14s40-4 60-14"
        className="stroke-gold"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
