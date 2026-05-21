import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/investments',
  '/affordability',
  '/scenarios',
  '/ai-chat',
  '/advisor',
  '/goals',
  '/profile',
  '/settings',
];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const hasSession = request.cookies.get('fisight_auth')?.value === '1';
  if (!hasSession) {
    const login = new URL('/login', request.url);
    login.searchParams.set('from', pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/investments/:path*',
    '/affordability/:path*',
    '/scenarios/:path*',
    '/ai-chat/:path*',
    '/advisor/:path*',
    '/goals/:path*',
    '/profile/:path*',
    '/settings/:path*',
  ],
};
