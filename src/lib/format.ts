const takaFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number) {
  return `৳${takaFormatter.format(amount)}`;
}
