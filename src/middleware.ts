import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/', '/privacy', '/features'];

export async function middleware(request: NextRequest) {
  try {
    // Create a response and get the cookies
    const response = NextResponse.next();
    
    // Create supabase client using request and response
    const supabase = createMiddlewareClient({ req: request, res: response });

    // Refresh session if expired - required for Server Components
    await supabase.auth.getSession();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Allow access to public routes without authentication
    if (publicRoutes.includes(request.nextUrl.pathname)) {
      return response;
    }

    // If there is no session and the user is trying to access a protected route
    if (!session && !request.nextUrl.pathname.startsWith('/auth')) {
      const redirectUrl = new URL('/auth/signin', request.url);
      redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If there is a session and the user is trying to access auth routes
    if (session && request.nextUrl.pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/agent', request.url));
    }

    return response;
  } catch (e) {
    // If there's an error, return the next response to avoid blocking the request
    console.error('Middleware error:', e);
    return NextResponse.next();
  }
}

// Specify which routes should be protected
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 