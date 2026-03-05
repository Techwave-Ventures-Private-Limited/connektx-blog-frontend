// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('user_token')?.value;
  const onboardingCompleted = request.cookies.get('onboarding_completed')?.value === 'true';
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isOnboardingPage = pathname.startsWith('/onboarding');
  const isProtectedPage = 
    pathname.startsWith('/explore') || 
    pathname.startsWith('/profile') || 
    pathname.startsWith('/conversations');

  // Case 1: Not logged in -> Kick to login
  if (!token && (isProtectedPage || isOnboardingPage)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Case 2: Logged in but profile NOT done -> Force onboarding
  // (Don't redirect if they are already ON the onboarding page to avoid infinite loops)
  if (token && !onboardingCompleted && isProtectedPage) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  // Case 3: Logged in and profile IS done -> Don't let them go back to login/signup/onboarding
  if (token && onboardingCompleted && (isAuthPage || isOnboardingPage)) {
    return NextResponse.redirect(new URL('/explore', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/explore/:path*', 
    '/profile/:path*', 
    '/messages/:path*', 
    '/onboarding/:path*',
    '/conversations/:path*',
    '/login', 
    '/signup'
  ],
};