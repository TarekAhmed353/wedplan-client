"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  CameraIcon,
  CircleCheckIcon,
  CircleIcon,
  Loader2Icon,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { PasswordInput } from "@/components/auth/password-input";
import { RolePicker, type SignUpRole } from "@/components/auth/role-picker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { allowedImageTypes, getImageError } from "@/lib/image-rules";
import { getPasswordError, passwordRules } from "@/lib/password-rules";
import { uploadImage } from "@/lib/upload-image";
import { cn } from "@/lib/utils";
import { isValidEmail } from "@/lib/validators";

type FormValues = {
  name: string;
  email: string;
  password: string;
  role: SignUpRole | "";
  businessName: string;
};

type FormErrors = Partial<Record<keyof FormValues | "photo", string>>;

function validate(values: FormValues) {
  const errors: FormErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Please enter your full name.";
  }

  if (!isValidEmail(values.email)) {
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
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "creating" | "uploading">(
    "idle",
  );
  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    password: "",
    role: defaultRole,
    businessName: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const isSubmitting = status !== "idle";

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  function updateField<K extends keyof FormValues>(
    key: K,
    value: FormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const imageError = getImageError(file);

    if (imageError) {
      setErrors((current) => ({ ...current, photo: imageError }));
      return;
    }

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setErrors((current) => ({ ...current, photo: undefined }));
  }

  function removePhoto() {
    setPhoto(null);
    setPhotoPreview(null);
    setErrors((current) => ({ ...current, photo: undefined }));
  }

  function finishSignUp() {
    router.push("/");
    router.refresh();
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

    setStatus("creating");

    const { error } = await authClient.signUp.email({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
      role: values.role,
      ...(values.role === "vendor" && businessName ? { businessName } : {}),
    });

    if (error) {
      setStatus("idle");
      toast.error(error.message || "Could not create your account. Please try again.");
      return;
    }

    if (photo) {
      setStatus("uploading");

      try {
        const image = await uploadImage(photo);
        const { error: updateError } = await authClient.updateUser({ image });

        if (updateError) {
          throw new Error(updateError.message);
        }
      } catch {
        toast.warning(
          "Account created, but the photo did not upload. You can add it later in Profile settings.",
        );
        finishSignUp();
        return;
      }
    }

    toast.success("Account created. Welcome to WedPlan.");
    finishSignUp();
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
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="Create a password"
            className={inputClass}
            value={values.password}
            onChange={(event) => updateField("password", event.target.value)}
            aria-invalid={!!errors.password}
            aria-describedby="password-rules"
          />
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

        <Field data-invalid={!!errors.photo}>
          <FieldLabel htmlFor="photo">
            Profile photo
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </FieldLabel>
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              {photoPreview && (
                <AvatarImage src={photoPreview} alt="Profile photo preview" />
              )}
              <AvatarFallback className="bg-accent text-primary">
                <UserIcon className="size-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 rounded-full px-4"
                  onClick={() => photoInputRef.current?.click()}
                >
                  <CameraIcon />
                  {photo ? "Change photo" : "Choose photo"}
                </Button>
                {photo && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-9 rounded-full px-4 text-muted-foreground"
                    onClick={removePhoto}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <FieldDescription className="text-xs">
                JPG, PNG or WebP. Max 2 MB.
              </FieldDescription>
            </div>
          </div>
          <input
            ref={photoInputRef}
            id="photo"
            type="file"
            accept={allowedImageTypes.join(",")}
            className="sr-only"
            onChange={handlePhotoChange}
          />
          <FieldError>{errors.photo}</FieldError>
        </Field>

        <RolePicker
          value={values.role}
          onChange={(role) => updateField("role", role)}
          error={errors.role}
        />

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
          {status === "creating" && "Creating account..."}
          {status === "uploading" && "Uploading photo..."}
          {status === "idle" && "Create account"}
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
