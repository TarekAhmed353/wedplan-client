import type { BookingStatus } from "@/lib/bookings";

export type BookingCounts = Record<"all" | BookingStatus, number>;

export type BookingServiceSummary = {
  _id: string;
  serviceName: string;
  images: string[];
  category: string;
  price: number;
  location: string;
};

export type BookingPerson = {
  _id: string;
  name: string;
  businessName?: string | null;
  image?: string | null;
  email?: string;
};

export type Booking = {
  _id: string;
  serviceId: string;
  vendorId: string;
  customerId: string;
  eventDate: string;
  eventLocation: string;
  message: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  service?: BookingServiceSummary | null;
};

export type CustomerBooking = Booking & { vendor?: BookingPerson | null };

export type VendorBooking = Booking & { customer?: BookingPerson | null };

export const BOOKING_TABS: { value: "all" | BookingStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];
