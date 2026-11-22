import { sendApiRequest, type ApiOptions } from "@/lib/api-error";

export function publicApiFetch<T>(path: string, options?: ApiOptions) {
  return sendApiRequest<T>(path, null, options);
}
