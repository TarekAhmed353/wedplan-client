"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { UserMenu, type NavUser } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse services" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type NavbarProps = {
  user: NavUser | null;
};

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-18 lg:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent text-primary"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-primary",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button
                asChild
                variant="ghost"
                className="h-10 rounded-full px-5 text-primary hover:bg-accent hover:text-primary"
              >
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild className="h-10 rounded-full px-5">
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          )}

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon-lg"
                aria-label="Open menu"
                className="size-10 rounded-full md:hidden"
              >
                <MenuIcon className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="gap-0 bg-background">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Main navigation links
              </SheetDescription>

              <div className="flex h-16 items-center border-b border-border px-5">
                <Logo onClick={closeMenu} />
              </div>

              <nav aria-label="Mobile" className="flex flex-col gap-1 p-3">
                {navLinks.map((link) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "rounded-xl px-4 py-3 text-base font-medium transition-colors",
                        active
                          ? "bg-accent text-primary"
                          : "text-foreground hover:bg-accent/60 hover:text-primary",
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {user ? null : (
                <div className="mt-auto flex flex-col gap-3 border-t border-border p-5">
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 rounded-full border-primary/30 text-primary hover:bg-accent hover:text-primary"
                  >
                    <Link href="/sign-in" onClick={closeMenu}>
                      Sign in
                    </Link>
                  </Button>
                  <Button asChild className="h-11 rounded-full">
                    <Link href="/sign-up" onClick={closeMenu}>
                      Sign up
                    </Link>
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
