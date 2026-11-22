"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ImagePlusIcon, Loader2Icon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import { allowedImageTypes, getImageError } from "@/lib/image-rules";
import {
  MAX_SERVICE_IMAGES,
  SERVICE_CATEGORIES,
  type ServiceInput,
  type ServiceInputErrors,
  validateServiceInput,
} from "@/lib/services";
import { uploadImage } from "@/lib/upload-image";

type PickedImage = {
  id: string;
  file: File;
  preview: string;
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

export function AddServiceForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<ServiceInput>({
    serviceName: "",
    category: "",
    description: "",
    price: "",
    location: "",
  });
  const [images, setImages] = useState<PickedImage[]>([]);
  const [errors, setErrors] = useState<ServiceInputErrors>({});
  const [status, setStatus] = useState<"idle" | "uploading" | "saving">("idle");

  const isSubmitting = status !== "idle";

  function updateField(key: keyof ServiceInput, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function handleImagesPicked(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) return;

    const room = MAX_SERVICE_IMAGES - images.length;
    const badFile = files.find((file) => getImageError(file));

    if (badFile) {
      setErrors((current) => ({
        ...current,
        images: `${badFile.name}: ${getImageError(badFile)}`,
      }));
      return;
    }

    if (files.length > room) {
      toast.error(`You can add ${room} more photo${room === 1 ? "" : "s"}.`);
    }

    const picked = await Promise.all(
      files.slice(0, room).map(async (file) => ({
        id: crypto.randomUUID(),
        file,
        preview: await readPreview(file),
      })),
    );

    setImages((current) => [...current, ...picked]);
    setErrors((current) => ({ ...current, images: undefined }));
  }

  function removeImage(id: string) {
    setImages((current) => current.filter((image) => image.id !== id));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateServiceInput(values, images.length);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setStatus("uploading");

    let imageUrls: string[];

    try {
      imageUrls = await Promise.all(images.map((image) => uploadImage(image.file)));
    } catch (error) {
      setStatus("idle");
      toast.error(
        error instanceof Error ? error.message : "Photo upload failed. Please try again.",
      );
      return;
    }

    setStatus("saving");

    try {
      await apiFetch("/api/services", {
        method: "POST",
        json: {
          serviceName: values.serviceName.trim(),
          category: values.category,
          description: values.description.trim(),
          price: Number(values.price),
          location: values.location.trim(),
          images: imageUrls,
        },
      });
    } catch (error) {
      setStatus("idle");

      if (error instanceof ApiError) {
        if (error.errors) {
          setErrors(error.errors as ServiceInputErrors);
        }
        toast.error(error.message);
        if (error.code === "FREE_LIMIT_REACHED") {
          router.refresh();
        }
        return;
      }

      toast.error("Could not save your service. Please try again.");
      return;
    }

    toast.success("Service submitted. It will go live once an admin approves it.");
    router.push("/dashboard/vendor/services");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-foreground/5 sm:p-8"
    >
      <FieldGroup>
        <div className="grid gap-5 md:grid-cols-2">
          <Field data-invalid={!!errors.serviceName}>
            <FieldLabel htmlFor="serviceName">Service name</FieldLabel>
            <Input
              id="serviceName"
              placeholder="For example, Golden Hour Photography"
              className={inputClass}
              value={values.serviceName}
              onChange={(event) => updateField("serviceName", event.target.value)}
              aria-invalid={!!errors.serviceName}
            />
            <FieldError>{errors.serviceName}</FieldError>
          </Field>

          <Field data-invalid={!!errors.category}>
            <FieldLabel htmlFor="category">Category</FieldLabel>
            <Select
              value={values.category}
              onValueChange={(value) => updateField("category", value)}
            >
              <SelectTrigger
                id="category"
                className="w-full rounded-xl px-3.5 data-[size=default]:h-11"
                aria-invalid={!!errors.category}
              >
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError>{errors.category}</FieldError>
          </Field>
        </div>

        <Field data-invalid={!!errors.description}>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            placeholder="What is included, how long it lasts, and what makes it special."
            className="min-h-32 rounded-xl px-3.5 py-3"
            maxLength={2000}
            value={values.description}
            onChange={(event) => updateField("description", event.target.value)}
            aria-invalid={!!errors.description}
          />
          <FieldDescription className="text-xs">
            {values.description.trim().length} / 2000 characters, at least 20
          </FieldDescription>
          <FieldError>{errors.description}</FieldError>
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field data-invalid={!!errors.price}>
            <FieldLabel htmlFor="price">Price</FieldLabel>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground">
                ৳
              </span>
              <Input
                id="price"
                inputMode="numeric"
                placeholder="25000"
                className={`${inputClass} pl-8`}
                value={values.price}
                onChange={(event) =>
                  updateField("price", event.target.value.replace(/\D/g, ""))
                }
                aria-invalid={!!errors.price}
              />
            </div>
            <FieldError>{errors.price}</FieldError>
          </Field>

          <Field data-invalid={!!errors.location}>
            <FieldLabel htmlFor="location">Location</FieldLabel>
            <Input
              id="location"
              placeholder="For example, Dhaka"
              className={inputClass}
              value={values.location}
              onChange={(event) => updateField("location", event.target.value)}
              aria-invalid={!!errors.location}
            />
            <FieldError>{errors.location}</FieldError>
          </Field>
        </div>

        <Field data-invalid={!!errors.images}>
          <FieldLabel htmlFor="images">Photos</FieldLabel>
          <FieldDescription className="text-xs">
            Add 1 to {MAX_SERVICE_IMAGES} photos. JPG, PNG or WebP, up to 2 MB
            each. The first photo is the cover.
          </FieldDescription>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10"
              >
                <Image
                  src={image.preview}
                  alt={`Photo ${index + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 rounded-full bg-gold px-2 py-0.5 text-[0.65rem] font-medium text-gold-foreground">
                    Cover
                  </span>
                )}
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 right-2 size-7 rounded-full shadow-sm"
                  onClick={() => removeImage(image.id)}
                  disabled={isSubmitting}
                  aria-label={`Remove photo ${index + 1}`}
                >
                  <XIcon className="size-3.5" />
                </Button>
              </div>
            ))}
            {images.length < MAX_SERVICE_IMAGES && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 bg-accent/40 text-sm text-primary transition-colors hover:bg-accent disabled:opacity-50"
              >
                <ImagePlusIcon className="size-6" />
                Add photos
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            id="images"
            type="file"
            multiple
            accept={allowedImageTypes.join(",")}
            className="sr-only"
            onChange={handleImagesPicked}
          />
          <FieldError>{errors.images}</FieldError>
        </Field>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-full px-6"
            onClick={() => router.push("/dashboard/vendor/services")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-11 rounded-full px-6"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            {status === "uploading" && "Uploading photos..."}
            {status === "saving" && "Saving service..."}
            {status === "idle" && "Submit for review"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
