export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  code?: string;
  errors?: Record<string, string>;

  constructor(
    message: string,
    status: number,
    code?: string,
    errors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

export type ApiOptions = Omit<RequestInit, "body"> & {
  json?: unknown;
};

export async function sendApiRequest<T>(
  path: string,
  token: string | null,
  { json, headers, ...init }: ApiOptions = {},
): Promise<T> {
  const requestHeaders = new Headers(headers);

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  if (json !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: requestHeaders,
      body: json !== undefined ? JSON.stringify(json) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Could not reach the server. Please try again", 0);
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      data?.message || "Something went wrong. Please try again",
      response.status,
      data?.code,
      data?.errors,
    );
  }

  return data as T;
}
