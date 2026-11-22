"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

function applyThemeClass(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const next: Theme = resolvedTheme === "dark" ? "light" : "dark";

    const switchTheme = () => {
      flushSync(() => setTheme(next));
      applyThemeClass(next);
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typeof document.startViewTransition !== "function" || reduceMotion) {
      switchTheme();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(switchTheme);

    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`],
          },
          {
            duration: 600,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {});
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleClick}
      aria-label="Switch between light and dark theme"
      title="Switch theme"
      className={cn(
        "size-10 rounded-full text-muted-foreground hover:bg-accent hover:text-primary",
        className,
      )}
    >
      <MoonIcon className="size-5 animate-in duration-500 spin-in-90 zoom-in-50 dark:hidden" />
      <SunIcon className="hidden size-5 animate-in duration-500 spin-in-90 zoom-in-50 dark:block" />
    </Button>
  );
}
