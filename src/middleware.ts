import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // TODO: Add proper auth checking here.
  // For now, allow all requests except for a simulated auth check.
  const isAuthenticated = false; // Replace with actual auth check. Set to false to test unauthenticated flow.
  const userRole = 'mahasiswa'; // Replace with actual user role from session/token

  const { pathname } = request.nextUrl;
  
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/continue-registration');

  // If user is not authenticated and tries to access a protected route,
  // redirect them to the landing page.
  if (!isAuthenticated && !isAuthRoute && pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If user is authenticated and tries to access login/register or the landing page,
  // redirect them to the dashboard.
  if (isAuthenticated && (isAuthRoute || pathname === '/')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protect admin routes
  if (pathname.startsWith('/admin') && userRole !== 'admin' && userRole !== 'dosen') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
