export const PREMIUM_PRICE_LABEL = "$9.99";

export const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["Up to 3 active services", "Basic vendor dashboard", "Booking request management"],
  },
  {
    id: "premium",
    name: "Premium",
    price: PREMIUM_PRICE_LABEL,
    period: "per month",
    features: ["Unlimited active services", "Premium vendor badge", "All Free plan features"],
  },
] as const;

export type PaymentStatus = {
  status: "pending" | "paid" | "expired" | "failed";
  amount: number;
  currency: string;
  plan: string;
  isPremium: boolean;
  subscriptionExpiresAt: string | null;
};

const longDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Dhaka",
});

export function formatLongDate(value: string) {
  return longDate.format(new Date(value));
}
