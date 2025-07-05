import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server";
import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const pathname = request.nextUrl.pathname;

  if (!protectedRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  try {
    const isAuthenticated = await convexAuth.isAuthenticated();

    if (isAuthenticated) {
      return NextResponse.next();
    } else {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  } catch (error) {
    // If authentication check fails (e.g., Convex not available),
    // redirect to login as a safe fallback
    console.error("Authentication check failed:", error);
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
