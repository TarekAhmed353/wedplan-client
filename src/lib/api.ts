import { ApiError, sendApiRequest, type ApiOptions } from "@/lib/api-error";
import { authClient } from "@/lib/auth-client";

export async function apiFetch<T>(path: string, options?: ApiOptions) {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new ApiError("Please sign in to continue", 401);
  }

  return sendApiRequest<T>(path, data.token, options);
}
