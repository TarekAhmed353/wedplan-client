const dhakaDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Dhaka",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function todayInDhaka() {
  return dhakaDate.format(new Date());
}

export function addYears(dateText: string, years: number) {
  const [year, month, day] = dateText.split("-").map(Number);
  return `${year + years}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled";

export type BookingInput = {
  eventDate: string;
  eventLocation: string;
  message: string;
};

export type BookingInputErrors = Partial<Record<keyof BookingInput, string>>;

export function validateBookingInput(values: BookingInput) {
  const errors: BookingInputErrors = {};
  const today = todayInDhaka();
  const location = values.eventLocation.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.eventDate)) {
    errors.eventDate = "Choose your event date.";
  } else if (values.eventDate < today) {
    errors.eventDate = "The event date cannot be in the past.";
  } else if (values.eventDate > addYears(today, 2)) {
    errors.eventDate = "The event date must be within the next 2 years.";
  }

  if (location.length < 2 || location.length > 200) {
    errors.eventLocation = "Enter where the event will happen.";
  }

  if (values.message.trim().length > 1000) {
    errors.message = "Keep the message under 1000 characters.";
  }

  return errors;
}
