"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CircleCheckIcon,
  CircleIcon,
  EyeIcon,
  EyeOffIcon,
  HeartIcon,
  Loader2Icon,
  StoreIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { authClient } from "@/lib/auth-client";
import { getPasswordError, passwordRules } from "@/lib/password-rules";
import { cn } from "@/lib/utils";

export type SignUpRole = "customer" | "vendor";

type FormValues = {
  name: string;
  email: string;
  password: string;
  role: SignUpRole | "";
  businessName: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const roleOptions = [
  {
    value: "customer",
    title: "Customer",
    description: "I am planning a wedding.",
    icon: HeartIcon,
  },
  {
    value: "vendor",
    title: "Vendor",
    description: "I offer wedding services.",
    icon: StoreIcon,
  },
] as const;

function validate(values: FormValues) {
  const errors: FormErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Please enter your full name.";
  }

  if (!emailPattern.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  const passwordError = getPasswordError(values.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  if (!values.role) {
    errors.role = "Please choose how you want to use WedPlan.";
  }

  return errors;
}

const inputClass = "h-11 rounded-xl px-3.5";

export function SignUpForm({ defaultRole }: { defaultRole: SignUpRole | "" }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    password: "",
    role: defaultRole,
    businessName: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  function updateField<K extends keyof FormValues>(
    key: K,
    value: FormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    const businessName = values.businessName.trim();

    setIsSubmitting(true);

    const { error } = await authClient.signUp.email({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
      role: values.role,
      ...(values.role === "vendor" && businessName ? { businessName } : {}),
    });

    if (error) {
      setIsSubmitting(false);
      toast.error(error.message || "Could not create your account. Please try again.");
      return;
    }

    toast.success("Account created. Welcome to WedPlan.");
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Full name</FieldLabel>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Your full name"
            className={inputClass}
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            aria-invalid={!!errors.name}
          />
          <FieldError>{errors.name}</FieldError>
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClass}
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            aria-invalid={!!errors.email}
          />
          <FieldError>{errors.email}</FieldError>
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              className={cn(inputClass, "pr-11")}
              value={values.password}
              onChange={(event) => updateField("password", event.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby="password-rules"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-1.5 size-8 -translate-y-1/2 rounded-full text-muted-foreground"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </Button>
          </div>
          <ul id="password-rules" className="grid gap-1.5 sm:grid-cols-3">
            {passwordRules.map((rule) => {
              const passed = rule.test(values.password);
              const Icon = passed ? CircleCheckIcon : CircleIcon;
              return (
                <li
                  key={rule.label}
                  className={cn(
                    "flex items-center gap-1.5 text-xs",
                    passed ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-3.5 shrink-0" />
                  {rule.label}
                </li>
              );
            })}
          </ul>
          <FieldError>{errors.password}</FieldError>
        </Field>

        <FieldSet data-invalid={!!errors.role}>
          <FieldLegend variant="label">I want to join as</FieldLegend>
          <RadioGroup
            value={values.role}
            onValueChange={(value) => updateField("role", value as SignUpRole)}
            className="grid gap-3 sm:grid-cols-2"
            aria-invalid={!!errors.role}
          >
            {roleOptions.map((option) => (
              <FieldLabel
                key={option.value}
                htmlFor={`role-${option.value}`}
                className="rounded-xl!"
              >
                <Field orientation="horizontal" className="p-3.5!">
                  <FieldContent>
                    <FieldTitle>
                      <option.icon className="size-4 text-primary" />
                      {option.title}
                    </FieldTitle>
                    <FieldDescription>{option.description}</FieldDescription>
                  </FieldContent>
                  <RadioGroupItem
                    value={option.value}
                    id={`role-${option.value}`}
                  />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
          <FieldError>{errors.role}</FieldError>
        </FieldSet>

        {values.role === "vendor" && (
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
              className={inputClass}
              value={values.businessName}
              onChange={(event) =>
                updateField("businessName", event.target.value)
              }
            />
          </Field>
        )}

        <Button
          type="submit"
          className="h-11 w-full rounded-full text-base"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2Icon className="animate-spin" />}
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </FieldGroup>
    </form>
  );
}
