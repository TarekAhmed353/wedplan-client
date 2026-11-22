"use client";

import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function GoogleButton({ redirectTo }: { redirectTo: string }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);

    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: redirectTo,
      newUserCallbackURL: "/choose-role",
      errorCallbackURL: "/sign-in",
    });

    if (error) {
      setIsLoading(false);
      toast.error(error.message || "Could not open Google sign in. Please try again.");
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="h-11 w-full rounded-full text-base"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <FcGoogle className="size-5" />
      )}
      Continue with Google
    </Button>
  );
}
