"use client";

import { HeartIcon, StoreIcon } from "lucide-react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type SignUpRole = "customer" | "vendor";

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

type RolePickerProps = {
  value: SignUpRole | "";
  onChange: (role: SignUpRole) => void;
  error?: string;
};

export function RolePicker({ value, onChange, error }: RolePickerProps) {
  return (
    <FieldSet data-invalid={!!error}>
      <FieldLegend variant="label">I want to join as</FieldLegend>
      <RadioGroup
        value={value}
        onValueChange={(next) => onChange(next as SignUpRole)}
        className="grid gap-3 sm:grid-cols-2"
        aria-invalid={!!error}
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
      <FieldError>{error}</FieldError>
    </FieldSet>
  );
}
