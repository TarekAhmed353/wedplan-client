"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { CameraIcon, Loader2Icon, UserIcon } from "lucide-react";
import { toast } from "sonner";
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
import { uploadImage } from "@/lib/upload-image";

type ProfileFormProps = {
  name: string;
  email: string;
  image: string | null;
  role: string;
  businessName: string | null;
};

const inputClass = "h-11 rounded-xl px-3.5";

function readPreview(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ProfileForm({ name, email, image, role, businessName }: ProfileFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isVendor = role === "vendor";
  const [values, setValues] = useState({ name, businessName: businessName ?? "" });
  const [currentImage, setCurrentImage] = useState<string | null>(image);
  const [newPhoto, setNewPhoto] = useState<{ file: File; preview: string } | null>(null);
  const [errors, setErrors] = useState<{ name?: string; businessName?: string; photo?: string }>({});
  const [status, setStatus] = useState<"idle" | "uploading" | "saving">("idle");

  const isSubmitting = status !== "idle";
  const shownImage = newPhoto?.preview ?? currentImage;

  async function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const imageError = getImageError(file);
    if (imageError) {
      setErrors((current) => ({ ...current, photo: imageError }));
      return;
    }

    setNewPhoto({ file, preview: await readPreview(file) });
    setErrors((current) => ({ ...current, photo: undefined }));
  }

  function removePhoto() {
    setNewPhoto(null);
    setCurrentImage(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: typeof errors = {};
    const trimmedName = values.name.trim();
    const trimmedBusiness = values.businessName.trim();

    if (trimmedName.length < 2 || trimmedName.length > 80) {
      nextErrors.name = "Name must be 2 to 80 characters.";
    }
    if (isVendor && trimmedBusiness.length > 80) {
      nextErrors.businessName = "Business name must be 80 characters or less.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    let imageToSave = currentImage;

    if (newPhoto) {
      setStatus("uploading");
      try {
        imageToSave = await uploadImage(newPhoto.file, "profile");
      } catch (error) {
        setStatus("idle");
        toast.error(error instanceof Error ? error.message : "Photo upload failed.");
        return;
      }
    }

    setStatus("saving");

    const { error } = await authClient.updateUser({
      name: trimmedName,
      image: imageToSave,
      ...(isVendor ? { businessName: trimmedBusiness || null } : {}),
    });

    setStatus("idle");

    if (error) {
      toast.error(error.message || "Could not save your profile.");
      return;
    }

    setCurrentImage(imageToSave);
    setNewPhoto(null);
    toast.success("Profile saved.");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-foreground/5 sm:p-8"
    >
      <FieldGroup>
        <Field data-invalid={!!errors.photo}>
          <FieldLabel htmlFor="photo">Profile photo</FieldLabel>
          <div className="flex items-center gap-4">
            <Avatar className="size-20">
              {shownImage ? <AvatarImage src={shownImage} alt="Profile photo" /> : null}
              <AvatarFallback className="bg-accent text-primary">
                <UserIcon className="size-7" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 rounded-full px-4"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                >
                  <CameraIcon />
                  {shownImage ? "Change photo" : "Add photo"}
                </Button>
                {shownImage && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-9 rounded-full px-4 text-muted-foreground"
                    onClick={removePhoto}
                    disabled={isSubmitting}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <FieldDescription className="text-xs">JPG, PNG or WebP. Max 2 MB.</FieldDescription>
            </div>
          </div>
          <input
            ref={fileInputRef}
            id="photo"
            type="file"
            accept={allowedImageTypes.join(",")}
            className="sr-only"
            onChange={handlePhotoChange}
          />
          <FieldError>{errors.photo}</FieldError>
        </Field>

        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Full name</FieldLabel>
          <Input
            id="name"
            autoComplete="name"
            className={inputClass}
            value={values.name}
            onChange={(event) => {
              setValues((current) => ({ ...current, name: event.target.value }));
              setErrors((current) => ({ ...current, name: undefined }));
            }}
            aria-invalid={!!errors.name}
          />
          <FieldError>{errors.name}</FieldError>
        </Field>

        {isVendor && (
          <Field data-invalid={!!errors.businessName}>
            <FieldLabel htmlFor="businessName">
              Business name
              <span className="font-normal text-muted-foreground">(optional)</span>
            </FieldLabel>
            <Input
              id="businessName"
              autoComplete="organization"
              className={inputClass}
              value={values.businessName}
              onChange={(event) => {
                setValues((current) => ({ ...current, businessName: event.target.value }));
                setErrors((current) => ({ ...current, businessName: undefined }));
              }}
              aria-invalid={!!errors.businessName}
            />
            <FieldDescription className="text-xs">
              Shown to couples on your services instead of your own name.
            </FieldDescription>
            <FieldError>{errors.businessName}</FieldError>
          </Field>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" value={email} readOnly disabled className={inputClass} />
          <FieldDescription className="text-xs">Your email cannot be changed.</FieldDescription>
        </Field>

        <div className="flex justify-end">
          <Button type="submit" className="h-11 rounded-full px-6" disabled={isSubmitting}>
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            {status === "uploading" && "Uploading photo..."}
            {status === "saving" && "Saving..."}
            {status === "idle" && "Save changes"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
