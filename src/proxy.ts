import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  if (getSessionCookie(request)) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;
  const signInUrl = new URL("/sign-in", request.url);
  signInUrl.searchParams.set("redirect", `${pathname}${search}`);

  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/choose-role",
    "/account-blocked",
    "/services/:path+",
    "/payment/:path*",
  ],
};
