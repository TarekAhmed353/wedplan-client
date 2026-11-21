"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function AuthErrorToast({ message }: { message: string | null }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!message) return;

    toast.error(message, { id: "auth-error" });
    router.replace(pathname);
  }, [message, pathname, router]);

  return null;
}
