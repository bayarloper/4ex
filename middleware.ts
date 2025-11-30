import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Export runtime config to use Node.js runtime instead of Edge
export const config = {
  runtime: 'nodejs',
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};

export async function middleware(request: NextRequest) {
  // Import auth dynamically to avoid Edge Runtime issues
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  const isAuthPage = request.nextUrl.pathname.startsWith("/signin") || 
                     request.nextUrl.pathname.startsWith("/signup");
  
  // Define routes that require authentication
  const protectedRoutes = ["/profile", "/admin"];
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  // Only redirect to signin for truly protected routes (profile, admin)
  if (!session && isProtectedRoute) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect to home if already authenticated and trying to access auth pages
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
