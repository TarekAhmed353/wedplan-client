"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { RolePicker, type SignUpRole } from "@/components/auth/role-picker";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function ChooseRoleForm() {
  const router = useRouter();
  const [role, setRole] = useState<SignUpRole | "">("");
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!role) {
      setError("Please choose how you want to use WedPlan.");
      toast.error("Please choose a role first.");
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/account/role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, businessName: businessName.trim() }),
    }).catch(() => null);
    const result = await response?.json().catch(() => null);

    if (!response?.ok) {
      setIsSubmitting(false);
      toast.error(result?.message || "Could not save your role. Please try again.");

      if (response?.status === 409) {
        router.push("/dashboard");
        router.refresh();
      }
      return;
    }

    toast.success(
      role === "vendor"
        ? "You are all set as a vendor."
        : "You are all set as a customer.",
    );
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        <RolePicker
          value={role}
          onChange={(next) => {
            setRole(next);
            setError(undefined);
          }}
          error={error}
        />

        {role === "vendor" && (
          <Field>
            <FieldLabel htmlFor="businessName">
              Business name
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </FieldLabel>
            <Input
              id="businessName"
              autoComplete="organization"
              placeholder="For example, Golden Frame Studio"
              className="h-11 rounded-xl px-3.5"
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
            />
          </Field>
        )}

        <Button
          type="submit"
          className="h-11 w-full rounded-full text-base"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2Icon className="animate-spin" />}
          {isSubmitting ? "Saving..." : "Continue"}
        </Button>
      </FieldGroup>
    </form>
  );
}
