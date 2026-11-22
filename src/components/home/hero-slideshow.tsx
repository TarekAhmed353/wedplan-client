"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const slides = [
  {
    src: "https://i.ibb.co/9HbsTCPZ/photo-1583939003579-730e3918a45a-w-1600-q-80-fm-jpg.jpg",
    alt: "A bride and groom kiss as guests throw confetti",
    label: "Photography",
  },
  {
    src: "https://i.ibb.co/jPHQ15vM/photo-1529636798458-92182e662485-w-1600-q-80-fm-jpg.jpg",
    alt: "A wedding arch draped with cloth and a large bouquet of roses",
    label: "Decoration and florals",
  },
  {
    src: "https://i.ibb.co/rKDyLDpt/photo-1537633552985-df8429e8048b-w-1600-q-80-fm-jpg.jpg",
    alt: "A couple in wedding clothes on a pebble beach by the sea",
    label: "Beach venues",
  },
  {
    src: "https://i.ibb.co/QvbdV0Mq/photo-1487412947147-5cebf100ffc2-w-1600-q-80-fm-jpg.jpg",
    alt: "A make-up artist painting a bride's lips",
    label: "Makeup and styling",
  },
  {
    src: "https://i.ibb.co/21LxxzkS/photo-1591604466107-ec97de577aff-w-1600-q-80-fm-jpg.jpg",
    alt: "A smiling couple holding a bouquet beside a lake",
    label: "Wedding films",
  },
];

const SLIDE_SECONDS = 5;

export function HeroSlideshow() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || reduceMotion) return;

    const timer = setTimeout(() => {
      setDirection(1);
      setIndex((current) => (current + 1) % slides.length);
    }, SLIDE_SECONDS * 1000);

    return () => clearTimeout(timer);
  }, [index, paused, reduceMotion]);

  function goTo(next: number) {
    if (next === index) return;
    setDirection(next > index ? 1 : -1);
    setIndex(next);
  }

  const slide = slides[index];
  const upcoming = slides[(index + 1) % slides.length];

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Wedding photos"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="absolute inset-0 translate-x-4 translate-y-4 rotate-3 rounded-[2rem] border-2 border-gold/50" />
      <div className="absolute inset-0 -translate-x-3 -translate-y-3 -rotate-2 rounded-[2rem] bg-accent/70" />

      <div className="relative aspect-4/5 overflow-hidden rounded-[2rem] bg-muted shadow-xl ring-1 ring-foreground/10">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={slide.src}
            custom={direction}
            className="absolute inset-0"
            variants={{
              enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%" }),
              center: { x: "0%" },
              exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%" }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduceMotion ? { duration: 0 } : { duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}: ${slide.label}`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 40vw, (min-width: 640px) 70vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-foreground/60 to-transparent dark:from-background/80" />
          </motion.div>
        </AnimatePresence>

        <Image
          src={upcoming.src}
          alt=""
          aria-hidden
          width={8}
          height={10}
          sizes="(min-width: 1024px) 40vw, (min-width: 640px) 70vw, 100vw"
          className="pointer-events-none absolute size-px opacity-0"
        />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
          <span className="rounded-full bg-card/90 px-3.5 py-1.5 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm">
            {slide.label}
          </span>
          <div className="flex items-center gap-1.5" role="group" aria-label="Choose a photo">
            {slides.map((item, dot) => (
              <button
                key={item.src}
                type="button"
                onClick={() => goTo(dot)}
                aria-label={`Show photo ${dot + 1}: ${item.label}`}
                aria-current={dot === index}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  dot === index ? "w-6 bg-gold" : "w-2 bg-card/70 hover:bg-card",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
