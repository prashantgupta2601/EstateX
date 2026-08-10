import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Protect /admin routes (except /admin/login) -> require ADMIN role
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (token.role !== 'ADMIN') {
      const unauthorizedUrl = new URL('/login', request.url);
      unauthorizedUrl.searchParams.set('error', 'UnauthorizedAdminAccess');
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  // Protect /seller routes -> require SELLER or ADMIN role
  if (pathname.startsWith('/seller')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (token.role !== 'SELLER' && token.role !== 'ADMIN') {
      const unauthorizedUrl = new URL('/login', request.url);
      unauthorizedUrl.searchParams.set('error', 'UnauthorizedSellerAccess');
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  // Protect generic /dashboard routes -> require any valid authentication session
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/seller/:path*', '/dashboard/:path*'],
};
