const eventDateFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const requestDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Dhaka",
});

export function formatEventDate(value: string) {
  return eventDateFormatter.format(new Date(value));
}

export function formatRequestDate(value: string) {
  return requestDateFormatter.format(new Date(value));
}
