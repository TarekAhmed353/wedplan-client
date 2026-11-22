export type UserRole = "customer" | "vendor" | "admin";

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole | null;
  roleChosen?: boolean;
  isBlocked: boolean;
  isPremium: boolean;
  businessName?: string | null;
  subscriptionPlan?: string;
  subscriptionExpiresAt?: string | null;
  createdAt: string;
};

export type AdminUserList = {
  users: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  counts: Record<"all" | UserRole, number>;
};

export type AdminUserDetails = {
  user: AdminUser;
  stats: {
    services: number;
    bookingsSent: number;
    bookingsReceived: number;
    payments: number;
  };
};

export type TransactionStatus = "pending" | "paid" | "expired" | "failed";

export type Transaction = {
  _id: string;
  vendor?: {
    _id: string;
    name: string;
    email?: string;
    businessName?: string | null;
    image?: string | null;
  } | null;
  plan: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  stripeSessionId?: string | null;
  stripeInvoiceId?: string | null;
  paidAt?: string | null;
  createdAt: string;
};

export type TransactionList = {
  transactions: Transaction[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  counts: Record<"all" | TransactionStatus, number>;
  revenue: number;
  currency: string;
};

export function formatMoney(amount: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}
