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

export type ServiceStatus = "pending" | "approved" | "rejected";

export type Service = {
  _id: string;
  vendorId: string;
  serviceName: string;
  category: ServiceCategory;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: ServiceStatus;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
};

export const SERVICE_STATUSES: ServiceStatus[] = ["pending", "approved", "rejected"];

export type ServiceVendor = {
  _id: string;
  name: string;
  email: string;
  businessName?: string | null;
  image?: string | null;
};

export type AdminService = Service & { vendor?: ServiceVendor };

export type AdminServiceList = {
  services: AdminService[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  counts: Record<"all" | ServiceStatus, number>;
};

export type PublicVendor = {
  _id: string;
  name: string;
  businessName: string | null;
  image: string | null;
  isPremium: boolean;
};

export type PublicService = Omit<Service, "description" | "vendorId"> & {
  vendor: PublicVendor;
};

export type ServiceDetail = Omit<Service, "vendorId"> & {
  vendor: PublicVendor;
};

export const SERVICE_SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;

export type ServiceSort = (typeof SERVICE_SORTS)[number]["value"];

export type PublicServiceList = {
  services: PublicService[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  sort: ServiceSort;
};

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
