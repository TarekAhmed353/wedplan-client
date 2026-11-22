export const SERVICE_CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export const MAX_SERVICE_IMAGES = 5;

export const MAX_SERVICE_PRICE = 10_000_000;

export type PlanSummary = {
  plan: "free" | "premium";
  activeServices: number;
  limit: number | null;
  canAddService: boolean;
  subscriptionExpiresAt: string | null;
};

export type ServiceInput = {
  serviceName: string;
  category: string;
  description: string;
  price: string;
  location: string;
};

export type ServiceInputErrors = Partial<
  Record<keyof ServiceInput | "images", string>
>;

export function validateServiceInput(values: ServiceInput, imageCount: number) {
  const errors: ServiceInputErrors = {};
  const name = values.serviceName.trim();
  const description = values.description.trim();
  const location = values.location.trim();
  const price = Number(values.price);

  if (name.length < 3 || name.length > 100) {
    errors.serviceName = "Service name must be 3 to 100 characters.";
  }

  if (!SERVICE_CATEGORIES.includes(values.category as ServiceCategory)) {
    errors.category = "Please choose a category.";
  }

  if (description.length < 20 || description.length > 2000) {
    errors.description = "Description must be 20 to 2000 characters.";
  }

  if (
    !values.price ||
    !Number.isInteger(price) ||
    price < 1 ||
    price > MAX_SERVICE_PRICE
  ) {
    errors.price = "Enter a whole number of taka, for example 25000.";
  }

  if (location.length < 2 || location.length > 100) {
    errors.location = "Location must be 2 to 100 characters.";
  }

  if (imageCount < 1 || imageCount > MAX_SERVICE_IMAGES) {
    errors.images = `Add 1 to ${MAX_SERVICE_IMAGES} photos of your service.`;
  }

  return errors;
}
