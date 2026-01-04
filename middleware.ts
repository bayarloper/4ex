import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Export runtime config to use Node.js runtime instead of Edge
export const config = {
  runtime: 'nodejs',
  // IMPORTANT: Keep middleware scope narrow; `auth()` is expensive.
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/posts/new",
    "/posts/:path*/edit",
    "/signin",
    "/signup",
  ],
};

export async function middleware(request: NextRequest) {
  // Import auth dynamically to avoid Edge Runtime issues
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  const isAuthPage = request.nextUrl.pathname.startsWith("/signin") || 
                     request.nextUrl.pathname.startsWith("/signup");
  
  const isEditPostRoute = request.nextUrl.pathname.startsWith("/posts/") && request.nextUrl.pathname.endsWith("/edit");

  // Define routes that require authentication
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname === "/posts/new" ||
    isEditPostRoute;

  const isAdminOnlyRoute =
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname === "/posts/new" ||
    isEditPostRoute;
  
  // Only redirect to signin for truly protected routes (profile, admin)
  if (!session && isProtectedRoute) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Block non-admins from admin-only routes
  if (session && isAdminOnlyRoute && session.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect to home if already authenticated and trying to access auth pages
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
