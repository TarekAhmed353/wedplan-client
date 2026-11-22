"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ServiceGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-3">
      <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-muted ring-1 ring-foreground/5">
        <Image
          src={images[active]}
          alt={`${name}, photo ${active + 1} of ${images.length}`}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-pressed={active === index}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl bg-muted ring-2 transition",
                active === index
                  ? "ring-primary"
                  : "ring-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image src={image} alt="" fill sizes="20vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
