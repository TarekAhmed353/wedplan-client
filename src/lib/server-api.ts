import { headers } from "next/headers";
import { ApiError, sendApiRequest, type ApiOptions } from "@/lib/api-error";
import { auth } from "@/lib/auth";

export async function serverApiFetch<T>(path: string, options?: ApiOptions) {
  const result = await auth.api
    .getToken({ headers: await headers() })
    .catch(() => null);

  if (!result?.token) {
    throw new ApiError("Please sign in to continue", 401);
  }

  return sendApiRequest<T>(path, result.token, options);
}
