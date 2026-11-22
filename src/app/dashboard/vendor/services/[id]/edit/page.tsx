import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InfoIcon } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { ServiceForm } from "@/components/dashboard/service-form";
import { ApiError } from "@/lib/api-error";
import { serverApiFetch } from "@/lib/server-api";
import type { Service } from "@/lib/services";

export const metadata: Metadata = {
  title: "Edit service",
};

export default async function EditServicePage({
  params,
}: PageProps<"/dashboard/vendor/services/[id]/edit">) {
  const { id } = await params;
  let service: Service;

  try {
    ({ service } = await serverApiFetch<{ service: Service }>(
      `/api/vendor/services/${encodeURIComponent(id)}`,
    ));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <>
      <PageHeader title="Edit service" description={service.serviceName} />
      <div className="mb-6 flex items-start gap-3 rounded-2xl bg-accent/60 px-4 py-3 text-sm text-primary">
        <InfoIcon className="mt-0.5 size-4 shrink-0" />
        <p>
          Saving your changes sends this service back to an admin for review.
          It is hidden from customers until it is approved again.
        </p>
      </div>
      <ServiceForm service={service} />
    </>
  );
}
