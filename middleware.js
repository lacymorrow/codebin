import { getCookie } from 'cookies-next';
import { NextResponse } from 'next/server';

export function middleware(req) {
    const token = getCookie('token', { req });

    const protectedRoutes = ['/dashboard', '/profile'];

    if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
        if (!token) {
            const loginUrl = new URL('/', req.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*'],
};
