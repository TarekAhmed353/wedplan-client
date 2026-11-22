"use client";

import { motion, useReducedMotion } from "motion/react";

const sparkles = [
  { top: "14%", left: "6%", size: 14, delay: 0 },
  { top: "72%", left: "4%", size: 10, delay: 1.2 },
  { top: "86%", left: "30%", size: 12, delay: 2.1 },
  { top: "10%", left: "46%", size: 10, delay: 0.6 },
  { top: "18%", left: "93%", size: 14, delay: 1.6 },
  { top: "80%", left: "95%", size: 10, delay: 2.6 },
  { top: "52%", left: "50%", size: 8, delay: 0.9 },
];

function Sparkle({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden className="fill-gold">
      <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6Z" />
    </svg>
  );
}

export function HeroBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)] dark:opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, var(--gold) 1px, transparent 1.5px)",
          backgroundSize: "26px 26px",
        }}
      />

      <motion.div
        className="absolute -top-40 -left-32 size-120 rounded-full bg-primary/15 blur-3xl dark:bg-primary/20"
        animate={reduceMotion ? undefined : { x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-24 -bottom-48 size-136 rounded-full bg-gold/20 blur-3xl dark:bg-gold/15"
        animate={reduceMotion ? undefined : { x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 left-1/3 size-72 rounded-full bg-accent blur-3xl dark:bg-primary/10"
        animate={reduceMotion ? undefined : { scale: [1, 1.15, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute top-1/2 -right-56 hidden size-176 -translate-y-1/2 rounded-full border border-gold/25 lg:block" />
      <div className="absolute top-1/2 -right-32 hidden size-128 -translate-y-1/2 rounded-full border border-gold/15 lg:block" />
      <div className="absolute -bottom-24 -left-24 size-80 rounded-full border border-gold/20" />

      {sparkles.map((sparkle) => (
        <motion.div
          key={`${sparkle.top}-${sparkle.left}`}
          className="absolute"
          style={{ top: sparkle.top, left: sparkle.left }}
          initial={{ opacity: 0.5 }}
          animate={reduceMotion ? undefined : { opacity: [0.25, 0.9, 0.25], scale: [0.85, 1.1, 0.85] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: sparkle.delay }}
        >
          <Sparkle size={sparkle.size} />
        </motion.div>
      ))}
    </div>
  );
}
