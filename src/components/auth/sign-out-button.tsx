"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2Icon, LogOutIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    const { error } = await authClient.signOut();

    if (error) {
      setIsLoading(false);
      toast.error("Could not log you out. Please try again.");
      return;
    }

    toast.success("You have logged out.");
    router.push("/");
    router.refresh();
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className="h-11 rounded-full px-6"
    >
      {isLoading ? <Loader2Icon className="animate-spin" /> : <LogOutIcon />}
      Log out
    </Button>
  );
}
