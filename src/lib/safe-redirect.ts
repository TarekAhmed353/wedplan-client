export function getSafeRedirect(value: unknown, fallback = "/dashboard") {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/\\")
  ) {
    return fallback;
  }

  return value;
}

export function withRedirect(path: string, redirectTo: string) {
  return redirectTo === "/dashboard"
    ? path
    : `${path}?redirect=${encodeURIComponent(redirectTo)}`;
}
