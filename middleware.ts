import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server";
import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  // If the user is authenticated, allow access to protected routes
  if (
    (await convexAuth.isAuthenticated()) &&
    protectedRoutes.includes(request.nextUrl.pathname)
  ) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users trying to access protected routes
  if (
    !(await convexAuth.isAuthenticated()) &&
    protectedRoutes.includes(request.nextUrl.pathname)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login"; // Redirect to login page
    return NextResponse.redirect(url);
  }

  // Allow access to all other routes
  return NextResponse.next();
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
