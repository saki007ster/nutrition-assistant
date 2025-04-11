import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const error = requestUrl.searchParams.get('error');
    const error_description = requestUrl.searchParams.get('error_description');

    // If there's an error from Supabase auth, redirect to signin with error
    if (error || error_description) {
      return NextResponse.redirect(
        new URL(`/auth/signin?error=${encodeURIComponent(error_description || error || 'Unknown error')}`, request.url)
      );
    }

    // If no code is provided, redirect to signin
    if (!code) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    // Exchange the code for a session
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Auth callback error:', error);
    // In case of any error, redirect to signin with a generic error message
    return NextResponse.redirect(
      new URL('/auth/signin?error=Authentication%20failed', request.url)
    );
  }
} 