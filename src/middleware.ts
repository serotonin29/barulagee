import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // NOTE: True auth checking is handled client-side with Firebase listeners.
  // This middleware is for basic redirection and route protection.
  // It doesn't have access to the full client-side auth state.
  
  const isAuthenticated = request.cookies.has('firebase-auth-cookie'); // Placeholder cookie name, Firebase auth handles this better on client
  const { pathname } = request.nextUrl;
  
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/continue-registration');

  // Let Firebase client-side auth handle redirects, this is a fallback.
  // if (!isAuthenticated && !isAuthRoute && pathname !== '/') {
  //   return NextResponse.redirect(new URL('/', request.url))
  // }
  
  // if (isAuthenticated && (isAuthRoute || pathname === '/')) {
  //     return NextResponse.redirect(new URL('/dashboard', request.url))
  // }

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
