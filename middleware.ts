import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server";
import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const pathname = request.nextUrl.pathname;
  
  // Check if this is a protected route
  if (!protectedRoutes.includes(pathname)) {
    // Allow access to all non-protected routes
    return NextResponse.next();
  }

  // For protected routes, check authentication with error handling
  try {
    const isAuthenticated = await convexAuth.isAuthenticated();
    
    if (isAuthenticated) {
      // User is authenticated, allow access
      return NextResponse.next();
    } else {
      // User is not authenticated, redirect to login
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
