import { ShieldAlertIcon } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";

export function BlockedNotice() {
  return (
    <section className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 text-center shadow-sm ring-1 ring-foreground/5 sm:p-10">
        <span className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlertIcon className="size-6" />
        </span>
        <h1 className="mb-2 text-3xl font-semibold">Your account is blocked</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          You cannot use the dashboard or book services right now. Please
          contact hello@wedplan.com if you think this is a mistake.
        </p>
        <SignOutButton />
      </div>
    </section>
  );
}
