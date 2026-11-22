import type { Metadata } from "next";
import { Logo } from "@/components/shared/logo";
import { NotFoundState } from "@/components/shared/not-found-state";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col bg-linear-to-br from-accent via-background to-secondary">
      <header className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Logo />
      </header>
      <NotFoundState primaryHref="/" primaryLabel="Go to home page" />
    </main>
  );
}
