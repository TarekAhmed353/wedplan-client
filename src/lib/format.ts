const takaFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatPrice(amount: number) {
  return `৳${takaFormatter.format(amount)}`;
}

export function formatDate(value: string | Date) {
  return dateFormatter.format(new Date(value));
}
