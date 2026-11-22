"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import {
  addYears,
  type BookingInput,
  type BookingInputErrors,
  todayInDhaka,
  validateBookingInput,
} from "@/lib/bookings";

export function BookingForm({ serviceId }: { serviceId: string }) {
  const router = useRouter();
  const [today] = useState(todayInDhaka);
  const [values, setValues] = useState<BookingInput>({
    eventDate: "",
    eventLocation: "",
    message: "",
  });
  const [errors, setErrors] = useState<BookingInputErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(key: keyof BookingInput, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateBookingInput(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiFetch("/api/bookings", {
        method: "POST",
        json: {
          serviceId,
          eventDate: values.eventDate,
          eventLocation: values.eventLocation.trim(),
          message: values.message.trim(),
        },
      });
    } catch (error) {
      setIsSubmitting(false);

      if (error instanceof ApiError) {
        if (error.errors) setErrors(error.errors as BookingInputErrors);
        toast.error(error.message);
        return;
      }

      toast.error("Could not send your request. Please try again.");
      return;
    }

    toast.success("Booking request sent. The vendor will reply soon.");
    router.push("/dashboard/customer/bookings");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FieldGroup className="gap-4">
        <Field data-invalid={!!errors.eventDate}>
          <FieldLabel htmlFor="eventDate">Event date</FieldLabel>
          <Input
            id="eventDate"
            type="date"
            min={today}
            max={addYears(today, 2)}
            className="h-11 rounded-xl px-3.5"
            value={values.eventDate}
            onChange={(event) => updateField("eventDate", event.target.value)}
            aria-invalid={!!errors.eventDate}
          />
          <FieldError>{errors.eventDate}</FieldError>
        </Field>

        <Field data-invalid={!!errors.eventLocation}>
          <FieldLabel htmlFor="eventLocation">Event location</FieldLabel>
          <Input
            id="eventLocation"
            placeholder="For example, Gulshan, Dhaka"
            className="h-11 rounded-xl px-3.5"
            value={values.eventLocation}
            onChange={(event) => updateField("eventLocation", event.target.value)}
            aria-invalid={!!errors.eventLocation}
          />
          <FieldError>{errors.eventLocation}</FieldError>
        </Field>

        <Field data-invalid={!!errors.message}>
          <FieldLabel htmlFor="message">
            Message
            <span className="font-normal text-muted-foreground">(optional)</span>
          </FieldLabel>
          <Textarea
            id="message"
            placeholder="Guest count, timings, or anything the vendor should know."
            className="min-h-24 rounded-xl px-3.5 py-3"
            maxLength={1000}
            value={values.message}
            onChange={(event) => updateField("message", event.target.value)}
            aria-invalid={!!errors.message}
          />
          <FieldDescription className="text-xs">
            {values.message.trim().length} / 1000 characters
          </FieldDescription>
          <FieldError>{errors.message}</FieldError>
        </Field>

        <Button
          type="submit"
          className="h-11 w-full rounded-full text-base"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2Icon className="animate-spin" />}
          {isSubmitting ? "Sending request..." : "Request booking"}
        </Button>
      </FieldGroup>
    </form>
  );
}
